"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Download,
  Copy,
  Check,
  Code2,
  Gamepad2,
  Sparkles,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { HD2DAsset } from "@/lib/preset-assets";
import {
  generatePhaserCode,
  generatePixiCode,
  generateThreeJsCode,
  generateKaplayCode,
  generateCanvas2DCode,
  generateStandAloneHtmlGame,
} from "@/lib/web-framework-generators";
import { downloadFile } from "@/lib/export-utils";

interface WebGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: HD2DAsset;
}

export function WebGameModal({ isOpen, onClose, asset }: WebGameModalProps) {
  const [activeTab, setActiveTab] = useState<"sandbox" | "code">("sandbox");
  const [selectedFramework, setSelectedFramework] = useState<
    "phaser" | "pixi" | "three" | "kaplay" | "canvas"
  >("phaser");
  const [copied, setCopied] = useState(false);

  // Playable sandbox canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});

  const setVirtualKey = (key: string, pressed: boolean) => {
    keysRef.current[key.toLowerCase()] = pressed;
  };

  useEffect(() => {
    if (!isOpen || activeTab !== "sandbox") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const sprite = new Image();
    sprite.src =
      "data:image/svg+xml;utf8," + encodeURIComponent(asset.svg);

    const player = {
      x: canvas.width / 2,
      y: canvas.height / 2 + 20,
      speed: 160,
      flipX: false,
      size: 64,
      scaleY: 1,
    };

    const torch = {
      x: canvas.width / 2,
      y: canvas.height / 2 - 50,
      radius: 170,
    };

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Input movement from keysRef
      let dx = 0;
      let dy = 0;
      const k = keysRef.current;
      if (k["arrowleft"] || k["a"]) {
        dx -= 1;
        player.flipX = true;
      }
      if (k["arrowright"] || k["d"]) {
        dx += 1;
        player.flipX = false;
      }
      if (k["arrowup"] || k["w"]) dy -= 1;
      if (k["arrowdown"] || k["s"]) dy += 1;

      const isDashing = k[" "] || k["dash"] ? 1.7 : 1.0;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      player.x += dx * player.speed * isDashing * dt;
      player.y += dy * player.speed * isDashing * dt;

      // Clamp in canvas
      player.x = Math.max(28, Math.min(canvas.width - 28, player.x));
      player.y = Math.max(36, Math.min(canvas.height - 28, player.y));

      // Walking bounce animation
      if (dx !== 0 || dy !== 0) {
        player.scaleY = 1 + Math.sin(now * 0.015) * 0.08;
      } else {
        player.scaleY = 1 + Math.sin(now * 0.003) * 0.02; // breathing
      }

      // Draw background floor
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cobblestone grid
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Volumetric HD-2D Torch Light
      const pulse = Math.sin(now * 0.004) * 6;
      const r = torch.radius + pulse;
      const grad = ctx.createRadialGradient(
        torch.x,
        torch.y,
        15,
        torch.x,
        torch.y,
        r
      );
      grad.addColorStop(0, "rgba(251, 191, 36, 0.28)");
      grad.addColorStop(0.5, "rgba(245, 158, 11, 0.09)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(torch.x, torch.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Torch brazier graphic
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(torch.x, torch.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic Character Contact Shadow
      const shadowDistX = (player.x - torch.x) * 0.06;
      const shadowDistY = (player.y - torch.y) * 0.04;
      ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
      ctx.beginPath();
      ctx.ellipse(
        player.x + shadowDistX,
        player.y + shadowDistY,
        player.size * 0.32,
        7,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw Character Sprite with flip and bounce
      ctx.save();
      ctx.translate(player.x, player.y - player.size * 0.45);
      if (player.flipX) ctx.scale(-1, 1);
      ctx.scale(1, player.scaleY);
      ctx.drawImage(
        sprite,
        -player.size / 2,
        -player.size / 2,
        player.size,
        player.size
      );
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    sprite.onload = () => {
      animFrameRef.current = requestAnimationFrame(loop);
    };

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isOpen, activeTab, asset]);

  if (!isOpen) return null;

  const getCodeSnippet = () => {
    switch (selectedFramework) {
      case "phaser":
        return generatePhaserCode(asset);
      case "pixi":
        return generatePixiCode(asset);
      case "three":
        return generateThreeJsCode(asset);
      case "kaplay":
        return generateKaplayCode(asset);
      case "canvas":
        return generateCanvas2DCode(asset);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadStandaloneGame = () => {
    const html = generateStandAloneHtmlGame(asset);
    downloadFile(html, `${asset.id}-webgame-demo.html`, "text/html;charset=utf-8");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-zinc-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-bold shrink-0">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-xs sm:text-sm font-semibold text-zinc-100">
                  Web Game Frameworks Studio
                </h2>
                <span className="text-[9px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE RUNNER
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-1">
                Phaser, PixiJS, Three.js 2.5D, Kaplay &amp; HTML5 Canvas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleDownloadStandaloneGame}
              className="px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-md text-xs flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              title="Download standalone playable HTML file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download HTML5 Project</span>
              <span className="sm:hidden text-[11px]">HTML5</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-3 sm:px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs shrink-0">
            <button
              onClick={() => setActiveTab("sandbox")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === "sandbox"
                  ? "bg-zinc-800 text-amber-400 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Playable Canvas Sandbox</span>
              <span className="sm:hidden text-[11px]">Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-md font-medium transition-all ${
                activeTab === "code"
                  ? "bg-zinc-800 text-amber-400 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Framework Code Snippets</span>
              <span className="sm:hidden text-[11px]">Snippets</span>
            </button>
          </div>

          {activeTab === "code" && (
            <div className="flex items-center gap-1 overflow-x-auto max-w-full">
              {[
                { id: "phaser", label: "Phaser 3/4" },
                { id: "pixi", label: "PixiJS v8" },
                { id: "three", label: "Three.js 2.5D" },
                { id: "kaplay", label: "Kaplay.js" },
                { id: "canvas", label: "Canvas 2D" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedFramework(id as any)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium ${
                    selectedFramework === id
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-hidden p-4">
          {activeTab === "sandbox" ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3">
              <div className="relative border border-zinc-800 rounded-xl overflow-hidden shadow-2xl bg-zinc-950">
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={360}
                  className="block pixelated max-w-full max-h-[50vh] object-contain"
                />

                {/* On-screen control HUD */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between px-3 py-1.5 bg-zinc-950/80 backdrop-blur-md rounded-lg border border-zinc-800 text-[11px] text-zinc-300 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-400">Controls:</span>
                    <span>WASD or Arrow Keys to walk</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>Space to Dash</span>
                  </div>
                  <span className="text-zinc-500 font-mono">60 FPS &middot; HD-2D Light</span>
                </div>
              </div>

              {/* On-Screen Touch Controls for Mobile Players */}
              <div className="flex items-center justify-between w-full max-w-sm px-4 pt-1 sm:hidden">
                {/* D-Pad Buttons */}
                <div className="grid grid-cols-3 gap-1.5 w-32 h-32">
                  <div />
                  <button
                    type="button"
                    className="bg-zinc-800 active:bg-amber-500 active:text-zinc-950 text-zinc-200 font-bold rounded-lg flex items-center justify-center text-base shadow border border-zinc-700/80 select-none touch-none"
                    onTouchStart={() => setVirtualKey("arrowup", true)}
                    onTouchEnd={() => setVirtualKey("arrowup", false)}
                    onMouseDown={() => setVirtualKey("arrowup", true)}
                    onMouseUp={() => setVirtualKey("arrowup", false)}
                  >
                    ▲
                  </button>
                  <div />

                  <button
                    type="button"
                    className="bg-zinc-800 active:bg-amber-500 active:text-zinc-950 text-zinc-200 font-bold rounded-lg flex items-center justify-center text-base shadow border border-zinc-700/80 select-none touch-none"
                    onTouchStart={() => setVirtualKey("arrowleft", true)}
                    onTouchEnd={() => setVirtualKey("arrowleft", false)}
                    onMouseDown={() => setVirtualKey("arrowleft", true)}
                    onMouseUp={() => setVirtualKey("arrowleft", false)}
                  >
                    ◀
                  </button>
                  <div className="flex items-center justify-center text-[9px] text-zinc-500 font-mono select-none">
                    MOVE
                  </div>
                  <button
                    type="button"
                    className="bg-zinc-800 active:bg-amber-500 active:text-zinc-950 text-zinc-200 font-bold rounded-lg flex items-center justify-center text-base shadow border border-zinc-700/80 select-none touch-none"
                    onTouchStart={() => setVirtualKey("arrowright", true)}
                    onTouchEnd={() => setVirtualKey("arrowright", false)}
                    onMouseDown={() => setVirtualKey("arrowright", true)}
                    onMouseUp={() => setVirtualKey("arrowright", false)}
                  >
                    ▶
                  </button>

                  <div />
                  <button
                    type="button"
                    className="bg-zinc-800 active:bg-amber-500 active:text-zinc-950 text-zinc-200 font-bold rounded-lg flex items-center justify-center text-base shadow border border-zinc-700/80 select-none touch-none"
                    onTouchStart={() => setVirtualKey("arrowdown", true)}
                    onTouchEnd={() => setVirtualKey("arrowdown", false)}
                    onMouseDown={() => setVirtualKey("arrowdown", true)}
                    onMouseUp={() => setVirtualKey("arrowdown", false)}
                  >
                    ▼
                  </button>
                  <div />
                </div>

                {/* Dash Button */}
                <button
                  type="button"
                  className="w-20 h-20 rounded-full bg-amber-500/20 active:bg-amber-500 text-amber-300 active:text-zinc-950 font-bold text-xs border border-amber-500/40 flex flex-col items-center justify-center shadow-lg select-none touch-none"
                  onTouchStart={() => setVirtualKey("dash", true)}
                  onTouchEnd={() => setVirtualKey("dash", false)}
                  onMouseDown={() => setVirtualKey("dash", true)}
                  onMouseUp={() => setVirtualKey("dash", false)}
                >
                  <span>DASH</span>
                  <span className="text-[9px] opacity-75">2x SPD</span>
                </button>
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs text-zinc-300">
                  Testing <span className="text-amber-400 font-semibold">{asset.title}</span> in a real-time 60fps HTML5 game loop with dynamic lighting and shadow casting.
                </p>
                <p className="text-[11px] text-zinc-500">
                  Click the &quot;Download HTML5 Project&quot; button above to save a complete, offline-playable game file.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Ready-to-paste integration for{" "}
                  <span className="text-amber-400 font-medium capitalize">
                    {selectedFramework}
                  </span>
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1 overflow-auto rounded-lg border border-zinc-800 bg-[#09090b] p-3 font-mono text-[11px] text-emerald-400 leading-relaxed">
                <pre>{getCodeSnippet()}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
