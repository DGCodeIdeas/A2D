import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import * as vtracer from "@visioncortex/vtracer";

export interface VectorizeOptions {
  targetSize?: number; // 64, 128, 256, 512, 1024
  numColors?: number; // 4 to 16
  removeBackground?: boolean;
  cornerSmoothing?: number;
  suppressSpeckles?: number;
  mode?: "spline" | "pixel";
  title?: string;
}

export interface VectorizeResult {
  inkscapeSvg: string;
  plainSvg: string;
  palette: string[];
  stats: {
    layerCount: number;
    pathCount: number;
    nodeCount: number;
    targetSize: number;
  };
  layers: Array<{
    id: string;
    label: string;
    color: string;
    lum: number;
    pathCount: number;
  }>;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function vectorizeImageToInkscape(
  imageBuffer: Buffer,
  options: VectorizeOptions = {}
): VectorizeResult {
  const {
    targetSize = 512,
    numColors = 8,
    removeBackground = true,
    cornerSmoothing,
    suppressSpeckles,
    title = "Inkscape Vector Asset",
  } = options;

  const tmpDir = os.tmpdir();
  const runId = `vec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const inputPath = path.join(tmpDir, `${runId}_in.png`);
  const prepPath = path.join(tmpDir, `${runId}_prep.png`);
  const rawSvgPath = path.join(tmpDir, `${runId}_raw.svg`);
  const cleanSvgPath = path.join(tmpDir, `${runId}_clean.svg`);

  const createdFiles: string[] = [inputPath, prepPath, rawSvgPath, cleanSvgPath];

  try {
    fs.writeFileSync(inputPath, imageBuffer);

    // Pre-clean image with ImageMagick:
    // 1. Ensure target dimension (e.g. 512x512)
    // 2. Crop out bottom 28px if a watermark like pollinations logo is present
    try {
      execSync(
        `convert "${inputPath}" -resize ${targetSize}x${targetSize}^ -gravity center -extent ${targetSize}x${targetSize} "${prepPath}"`
      );
    } catch {
      fs.copyFileSync(inputPath, prepPath);
    }

    const cleanBuffer = fs.readFileSync(prepPath);

    // Run high-fidelity spline vectorization via VTracer (VisionCortex)
    // Mode 'spline' fits cubic Bezier curves, preserving clean line art and soft cel-shading
    const colorPrec = Math.min(8, Math.max(5, Math.round(numColors / 2) + 2));
    const filterSpeckleVal =
      typeof suppressSpeckles === "number"
        ? Math.max(2, Math.min(16, suppressSpeckles))
        : targetSize >= 512
        ? 6
        : 4;
    const simplifyVal =
      typeof cornerSmoothing === "number"
        ? Math.max(0.4, Math.min(2.5, cornerSmoothing))
        : targetSize >= 512
        ? 1.0
        : 1.2;

    const vtracerSvg = vtracer.convertBuffer(cleanBuffer, {
      preset: "poster",
      mode: "spline",
      clustering: "color-cluster",
      hierarchical: "stacked",
      filterSpeckle: filterSpeckleVal,
      colorPrecision: colorPrec,
      layerDifference: 16,
      cornerThreshold: 60,
      simplify: simplifyVal,
      pathPrecision: 1,
    });

    // Parse viewBox dimensions
    const widthMatch = vtracerSvg.match(/width="(\d+)"/);
    const heightMatch = vtracerSvg.match(/height="(\d+)"/);
    const docWidth = widthMatch ? parseInt(widthMatch[1], 10) : targetSize;
    const docHeight = heightMatch ? parseInt(heightMatch[1], 10) : targetSize;

    // Extract all paths: <path d="..." fill="..."/>
    const pathRegex = /<path\s+d="([^"]+)"\s+fill="([^"]+)"\/>/g;
    let match: RegExpExecArray | null;
    const paths: Array<{ d: string; fill: string; lum: number }> = [];
    const colorMap = new Map<string, number>();

    while ((match = pathRegex.exec(vtracerSvg)) !== null) {
      const d = match[1];
      const fill = match[2].toUpperCase();
      const lum = getLuminance(fill);
      paths.push({ d, fill, lum });
      colorMap.set(fill, (colorMap.get(fill) || 0) + 1);
    }

    if (paths.length === 0) {
      throw new Error("No vector paths produced by vectorizer");
    }

    // Identify background path:
    // Usually the first full-canvas path covering (0,0) to (W,H)
    let bgPath: { d: string; fill: string; lum: number } | null = null;
    let fgPaths = paths;

    if (
      paths.length > 1 &&
      paths[0].d.includes(`0,0`) &&
      (paths[0].d.includes(`0,${docHeight}`) || paths[0].d.includes(`${docWidth},0`))
    ) {
      bgPath = paths[0];
      fgPaths = paths.slice(1);
    }

    // Group foreground paths into semantic Inkscape Layers
    // Designed for characters, illustrations, line art, and cel shading
    const semanticTiers = [
      {
        id: "layer-lineart",
        label: "Line Art & Outlines",
        minLum: 0,
        maxLum: 55,
      },
      {
        id: "layer-shadows-hair",
        label: "Hair & Deep Shading",
        minLum: 55,
        maxLum: 105,
      },
      {
        id: "layer-fabric-apparel",
        label: "Fabric, Apparel & Patterns",
        minLum: 105,
        maxLum: 165,
      },
      {
        id: "layer-skin-features",
        label: "Skin Tones & Base Features",
        minLum: 165,
        maxLum: 215,
      },
      {
        id: "layer-highlights-glow",
        label: "Highlights, Eyes & Specular Glow",
        minLum: 215,
        maxLum: 256,
      },
    ];

    let layersXml = "";
    const layerInfos: Array<{
      id: string;
      label: string;
      color: string;
      lum: number;
      pathCount: number;
    }> = [];

    // Optional background layer (can be hidden or shown)
    if (bgPath) {
      const bgStyle = removeBackground ? "display:none" : "display:inline";
      layersXml += `
  <g
     inkscape:groupmode="layer"
     id="layer-background"
     inkscape:label="${escapeXml(`Background (${bgPath.fill})`)}"
     style="${bgStyle}">
    <path d="${bgPath.d}" fill="${bgPath.fill}" />
  </g>`;

      layerInfos.push({
        id: "layer-background",
        label: `Background (${bgPath.fill})`,
        color: bgPath.fill,
        lum: Math.round(bgPath.lum),
        pathCount: 1,
      });
    }

    let totalNodes = 0;

    for (let i = 0; i < semanticTiers.length; i++) {
      const tier = semanticTiers[i];
      const tierPaths = fgPaths.filter(
        (p) => p.lum >= tier.minLum && p.lum < tier.maxLum
      );

      if (tierPaths.length === 0) continue;

      // Find dominant color in this tier
      const tierColorCounts = new Map<string, number>();
      for (const p of tierPaths) {
        tierColorCounts.set(p.fill, (tierColorCounts.get(p.fill) || 0) + 1);
      }
      let topColor = tierPaths[0].fill;
      let topCount = 0;
      for (const [col, count] of tierColorCounts.entries()) {
        if (count > topCount) {
          topColor = col;
          topCount = count;
        }
      }

      let tierXml = "";
      for (const p of tierPaths) {
        tierXml += `\n    <path d="${p.d}" fill="${p.fill}" />`;
        // Count approximate nodes
        const commands = p.d.match(/[cClLmMsSzZ]/g) || [];
        totalNodes += Math.max(commands.length, 3);
      }

      layersXml += `
  <g
     inkscape:groupmode="layer"
     id="${tier.id}"
     inkscape:label="${escapeXml(tier.label)}"
     style="display:inline">
    ${tierXml}
  </g>`;

      layerInfos.push({
        id: tier.id,
        label: tier.label,
        color: topColor,
        lum: Math.round(tier.minLum + (tier.maxLum - tier.minLum) / 2),
        pathCount: tierPaths.length,
      });
    }

    // Dominant palette (top 6 colors by frequency)
    const sortedPalette = [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0])
      .slice(0, 8);

    // Build native Inkscape SVG document with Sodipodi and Inkscape namespaces
    const rawInkscapeSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   version="1.1"
   width="${docWidth}"
   height="${docHeight}"
   viewBox="0 0 ${docWidth} ${docHeight}"
   id="inkscape-asset-root"
   sodipodi:docname="${escapeXml(title)}.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg">
  <defs id="defs-asset" />
  <sodipodi:namedview
     id="namedview-inkscape"
     pagecolor="#18181b"
     bordercolor="#52525b"
     borderopacity="1.0"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0"
     inkscape:pagecheckerboard="1"
     inkscape:deskcolor="#09090b"
     inkscape:document-units="px"
     showgrid="false" />
  ${layersXml}
</svg>`;

    fs.writeFileSync(rawSvgPath, rawInkscapeSvg);

    // Validate and clean via Inkscape CLI
    let finalInkscapeSvg = rawInkscapeSvg;
    try {
      execSync(`inkscape "${rawSvgPath}" --vacuum-defs -o "${cleanSvgPath}" 2>/dev/null`, {
        timeout: 10000,
      });
      if (fs.existsSync(cleanSvgPath)) {
        finalInkscapeSvg = fs.readFileSync(cleanSvgPath, "utf8");
      }
    } catch {
      finalInkscapeSvg = rawInkscapeSvg;
    }

    // Generate plain SVG for lightweight web games
    const plainSvg = finalInkscapeSvg
      .replace(/xmlns:inkscape="[^"]*"/g, "")
      .replace(/xmlns:sodipodi="[^"]*"/g, "")
      .replace(/sodipodi:[a-zA-Z0-9]+="[^"]*"/g, "")
      .replace(/inkscape:[a-zA-Z0-9]+="[^"]*"/g, "")
      .replace(/<sodipodi:namedview[\s\S]*?<\/sodipodi:namedview>/g, "")
      .replace(/<sodipodi:namedview[^>]*\/>/g, "");

    return {
      inkscapeSvg: finalInkscapeSvg,
      plainSvg,
      palette: sortedPalette,
      stats: {
        layerCount: layerInfos.length,
        pathCount: paths.length,
        nodeCount: totalNodes,
        targetSize: docWidth,
      },
      layers: layerInfos,
    };
  } finally {
    for (const f of createdFiles) {
      try {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      } catch {
        // Ignore deletion errors
      }
    }
  }
}
