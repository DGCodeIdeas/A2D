import { HD2DAsset } from "./preset-assets";

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSvg(svgContent: string, filename: string) {
  downloadFile(svgContent, `${filename}.svg`, "image/svg+xml;charset=utf-8");
}

export function downloadInkscapeSvg(svgContent: string, filename: string) {
  downloadFile(svgContent, `${filename}-inkscape.svg`, "image/svg+xml;charset=utf-8");
}

export function downloadPlainSvg(svgContent: string, filename: string) {
  // Strip Inkscape namespaces and namedview
  const clean = svgContent
    .replace(/xmlns:inkscape="[^"]*"/g, "")
    .replace(/xmlns:sodipodi="[^"]*"/g, "")
    .replace(/sodipodi:[a-zA-Z0-9]+="[^"]*"/g, "")
    .replace(/inkscape:[a-zA-Z0-9]+="[^"]*"/g, "")
    .replace(/<sodipodi:namedview[\s\S]*?<\/sodipodi:namedview>/g, "")
    .replace(/<sodipodi:namedview[^>]*\/>/g, "");
  downloadFile(clean, `${filename}-web.svg`, "image/svg+xml;charset=utf-8");
}

export async function downloadPngFromSvg(
  svgContent: string,
  filename: string,
  scale: number = 4,
  baseWidth: number = 128,
  baseHeight: number = 128
): Promise<void> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const targetWidth = baseWidth * scale;
    const targetHeight = baseHeight * scale;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Unable to create canvas context"));
      return;
    }

    // Ensure pixel crispness for HD-2D rendering
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas blob conversion failed"));
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${filename}_${targetWidth}x${targetHeight}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, "image/png");
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}

export function generateGodotSnippet(asset: HD2DAsset): string {
  const nodeName = asset.title.replace(/[^a-zA-Z0-9]/g, "");
  return `# Godot 4.x Sprite2D Node Configuration for "${asset.title}"
# Category: ${asset.category} | Grid: ${asset.recommendedGrid}

[gd_scene load_steps=2 format=3]

[ext_resource type="Texture2D" path="res://assets/sprites/${asset.id}.png" id="1_tex"]

[node name="${nodeName}" type="Sprite2D"]
texture_filter = 0 # 0 = TEXTURE_FILTER_NEAREST (Crisp pixel art)
texture = ExtResource("1_tex")
offset = Vector2(0, -${parseInt(asset.recommendedGrid) || 32 / 2})
# HD-2D dynamic Y-sorting for depth
y_sort_enabled = true

# Optional: Add PointLight2D child node for HD-2D lantern illumination
# [node name="PointLight2D" type="PointLight2D" parent="."]
# color = Color(1.0, 0.85, 0.4, 1.0) # Warm Amber Bloom
# energy = 1.2
# texture_scale = 1.5
`;
}

export function generateUnitySnippet(asset: HD2DAsset): string {
  return `// Unity 2D Sprite & URP Settings for "${asset.title}"
// Import Settings in Inspector:
// ------------------------------------------------------------
// Texture Type: Sprite (2D and UI)
// Sprite Mode: Single
// Pixels Per Unit (PPU): ${parseInt(asset.recommendedGrid) || 32}
// Mesh Type: Tight
// Extrude Edges: 1
//
// Advanced:
// Generate Physics Shape: Checked
// Alpha Is Transparency: Checked
//
// Filter Mode: Point (no filter)  <-- Crucial for HD-2D crisp pixels
// Compression: None
//
// HD-2D Lighting in URP:
// Attach 'Sprite-Lit-Default' Material or custom Shader Graph with Normal Map.
// Sorting Layer: 'Foreground_Props'
// Order in Layer: Calculated from -transform.position.y * 100
`;
}

export function generateReactSvgSnippet(asset: HD2DAsset): string {
  const componentName = asset.title.replace(/[^a-zA-Z0-9]/g, "");
  return `import React from 'react';

export function ${componentName}Asset({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <div 
      className={className} 
      dangerouslySetInnerHTML={{ __html: \`${asset.svg.replace(/`/g, "\\`")}\` }} 
    />
  );
}
`;
}
