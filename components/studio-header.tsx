"use client";

import React from "react";
import {
  Sparkles,
  Layers,
  Image as ImageIcon,
  Compass,
  Gamepad2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

interface StudioHeaderProps {
  onOpenPresets: () => void;
  onOpenWebGameModal: () => void;
  onSelectMode: (mode: "text" | "image" | "spritesheet") => void;
  activeMode: "text" | "image" | "spritesheet";
  isGenerating: boolean;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  inspectorOpen?: boolean;
  onToggleInspector?: () => void;
  onToggleZenMode?: () => void;
  isZenMode?: boolean;
}

export function StudioHeader({
  onOpenPresets,
  onOpenWebGameModal,
  onSelectMode,
  activeMode,
  isGenerating,
  sidebarOpen = true,
  onToggleSidebar,
  inspectorOpen = true,
  onToggleInspector,
  onToggleZenMode,
  isZenMode = false,
}: StudioHeaderProps) {
  return (
    <header className="h-12 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md px-3 flex items-center justify-between z-20 shrink-0 gap-2 select-none">
      {/* Left: Brand Identity & Left Panel Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
            title={sidebarOpen ? "Hide Generator Panel" : "Show Generator Panel"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4 text-amber-400" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/10">
            <Layers className="w-3.5 h-3.5 text-zinc-950 font-bold" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs tracking-wide text-zinc-100">
              AETHER 2D
            </span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden sm:inline">
              Inkscape SVG
            </span>
          </div>
        </div>
      </div>

      {/* Center: Mode Indicator or Clean Title */}
      <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
        <span className="text-zinc-300">Text &rarr; Image &rarr; Inkscape SVG</span>
        <span className="text-zinc-600">&bull;</span>
        <span className="text-[11px] text-zinc-500">Pure Prompts &middot; Native Layers</span>
      </div>

      {/* Right: Presets, Game, and Inspector Toggle */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onOpenWebGameModal}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-300 hover:text-emerald-200 bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-md transition-colors"
          title="Play asset in Web Game Sandbox"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Web Sandbox</span>
        </button>

        <button
          onClick={onOpenPresets}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-colors"
          title="Browse preset assets"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Presets</span>
        </button>

        {onToggleZenMode && (
          <button
            onClick={onToggleZenMode}
            className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors hidden sm:flex items-center gap-1 ${
              isZenMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            }`}
            title={isZenMode ? "Exit Fullscreen Canvas Mode" : "Maximize Canvas (Hide Sidebars)"}
          >
            <span>{isZenMode ? "Restore Panels" : "Zen Mode"}</span>
          </button>
        )}

        {onToggleInspector && (
          <button
            onClick={onToggleInspector}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors ml-1"
            title={inspectorOpen ? "Hide Inspector Panel" : "Show Inspector Panel"}
          >
            {inspectorOpen ? (
              <PanelRightClose className="w-4 h-4 text-amber-400" />
            ) : (
              <PanelRightOpen className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
