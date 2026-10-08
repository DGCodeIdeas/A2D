"use client";

import React from "react";
import { X, Sparkles, ArrowRight, Layers, Tag } from "lucide-react";
import { HD2DAsset, PRESET_HD2D_ASSETS } from "@/lib/preset-assets";

interface PresetGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: HD2DAsset) => void;
  onUsePrompt: (prompt: string) => void;
}

export function PresetGalleryModal({
  isOpen,
  onClose,
  onSelectAsset,
  onUsePrompt,
}: PresetGalleryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Preset HD-2D Game Asset Catalog
              </h2>
              <p className="text-xs text-zinc-400">
                Production-ready vector assets with multi-layer HD-2D lighting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Grid */}
        <div className="p-3 sm:p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {PRESET_HD2D_ASSETS.map((asset) => (
            <div
              key={asset.id}
              className="bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/50 rounded-lg p-3.5 flex flex-col transition-all group"
            >
              {/* Asset Preview Frame */}
              <div
                className="w-full h-36 bg-[#09090b] rounded-md border border-zinc-800/80 p-2 flex items-center justify-center mb-3 cursor-pointer group-hover:scale-[1.02] transition-transform pixelated"
                onClick={() => {
                  onSelectAsset(asset);
                  onClose();
                }}
              >
                <div
                  className="w-24 h-24"
                  dangerouslySetInnerHTML={{ __html: asset.svg }}
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 space-y-1 mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors">
                    {asset.title}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800">
                    {asset.recommendedGrid}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">
                  {asset.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Load Asset</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => {
                    onUsePrompt(asset.promptUsed);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs transition-colors"
                  title="Copy Prompt"
                >
                  Prompt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
