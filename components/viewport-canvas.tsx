"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Eye,
  EyeOff,
  Layers,
  Image as ImageIcon,
  FileCode,
  SquareCode,
  Blend,
  Grid,
  Sparkles,
} from "lucide-react";
import { HD2DAsset } from "@/lib/preset-assets";

interface ViewportCanvasProps {
  currentAsset: HD2DAsset | null;
  onUpdateSvg?: (newSvg: string) => void;
}

export function ViewportCanvas({ currentAsset }: ViewportCanvasProps) {
  // Zoom & Pan state (default 100% for pristine view)
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // View Mode: 'vector' (Inkscape SVG), 'raster' (Source AI Image), 'split' (Onion Skin), 'nodes' (Wireframe Outlines)
  const [viewMode, setViewMode] = useState<"vector" | "raster" | "split" | "nodes">("vector");
  const [onionOpacity, setOnionOpacity] = useState<number>(0.55);

  // Grid overlay
  const [gridType, setGridType] = useState<"none" | "checker" | "grid">("checker");

  // Optional lighting sandbox (default OFF to keep colors pure & uncluttered)
  const [lightingFx, setLightingFx] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 35, y: 25 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);

  // Layer Visibility map (supports arbitrary Inkscape layer IDs)
  const [hiddenLayerIds, setHiddenLayerIds] = useState<Set<string>>(new Set());
  const [layerDrawerOpen, setLayerDrawerOpen] = useState(false);

  // Reset view to perfect center
  const handleResetView = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  // Toggle individual layer
  const toggleLayer = (layerId: string) => {
    setHiddenLayerIds((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  };

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !isDraggingLight) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsDraggingLight(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && !isDraggingLight) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - panStartRef.current.x,
        y: e.touches[0].clientY - panStartRef.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setIsDraggingLight(false);
  };

  // Extract layers from asset
  const assetLayers = useMemo(() => {
    if (!currentAsset) return [];
    if (currentAsset.layers && currentAsset.layers.length > 0) {
      return currentAsset.layers;
    }

    // Dynamic fallback parser from SVG string
    const layers: Array<{
      id: string;
      label: string;
      color: string;
      lum: number;
      pathCount: number;
    }> = [];

    const layerRegex = /<g[^>]+inkscape:groupmode="layer"[^>]*id="([^"]+)"[^>]*inkscape:label="([^"]+)"[\s\S]*?<\/g>/g;
    let match: RegExpExecArray | null;
    let idx = 0;
    while ((match = layerRegex.exec(currentAsset.svg)) !== null) {
      const id = match[1];
      const label = match[2].replace(/&amp;/g, "&");
      const hexMatch = label.match(/#([0-9A-Fa-f]{6})/);
      const color = hexMatch
        ? hexMatch[0]
        : currentAsset.dominantColors[idx % currentAsset.dominantColors.length] || "#9333ea";
      const pathCount = (match[0].match(/<path/g) || []).length;
      layers.push({ id, label, color, lum: 128, pathCount });
      idx++;
    }

    if (layers.length === 0) {
      return [
        { id: "layer-lineart", label: "Line Art & Outlines", color: "#18181b", lum: 20, pathCount: 20 },
        { id: "layer-apparel", label: "Apparel & Shading", color: "#8b5cf6", lum: 120, pathCount: 40 },
        { id: "layer-features", label: "Skin & Base Features", color: "#f5d0c5", lum: 200, pathCount: 15 },
      ];
    }

    return layers;
  }, [currentAsset]);

  // Process SVG with Layer Toggles and Wireframe Mode
  const processedSvg = useMemo(() => {
    if (!currentAsset || !currentAsset.svg) return "";

    let svg = currentAsset.svg;

    // Ensure svg has width="100%" height="100%" for crisp scaling
    if (!svg.includes('width="100%"')) {
      svg = svg.replace(/width="(\d+)"/, 'width="100%"').replace(/height="(\d+)"/, 'height="100%"');
    }

    // Build CSS style overrides
    const styleRules: string[] = [];

    // Hide toggled-off layers
    for (const hiddenId of hiddenLayerIds) {
      styleRules.push(`#${hiddenId} { display: none !important; }`);
    }

    // Wireframe / Node View mode
    if (viewMode === "nodes") {
      styleRules.push(`
        path {
          fill-opacity: 0.15 !important;
          stroke: #38bdf8 !important;
          stroke-width: 0.8px !important;
          stroke-dasharray: 3 1.5 !important;
        }
      `);
    }

    if (styleRules.length > 0) {
      svg = svg.replace("</svg>", `<style>${styleRules.join("\n")}</style></svg>`);
    }

    return svg;
  }, [currentAsset, hiddenLayerIds, viewMode]);

  if (!currentAsset) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950 text-zinc-500 text-xs">
        No asset selected. Generate or pick one from preset library.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 relative overflow-hidden select-none">
      {/* Top Streamlined Viewport Toolbar (Clean, Uncluttered) */}
      <div className="h-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-3 flex items-center justify-between z-10 shrink-0 gap-2">
        {/* Left: View Modes */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode("vector")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                viewMode === "vector"
                  ? "bg-amber-500 text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <SquareCode className="w-3.5 h-3.5" />
              <span>Inkscape Vector</span>
            </button>

            {currentAsset.sourceImageUrl && (
              <>
                <button
                  onClick={() => setViewMode("raster")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    viewMode === "raster"
                      ? "bg-amber-500 text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Source AI Image</span>
                </button>

                <button
                  onClick={() => setViewMode("split")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    viewMode === "split"
                      ? "bg-amber-500 text-zinc-950 font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Compare Source AI Image with Inkscape Vector Layers"
                >
                  <Blend className="w-3.5 h-3.5" />
                  <span>Onion Skin</span>
                </button>
              </>
            )}

            <button
              onClick={() => setViewMode("nodes")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                viewMode === "nodes"
                  ? "bg-cyan-500 text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
              title="Inspect vector node paths ready for Inkscape editing"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Wireframe</span>
            </button>
          </div>

          {/* Onion Skin Opacity Slider (Only in split mode) */}
          {viewMode === "split" && (
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md text-[10px] text-zinc-400">
              <span>Vector Mix:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={onionOpacity}
                onChange={(e) => setOnionOpacity(parseFloat(e.target.value))}
                className="w-14 accent-amber-500 cursor-pointer"
              />
              <span className="font-mono text-zinc-200">
                {Math.round(onionOpacity * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Right: Zoom, Grid & Layers */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md p-0.5">
            <button
              onClick={() => setZoom((prev) => Math.max(25, prev - 25))}
              className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              onClick={handleResetView}
              className="text-[10px] font-mono px-1.5 text-zinc-300 w-11 text-center hover:text-amber-400"
              title="Click to reset to 100%"
            >
              {zoom}%
            </button>
            <button
              onClick={() => setZoom((prev) => Math.min(600, prev + 25))}
              className="p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="p-1 text-zinc-400 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-colors"
            title="Reset Pan & Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Canvas Backdrop Toggle (Dark / Alpha Checkerboard) */}
          <button
            onClick={() =>
              setGridType((prev) =>
                prev === "checker" ? "none" : prev === "none" ? "grid" : "checker"
              )
            }
            className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded-md border font-medium transition-colors ${
              gridType !== "none"
                ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                : "bg-zinc-900 text-zinc-400 border-zinc-800"
            }`}
            title="Toggle canvas background: Alpha / Dark / Grid"
          >
            <Grid className="w-3 h-3" />
            <span className="capitalize">{gridType === "none" ? "Dark" : gridType === "checker" ? "Alpha" : "Grid"}</span>
          </button>

          {/* Optional Lighting Toggle */}
          <button
            onClick={() => setLightingFx(!lightingFx)}
            className={`p-1 rounded-md border text-[10px] transition-colors ${
              lightingFx
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
            }`}
            title="Toggle Atmosphere Torch Lighting"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>

          {/* Layer Panel Drawer Toggle */}
          <button
            onClick={() => setLayerDrawerOpen(!layerDrawerOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-md border font-medium transition-all ${
              layerDrawerOpen
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-zinc-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Layers ({assetLayers.length})</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        className={`flex-1 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing ${
          gridType === "checker"
            ? "bg-[linear-gradient(45deg,#1f1f23_25%,transparent_25%),linear-gradient(-45deg,#1f1f23_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1f1f23_75%),linear-gradient(-45deg,transparent_75%,#1f1f23_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0px] bg-zinc-950"
            : gridType === "grid"
            ? "bg-zinc-950 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:24px_24px]"
            : "bg-zinc-950"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Optional Draggable Light Anchor (Only shown when explicitly toggled ON) */}
        {lightingFx && (
          <>
            <div
              className="absolute pointer-events-none rounded-full transition-transform duration-75"
              style={{
                left: `${lightPos.x}%`,
                top: `${lightPos.y}%`,
                width: "220px",
                height: "220px",
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 75%)",
                zIndex: 2,
              }}
            />
            <div
              className="absolute z-20 cursor-move flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 backdrop-blur-md text-[10px] text-amber-300 font-medium shadow-lg select-none touch-none"
              style={{
                left: `${lightPos.x}%`,
                top: `${lightPos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingLight(true);
                const parent = e.currentTarget.parentElement;
                if (!parent) return;
                const rect = parent.getBoundingClientRect();
                const onMove = (moveEvent: MouseEvent) => {
                  const x = Math.max(5, Math.min(95, ((moveEvent.clientX - rect.left) / rect.width) * 100));
                  const y = Math.max(5, Math.min(95, ((moveEvent.clientY - rect.top) / rect.height) * 100));
                  setLightPos({ x, y });
                };
                const onUp = () => {
                  window.removeEventListener("mousemove", onMove);
                  window.removeEventListener("mouseup", onUp);
                };
                window.addEventListener("mousemove", onMove);
                window.addEventListener("mouseup", onUp);
              }}
            >
              <Sun className="w-3 h-3 text-amber-400" />
              <span>Torch</span>
            </div>
          </>
        )}

        {/* Viewport Asset Holder: Full Crisp Responsive Size */}
        <div
          className="relative transition-transform duration-75 flex items-center justify-center pointer-events-none select-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
          }}
        >
          {/* View Mode: Raster Source AI Image */}
          {viewMode === "raster" && currentAsset.sourceImageUrl ? (
            <div className="w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px] flex items-center justify-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentAsset.sourceImageUrl}
                alt="Source AI raster"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ) : viewMode === "split" && currentAsset.sourceImageUrl ? (
            /* View Mode: Onion Skin (Raster underneath, SVG on top with opacity) */
            <div className="w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px] relative flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentAsset.sourceImageUrl}
                alt="Source AI raster"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ opacity: onionOpacity }}
                dangerouslySetInnerHTML={{ __html: processedSvg }}
              />
            </div>
          ) : (
            /* View Mode: Pure Inkscape Vector SVG (Crisp anti-aliased spline contours) */
            <div
              className="w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px] flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: processedSvg }}
            />
          )}
        </div>

        {/* Floating Right Inkscape Layer Stack Drawer */}
        {layerDrawerOpen && (
          <div className="absolute top-3 right-3 bottom-3 z-30 w-72 sm:w-80 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-xl p-3.5 shadow-2xl flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-zinc-100">
                  Inkscape Layer Stack
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  ({assetLayers.length})
                </span>
              </div>
              <button
                onClick={() => setLayerDrawerOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 text-sm px-1.5 py-0.5 rounded hover:bg-zinc-800"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {assetLayers.map((layer, index) => {
                const isHidden = hiddenLayerIds.has(layer.id);
                return (
                  <div
                    key={layer.id || index}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                      isHidden
                        ? "bg-zinc-900/30 border-zinc-900 text-zinc-600"
                        : "bg-zinc-900/80 border-zinc-800 text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-sm"
                        style={{ backgroundColor: layer.color }}
                      />
                      <div className="truncate">
                        <div className="truncate text-xs font-medium">
                          {layer.label}
                        </div>
                        {layer.pathCount > 0 && (
                          <div className="text-[10px] font-mono text-zinc-500">
                            {layer.pathCount} vector paths
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className={`p-1.5 rounded transition-colors ml-2 ${
                        isHidden
                          ? "text-zinc-600 hover:text-zinc-400 bg-zinc-950"
                          : "text-amber-400 hover:text-amber-300 bg-amber-500/10"
                      }`}
                      title={isHidden ? "Show layer" : "Hide layer"}
                    >
                      {isHidden ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
              <span>F12 in desktop Inkscape</span>
              <button
                onClick={() => setHiddenLayerIds(new Set())}
                className="text-amber-400 hover:text-amber-300 font-medium hover:underline"
              >
                Reset All Layers
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Canvas Footer Info (Clean & Scannable) */}
      <div className="h-8 border-t border-zinc-800 bg-zinc-950 px-3 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-zinc-200 truncate">
            {currentAsset.title}
          </span>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-amber-400 font-mono text-[10px]">
            {currentAsset.recommendedGrid}
          </span>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-zinc-400 text-[10px]">
            {currentAsset.pipeline || "Text → Image → Inkscape SVG"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
          <span className="hidden sm:inline text-zinc-500">Palette:</span>
          {currentAsset.dominantColors.slice(0, 6).map((col, idx) => (
            <span
              key={idx}
              className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
              style={{ backgroundColor: col }}
              title={col}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
