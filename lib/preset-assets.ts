export interface HD2DAsset {
  id: string;
  title: string;
  description: string;
  category: "tile" | "prop" | "character" | "weapon" | "environment" | "ui";
  perspective: "isometric" | "side-scroll" | "top-down" | "front";
  recommendedGrid: string;
  dominantColors: string[];
  svg: string;
  plainSvg?: string;
  sourceImageUrl?: string;
  vectorStats?: {
    layerCount: number;
    pathCount: number;
    nodeCount: number;
    targetSize: number;
  };
  layers?: Array<{
    id: string;
    label: string;
    color: string;
    lum: number;
    pathCount: number;
  }>;
  pipeline?: string;
  godotTip: string;
  unityTip: string;
  promptUsed: string;
  hd2dStyle: string;
  contentMode?: "filtered" | "unfiltered";
  modelUsed?: string;
}

export const PRESET_HD2D_ASSETS: HD2DAsset[] = [
  {
    id: "waystone-shrine",
    title: "Sanctuary Waystone Shrine",
    description: "Isometric ancient weathered monolith with illuminated teal mana runes, mossy stone plinth, and golden sunset rim-light.",
    category: "environment",
    perspective: "isometric",
    recommendedGrid: "64x64",
    dominantColors: ["#1e293b", "#334155", "#06b6d4", "#22d3ee", "#f59e0b", "#10b981"],
    hd2dStyle: "mana-sanctuary",
    promptUsed: "Isometric ancient elven waystone monolith with glowing cyan runes, moss-covered cobblestone base, and golden ambient rim light",
    godotTip: "Use with Sprite2D (offset: Vector2(0, -32)). In CanvasItemMaterial, set Blend Mode to Add for the bloom layer if split.",
    unityTip: "Sprite Mode: Single, Pixels Per Unit: 32, Filter Mode: Point (no filter). Pivot: Bottom (0.5, 0.1).",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Soft Contact Shadow -->
    <radialGradient id="ws-shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#0f172a" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    
    <!-- Stone Monolith Gradients -->
    <linearGradient id="stone-face-left" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="50%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="stone-face-right" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="stone-top" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>

    <!-- Rune Bloom Glow -->
    <filter id="rune-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <radialGradient id="bloom-radial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.7"/>
      <stop offset="40%" stop-color="#06b6d4" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0891b2" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- SHADOW LAYER -->
  <g id="shadows">
    <ellipse cx="64" cy="112" rx="44" ry="14" fill="url(#ws-shadow)" />
  </g>

  <!-- BASE GEOMETRY (Isometric Base & Pedestal) -->
  <g id="base-art">
    <!-- Isometric Step 1 (Bottom Plinth) -->
    <!-- Top Face -->
    <polygon points="64,98 96,108 64,118 32,108" fill="#334155" stroke="#1e293b" stroke-width="0.75"/>
    <!-- Left Face -->
    <polygon points="32,108 64,118 64,122 32,112" fill="#1e293b" />
    <!-- Right Face -->
    <polygon points="64,118 96,108 96,112 64,122" fill="#0f172a" />

    <!-- Isometric Step 2 (Middle Plinth) -->
    <polygon points="64,90 88,98 64,106 40,98" fill="#475569" stroke="#1e293b" stroke-width="0.75"/>
    <polygon points="40,98 64,106 64,110 40,102" fill="#334155" />
    <polygon points="64,106 88,98 88,102 64,110" fill="#1e293b" />

    <!-- Monolith Obelisk Base -->
    <!-- Left Lit Face -->
    <polygon points="64,24 64,92 48,97 50,30" fill="url(#stone-face-left)" stroke="#1e293b" stroke-width="0.75"/>
    <!-- Right Shaded Face -->
    <polygon points="64,24 80,31 78,97 64,92" fill="url(#stone-face-right)" stroke="#0f172a" stroke-width="0.75"/>
    <!-- Pyramidion Peak Top -->
    <polygon points="64,14 50,30 64,24" fill="url(#stone-top)" />
    <polygon points="64,14 64,24 80,31" fill="#475569" />
  </g>

  <!-- PIXEL & SURFACE DETAILS -->
  <g id="details">
    <!-- Moss clumps on base -->
    <circle cx="44" cy="100" r="3" fill="#15803d" />
    <circle cx="46" cy="99" r="2" fill="#4ade80" opacity="0.8" />
    <circle cx="82" cy="104" r="2.5" fill="#166534" />
    <path d="M42,96 Q44,93 45,96" stroke="#22c55e" stroke-width="0.75" fill="none"/>
    <path d="M52,86 Q54,82 55,87" stroke="#16a34a" stroke-width="0.75" fill="none"/>

    <!-- Weathering cracks on left stone face -->
    <polyline points="54,42 56,48 53,54 58,60" stroke="#0f172a" stroke-width="0.75" fill="none" opacity="0.7"/>
    <polyline points="72,50 70,58 74,66" stroke="#020617" stroke-width="0.75" fill="none" opacity="0.8"/>
  </g>

  <!-- HD-2D RIM LIGHTING -->
  <g id="rim-lighting">
    <!-- Golden sunset edge highlight on leftmost ridge -->
    <path d="M50,30 L48,97" stroke="#fcd34d" stroke-width="1" stroke-linecap="round" opacity="0.9"/>
    <!-- Obelisk crest highlight -->
    <polygon points="64,14 49,30 51,30 64,15" fill="#fef08a" opacity="0.8"/>
    <!-- Subdued blue ambient bounce on right side -->
    <path d="M80,31 L78,97" stroke="#38bdf8" stroke-width="0.75" opacity="0.5"/>
  </g>

  <!-- BLOOM & RUNIC FX LAYER -->
  <g id="bloom-fx" filter="url(#rune-glow)">
    <!-- Radial aura behind rune center -->
    <circle cx="64" cy="58" r="18" fill="url(#bloom-radial)" opacity="0.6"/>

    <!-- Glowing Runic Glyphs -->
    <!-- Core central diamond rune -->
    <polygon points="64,48 68,54 64,60 60,54" fill="#a5f3fc" stroke="#22d3ee" stroke-width="0.5"/>
    <!-- Center rune core cross -->
    <line x1="64" y1="44" x2="64" y2="72" stroke="#67e8f9" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="58" y1="58" x2="70" y2="58" stroke="#67e8f9" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="59" y1="64" x2="69" y2="64" stroke="#22d3ee" stroke-width="1" stroke-linecap="round"/>
    <line x1="61" y1="70" x2="67" y2="70" stroke="#06b6d4" stroke-width="0.8" stroke-linecap="round"/>

    <!-- Lower pedestal runic accent -->
    <circle cx="64" cy="99" r="2" fill="#67e8f9"/>
    <line x1="56" y1="99" x2="72" y2="99" stroke="#22d3ee" stroke-width="0.8" stroke-linecap="round"/>

    <!-- Floating Mana Particles -->
    <circle cx="56" cy="36" r="1.2" fill="#cffafe" opacity="0.9"/>
    <circle cx="74" cy="42" r="0.9" fill="#a5f3fc" opacity="0.8"/>
    <circle cx="52" cy="62" r="1.4" fill="#67e8f9" opacity="0.95"/>
    <circle cx="73" cy="74" r="1" fill="#22d3ee" opacity="0.7"/>
    <circle cx="64" cy="28" r="1.5" fill="#e0f2fe" opacity="0.9"/>
  </g>
</svg>`,
  },
  {
    id: "luminous-elixir",
    title: "Celestial Star-Elixir Vial",
    description: "Handcrafted glass flask with glowing violet-indigo fluid, golden filigree cage, buoyant star dust, and specular bloom.",
    category: "prop",
    perspective: "isometric",
    recommendedGrid: "64x64",
    dominantColors: ["#4c1d95", "#8b5cf6", "#c084fc", "#fbbf24", "#fef08a", "#0f172a"],
    hd2dStyle: "mana-sanctuary",
    promptUsed: "Isometric fantasy alchemical glass potion flask with glowing purple starlight liquid, golden brass cork stopper, and specular highlights",
    godotTip: "Excellent as inventory icon or 2D world pickup. Scale to 0.5 for HUD slot, 1.0 for ground drop.",
    unityTip: "Set Texture Type: Sprite (2D and UI). Generate Physics Shape: checked. Wrap Mode: Clamp.",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Shadow -->
    <radialGradient id="pot-shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#3b0764" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Liquid Gradient -->
    <linearGradient id="liquid-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="50%" stop-color="#9333ea"/>
      <stop offset="100%" stop-color="#581c87"/>
    </linearGradient>

    <!-- Glass Rim -->
    <linearGradient id="glass-spec" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#e9d5ff" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#7e22ce" stop-opacity="0.05"/>
    </linearGradient>

    <!-- Brass Gold -->
    <linearGradient id="brass-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>

    <!-- Bloom Filter -->
    <filter id="liquid-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- SHADOW -->
  <g id="shadows">
    <ellipse cx="64" cy="110" rx="38" ry="12" fill="url(#pot-shadow)" />
  </g>

  <!-- BASE GEOMETRY (Flask & Cork) -->
  <g id="base-art">
    <!-- Brass Flask Neck Collar -->
    <rect x="52" y="36" width="24" height="6" rx="2" fill="url(#brass-gold)" stroke="#78350f" stroke-width="0.75"/>

    <!-- Cork Stopper -->
    <polygon points="54,36 74,36 71,20 57,20" fill="#b45309" stroke="#78350f" stroke-width="0.75"/>
    <ellipse cx="64" cy="20" rx="7" ry="2.5" fill="#d97706" />

    <!-- Glass Bulb Body Outline -->
    <path d="M54,42 C54,42 40,60 40,82 C40,102 50,108 64,108 C78,108 88,102 88,82 C88,60 74,42 74,42 Z" 
          fill="#3b0764" fill-opacity="0.3" stroke="#a855f7" stroke-width="1.2"/>

    <!-- Swirling Liquid -->
    <path d="M42,80 C44,72 52,70 64,74 C74,78 84,72 86,80 C87,96 79,106 64,106 C49,106 41,96 42,80 Z" 
          fill="url(#liquid-grad)"/>

    <!-- Liquid Meniscus Wave -->
    <ellipse cx="64" cy="74" rx="21" ry="5" fill="#a855f7" opacity="0.6"/>
    <ellipse cx="64" cy="73" rx="18" ry="3.5" fill="#d8b4fe" opacity="0.8"/>
  </g>

  <!-- PIXEL & SURFACE DETAILS -->
  <g id="details">
    <!-- Golden Filigree Cage Ribs -->
    <path d="M64,42 L64,107" stroke="url(#brass-gold)" stroke-width="1.5" stroke-dasharray="2,1"/>
    <path d="M54,42 C54,58 45,74 46,92" stroke="url(#brass-gold)" stroke-width="1" fill="none"/>
    <path d="M74,42 C74,58 83,74 82,92" stroke="url(#brass-gold)" stroke-width="1" fill="none"/>

    <!-- Cork wood grain lines -->
    <line x1="58" y1="24" x2="58" y2="33" stroke="#92400e" stroke-width="0.75"/>
    <line x1="64" y1="22" x2="64" y2="34" stroke="#78350f" stroke-width="0.75"/>
    <line x1="69" y1="24" x2="69" y2="32" stroke="#92400e" stroke-width="0.75"/>
  </g>

  <!-- HD-2D RIM LIGHTING -->
  <g id="rim-lighting">
    <!-- Primary Specular Glass Streak (Left) -->
    <path d="M44,68 C43,76 43,88 47,98" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
    <!-- Secondary Glass Highlight -->
    <path d="M47,56 C49,52 52,48 54,45" stroke="#f3e8ff" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    <!-- Right Ambient Backlight Rim -->
    <path d="M84,66 C86,76 85,88 81,98" stroke="#c084fc" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
  </g>

  <!-- BLOOM & PARTICLES -->
  <g id="bloom-fx" filter="url(#liquid-glow)">
    <!-- Liquid internal glow core -->
    <circle cx="64" cy="88" r="14" fill="#e879f9" opacity="0.4"/>

    <!-- Buoyant Magic Bubbles & Sparkles -->
    <circle cx="60" cy="84" r="2.5" fill="#f5d0fe"/>
    <circle cx="70" cy="88" r="1.8" fill="#ffffff"/>
    <circle cx="56" cy="94" r="1.5" fill="#fae8ff"/>
    <circle cx="68" cy="78" r="2" fill="#fdf4ff"/>

    <!-- Floating exterior star dust -->
    <polygon points="64,56 65,58 67,59 65,60 64,62 63,60 61,59 63,58" fill="#fef08a"/>
    <circle cx="78" cy="52" r="1" fill="#fde047"/>
    <circle cx="38" cy="70" r="1" fill="#e879f9"/>
    <circle cx="88" cy="62" r="1.2" fill="#c084fc"/>
  </g>
</svg>`,
  },
  {
    id: "gilded-mimic",
    title: "Gilded Dungeon Mimic Chest",
    description: "Isometric wooden and brass reinforced strongbox with open lid revealing glowing amethyst teeth, golden rim-light, and shadow.",
    category: "prop",
    perspective: "isometric",
    recommendedGrid: "64x64",
    dominantColors: ["#451a03", "#78350f", "#f59e0b", "#fde68a", "#a855f7", "#1e1b4b"],
    hd2dStyle: "octopath-lantern",
    promptUsed: "Isometric RPG dungeon mimic treasure chest slightly ajar with glowing purple soulfire eye and brass lock bindings in Octopath Traveler HD-2D style",
    godotTip: "Attach an Area2D child node with an CollisionShape2D (capsule or rectangle) for player chest-opening trigger.",
    unityTip: "Import with Sprite Mode: Single. In your Animator, create 'Chest_Closed', 'Chest_Open', and 'Mimic_Attack' clips.",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="chest-sh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.85"/>
      <stop offset="70%" stop-color="#0f172a" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="wood-left" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
    <linearGradient id="wood-right" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="100%" stop-color="#1c1917"/>
    </linearGradient>
    <linearGradient id="gold-trim" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <filter id="mimic-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- SHADOW -->
  <g id="shadows">
    <ellipse cx="64" cy="112" rx="46" ry="14" fill="url(#chest-sh)" />
  </g>

  <!-- BASE GEOMETRY (Chest Lower Hull) -->
  <g id="base-art">
    <!-- Left Face Lower Hull -->
    <polygon points="64,88 28,74 28,96 64,110" fill="url(#wood-left)" stroke="#1c1917" stroke-width="0.75"/>
    <!-- Right Face Lower Hull -->
    <polygon points="64,88 100,74 100,96 64,110" fill="url(#wood-right)" stroke="#0c0a09" stroke-width="0.75"/>

    <!-- Open Interior Void (Dark purple abyss) -->
    <polygon points="64,74 28,62 64,52 100,62" fill="#180b2a" stroke="#3b0764" stroke-width="0.75"/>

    <!-- Ajar Chest Lid (Tilted back) -->
    <polygon points="64,48 24,36 64,22 104,36" fill="url(#wood-left)" stroke="#1c1917" stroke-width="0.75"/>
    <polygon points="24,36 64,48 64,56 24,44" fill="#78350f" stroke="#1c1917" stroke-width="0.75"/>
    <polygon points="64,48 104,36 104,44 64,56" fill="#451a03" stroke="#0c0a09" stroke-width="0.75"/>
  </g>

  <!-- PIXEL & SURFACE DETAILS -->
  <g id="details">
    <!-- Brass Reinforced Corners on Lower Hull -->
    <polygon points="64,88 60,86.5 60,108.5 64,110" fill="url(#gold-trim)" />
    <polygon points="64,88 68,86.5 68,108.5 64,110" fill="url(#gold-trim)" />
    <!-- Left corner bracket -->
    <polygon points="28,74 34,76.5 34,98.5 28,96" fill="url(#gold-trim)"/>
    <!-- Right corner bracket -->
    <polygon points="100,74 94,76.5 94,98.5 100,96" fill="url(#gold-trim)"/>

    <!-- Rivet Studs -->
    <circle cx="62" cy="92" r="1" fill="#fef08a"/>
    <circle cx="62" cy="104" r="1" fill="#fef08a"/>
    <circle cx="66" cy="92" r="1" fill="#fef08a"/>
    <circle cx="66" cy="104" r="1" fill="#fef08a"/>
    <circle cx="31" cy="78" r="0.8" fill="#fef08a"/>
    <circle cx="97" cy="78" r="0.8" fill="#fef08a"/>

    <!-- Wood Plank Seams -->
    <line x1="46" y1="81" x2="46" y2="103" stroke="#291404" stroke-width="0.75"/>
    <line x1="82" y1="81" x2="82" y2="103" stroke="#140a02" stroke-width="0.75"/>
  </g>

  <!-- HD-2D RIM LIGHTING -->
  <g id="rim-lighting">
    <!-- Warm Golden Keylight on top left edges -->
    <path d="M24,36 L64,22 L104,36" stroke="#fef08a" stroke-width="1.2" fill="none" opacity="0.9"/>
    <line x1="24" y1="36" x2="64" y2="48" stroke="#fde047" stroke-width="1"/>
    <!-- Cold ambient back-light on rear edge -->
    <line x1="28" y1="74" x2="64" y2="88" stroke="#fcd34d" stroke-width="1"/>
  </g>

  <!-- BLOOM & MIMIC SUPERNATURAL FX -->
  <g id="bloom-fx" filter="url(#mimic-glow)">
    <!-- Ominous Soulfire glow inside maw -->
    <ellipse cx="64" cy="62" rx="20" ry="6" fill="#a855f7" opacity="0.6"/>

    <!-- Sharp Mimic Teeth (Top and Bottom) -->
    <polygon points="44,58 48,58 46,65" fill="#f8fafc"/>
    <polygon points="52,56 56,56 54,64" fill="#f8fafc"/>
    <polygon points="62,55 66,55 64,65" fill="#f8fafc"/>
    <polygon points="72,56 76,56 74,64" fill="#f8fafc"/>
    <polygon points="80,58 84,58 82,65" fill="#f8fafc"/>

    <!-- Bottom Teeth pointing up -->
    <polygon points="46,68 50,68 48,61" fill="#f1f5f9"/>
    <polygon points="56,70 60,70 58,62" fill="#f1f5f9"/>
    <polygon points="68,70 72,70 70,62" fill="#f1f5f9"/>
    <polygon points="78,68 82,68 80,61" fill="#f1f5f9"/>

    <!-- Central Glowing Mimic Soul Eye -->
    <circle cx="64" cy="61" r="3" fill="#c084fc"/>
    <circle cx="64" cy="61" r="1.5" fill="#ffffff"/>

    <!-- Embers of greed floating out -->
    <circle cx="58" cy="48" r="1" fill="#e879f9"/>
    <circle cx="70" cy="45" r="1.2" fill="#fde047"/>
    <circle cx="64" cy="38" r="1" fill="#fbcfe8"/>
  </g>
</svg>`,
  },
  {
    id: "royal-paladin",
    title: "Gilded Paladin Battler",
    description: "Front-facing HD-2D RPG combat battler with polished steel plate armor, crimson mantle, runed claymore, and golden sun bloom.",
    category: "character",
    perspective: "front",
    recommendedGrid: "64x64",
    dominantColors: ["#e2e8f0", "#94a3b8", "#dc2626", "#f59e0b", "#fde047", "#1e293b"],
    hd2dStyle: "triangle-strategy",
    promptUsed: "Front view HD-2D turn-based RPG knight battler in polished steel plate armor with flowing red cape, gold accents, and glowing sun sword in Octopath Traveler style",
    godotTip: "Use in AnimatedSprite2D. Anchor point at bottom feet (Vector2(0, 32)). Ideal for classic side/turn battlers.",
    unityTip: "PPU: 32. For turn-based combat screens, configure Sorting Layer: 'Combat_Units' with Y-sorting.",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="pal-shadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.8"/>
      <stop offset="65%" stop-color="#0f172a" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="armor-plate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
    <linearGradient id="cape-red" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="70%" stop-color="#b91c1c"/>
      <stop offset="100%" stop-color="#7f1d1d"/>
    </linearGradient>
    <filter id="sword-bloom" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- SHADOW -->
  <g id="shadows">
    <ellipse cx="64" cy="116" rx="32" ry="9" fill="url(#pal-shadow)" />
  </g>

  <!-- BASE GEOMETRY (Body, Armor, Cape) -->
  <g id="base-art">
    <!-- Flowing Red Cape (Background) -->
    <path d="M48,46 C40,65 36,92 34,112 C44,114 84,114 94,112 C92,92 88,65 80,46 Z" 
          fill="url(#cape-red)" stroke="#7f1d1d" stroke-width="1"/>

    <!-- Greaves / Legs -->
    <rect x="52" y="90" width="10" height="24" rx="3" fill="url(#armor-plate)" stroke="#334155" stroke-width="0.75"/>
    <rect x="66" y="90" width="10" height="24" rx="3" fill="url(#armor-plate)" stroke="#334155" stroke-width="0.75"/>
    <!-- Sabatons (Boots) -->
    <polygon points="50,114 62,114 64,110 52,110" fill="#334155"/>
    <polygon points="66,114 78,114 76,110 64,110" fill="#1e293b"/>

    <!-- Cuirass / Chest Armor -->
    <path d="M50,46 L78,46 L74,84 L64,88 L54,84 Z" fill="url(#armor-plate)" stroke="#1e293b" stroke-width="1"/>

    <!-- Pauldrons (Shoulder Guards) -->
    <polygon points="44,42 54,44 52,60 40,56" fill="#f59e0b" stroke="#78350f" stroke-width="0.75"/>
    <polygon points="84,42 74,44 76,60 88,56" fill="#d97706" stroke="#78350f" stroke-width="0.75"/>

    <!-- Helmet / Sallet Visor -->
    <ellipse cx="64" cy="30" rx="12" ry="14" fill="url(#armor-plate)" stroke="#1e293b" stroke-width="1"/>
    <!-- Visor Slit -->
    <rect x="56" y="30" width="16" height="3" rx="1" fill="#0f172a"/>
    <!-- Visor Glow -->
    <line x1="58" y1="31.5" x2="70" y2="31.5" stroke="#38bdf8" stroke-width="1.2"/>
    <!-- Plume Crest -->
    <path d="M64,16 C64,10 74,8 82,14 C76,18 70,20 64,22 Z" fill="#ef4444" stroke="#991b1b" stroke-width="0.75"/>
  </g>

  <!-- PIXEL & SURFACE DETAILS -->
  <g id="details">
    <!-- Golden Lion Heraldry Emblem on Chest -->
    <circle cx="64" cy="62" r="5" fill="#f59e0b" stroke="#b45309" stroke-width="0.75"/>
    <polygon points="64,59 66,63 62,63" fill="#fef08a"/>

    <!-- Plate Armor Segments / Faulds -->
    <line x1="53" y1="74" x2="75" y2="74" stroke="#475569" stroke-width="1"/>
    <line x1="55" y1="80" x2="73" y2="80" stroke="#475569" stroke-width="1"/>
  </g>

  <!-- HD-2D RIM LIGHTING -->
  <g id="rim-lighting">
    <!-- Right side Cold Rim Light -->
    <path d="M88,56 C92,74 92,96 94,112" stroke="#38bdf8" stroke-width="1.2" fill="none" opacity="0.8"/>
    <!-- Left side Golden Sun Rim Light -->
    <path d="M40,56 C36,74 36,96 34,112" stroke="#fef08a" stroke-width="1.5" fill="none" opacity="0.9"/>
    <!-- Helmet Rim Highlight -->
    <path d="M54,22 C58,18 70,18 74,22" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.9"/>
  </g>

  <!-- WEAPON & BLOOM FX -->
  <g id="bloom-fx" filter="url(#sword-bloom)">
    <!-- Greatsword Blade (Right Hand Held) -->
    <polygon points="86,40 92,36 102,96 98,98" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.75"/>
    <!-- Sword Core Light -->
    <line x1="89" y1="38" x2="100" y2="97" stroke="#fef08a" stroke-width="1.5"/>

    <!-- Golden Sun Aura Sparks around crossguard -->
    <circle cx="88" cy="46" r="3" fill="#fde047" opacity="0.8"/>
    <circle cx="82" cy="40" r="1.5" fill="#ffffff"/>
    <circle cx="94" cy="34" r="1.2" fill="#fef08a"/>
    <circle cx="103" cy="98" r="1.5" fill="#fef08a"/>
  </g>
</svg>`,
  },
  {
    id: "cobblestone-brazier",
    title: "Isometric Lantern Brazier",
    description: "Isometric stone fireplace lantern with blazing golden embers, cast volumetric light cone, and carved masonry block base.",
    category: "prop",
    perspective: "isometric",
    recommendedGrid: "64x64",
    dominantColors: ["#1c1917", "#44403c", "#f97316", "#f59e0b", "#fde047", "#78350f"],
    hd2dStyle: "octopath-lantern",
    promptUsed: "Isometric medieval cobblestone fire brazier pillar with blazing warm flame and volumetric golden lantern glow in HD-2D style",
    godotTip: "Add a PointLight2D node with texture set to a radial gradient for genuine real-time dynamic shadows on nearby tilemaps.",
    unityTip: "Add Light2D (Point Light) component in Universal RP 2D with Outer Radius 3.5, Inner Radius 0.8, Color #FFAE42.",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="braz-sh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#1c1917" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fire-volumetric" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.85"/>
      <stop offset="35%" stop-color="#f59e0b" stop-opacity="0.45"/>
      <stop offset="70%" stop-color="#ea580c" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="iron-cage" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78716c"/>
      <stop offset="100%" stop-color="#1c1917"/>
    </linearGradient>
    <filter id="fire-bloom" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- SHADOW -->
  <g id="shadows">
    <ellipse cx="64" cy="114" rx="42" ry="12" fill="url(#braz-sh)" />
  </g>

  <!-- BASE GEOMETRY (Isometric Stone Plinth) -->
  <g id="base-art">
    <!-- Lower Masonry Base -->
    <polygon points="64,96 92,106 64,116 36,106" fill="#57534e" stroke="#292524" stroke-width="0.75"/>
    <polygon points="36,106 64,116 64,120 36,110" fill="#292524"/>
    <polygon points="64,116 92,106 92,110 64,120" fill="#1c1917"/>

    <!-- Stone Pillar Shaft -->
    <polygon points="64,68 84,76 84,102 64,94" fill="#44403c" stroke="#1c1917" stroke-width="0.75"/>
    <polygon points="64,68 44,76 44,102 64,94" fill="#57534e" stroke="#292524" stroke-width="0.75"/>

    <!-- Upper Brazier Basin -->
    <polygon points="64,58 92,68 64,78 36,68" fill="#78716c" stroke="#1c1917" stroke-width="0.75"/>
    <!-- Iron Bowl Rim -->
    <polygon points="36,68 64,78 64,82 36,72" fill="#292524"/>
    <polygon points="64,78 92,68 92,72 64,82" fill="#1c1917"/>

    <!-- Cast Iron Cage Spikes -->
    <line x1="42" y1="69" x2="40" y2="48" stroke="url(#iron-cage)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="86" y1="69" x2="88" y2="48" stroke="url(#iron-cage)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="64" y1="78" x2="64" y2="52" stroke="url(#iron-cage)" stroke-width="2.5" stroke-linecap="round"/>
  </g>

  <!-- PIXEL & SURFACE DETAILS -->
  <g id="details">
    <!-- Mortar lines in stone pillar -->
    <line x1="44" y1="84" x2="64" y2="76" stroke="#292524" stroke-width="0.75"/>
    <line x1="44" y1="92" x2="64" y2="84" stroke="#292524" stroke-width="0.75"/>
    <line x1="64" y1="76" x2="84" y2="84" stroke="#1c1917" stroke-width="0.75"/>
    <line x1="64" y1="84" x2="84" y2="92" stroke="#1c1917" stroke-width="0.75"/>
  </g>

  <!-- HD-2D RIM LIGHTING -->
  <g id="rim-lighting">
    <!-- Torchlight reflection on upper basin lip -->
    <polygon points="64,60 88,68 64,76 40,68" fill="#f59e0b" opacity="0.3"/>
    <line x1="36" y1="68" x2="64" y2="78" stroke="#fef08a" stroke-width="1.2" opacity="0.9"/>
  </g>

  <!-- VOLUMETRIC BLOOM & FIRE -->
  <g id="bloom-fx" filter="url(#fire-bloom)">
    <!-- Large Volumetric Lantern Glow Sphere -->
    <circle cx="64" cy="54" r="32" fill="url(#fire-volumetric)"/>

    <!-- Dancing Flame Core -->
    <path d="M64,28 C68,38 74,44 72,56 C70,64 58,64 56,56 C54,44 60,38 64,28 Z" fill="#ea580c"/>
    <path d="M64,36 C67,42 70,48 68,54 C66,60 62,60 60,54 C58,48 61,42 64,36 Z" fill="#f59e0b"/>
    <ellipse cx="64" cy="52" rx="4" ry="6" fill="#fef08a"/>

    <!-- Rising Embers -->
    <circle cx="62" cy="24" r="1.5" fill="#fef08a"/>
    <circle cx="68" cy="20" r="1.2" fill="#fde047"/>
    <circle cx="58" cy="16" r="1" fill="#f97316"/>
    <circle cx="65" cy="12" r="0.8" fill="#fed7aa"/>
  </g>
</svg>`,
  },
  {
    id: "celestial-sword",
    title: "Aetherial Astral Blade",
    description: "Side-view relic broadsword forged from obsidian with starry mana crystalline edge, engraved runic fuller, and cosmic particle bloom.",
    category: "weapon",
    perspective: "side-scroll",
    recommendedGrid: "64x64",
    dominantColors: ["#0284c7", "#38bdf8", "#0f172a", "#f59e0b", "#fde047", "#ffffff"],
    hd2dStyle: "mana-sanctuary",
    promptUsed: "Side view legendary HD-2D relic sword with glowing cyan crystal blade, brass winged crossguard, and floating stardust embers",
    godotTip: "Attach to a BoneAttachment2D or Hand Node on your character rig. Use z_index = 1 to layer in front of the player torso.",
    unityTip: "PPU: 32. Pivot point set to Custom: Pommel/Grip center (0.2, 0.5) for proper weapon swing rotation.",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="blade-sh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="crystal-edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0f2fe"/>
      <stop offset="30%" stop-color="#38bdf8"/>
      <stop offset="80%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0c4a6e"/>
    </linearGradient>
    <linearGradient id="gold-hilt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <filter id="astral-bloom" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- SHADOW -->
  <g id="shadows">
    <ellipse cx="64" cy="116" rx="48" ry="6" fill="url(#blade-sh)" />
  </g>

  <!-- BASE GEOMETRY (Sword Diagonal Stance) -->
  <g id="base-art">
    <!-- Blade Core (Obsidian Spine) -->
    <polygon points="112,16 48,80 42,86 44,78" fill="#0f172a" stroke="#020617" stroke-width="0.75"/>

    <!-- Crystal Cutting Edges -->
    <polygon points="112,16 116,20 54,82 48,80" fill="url(#crystal-edge)"/>
    <polygon points="112,16 108,12 44,78 48,80" fill="url(#crystal-edge)"/>

    <!-- Winged Crossguard -->
    <polygon points="40,74 54,88 48,94 34,80" fill="url(#gold-hilt)" stroke="#78350f" stroke-width="0.75"/>
    <polygon points="34,80 48,94 44,98 30,84" fill="#b45309"/>

    <!-- Grip (Wrapped Leather) -->
    <polygon points="34,88 20,102 24,106 38,92" fill="#78350f" stroke="#451a03" stroke-width="0.75"/>

    <!-- Astral Pommel Gem -->
    <circle cx="18" cy="108" r="5" fill="url(#gold-hilt)" stroke="#78350f" stroke-width="0.75"/>
    <circle cx="18" cy="108" r="3" fill="#38bdf8"/>
  </g>

  <!-- PIXEL & SURFACE DETAILS -->
  <g id="details">
    <!-- Grip Wire Ribs -->
    <line x1="32" y1="91" x2="35" y2="94" stroke="#fef08a" stroke-width="1"/>
    <line x1="28" y1="95" x2="31" y2="98" stroke="#fef08a" stroke-width="1"/>
    <line x1="24" y1="99" x2="27" y2="102" stroke="#fef08a" stroke-width="1"/>

    <!-- Runic Inscriptions on Blade Spine -->
    <line x1="56" y1="72" x2="100" y2="28" stroke="#e0f2fe" stroke-width="1" stroke-dasharray="3,2"/>
  </g>

  <!-- HD-2D RIM LIGHTING -->
  <g id="rim-lighting">
    <!-- Diamond Sharp Blade Edge Light -->
    <line x1="44" y1="78" x2="112" y2="16" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    <polygon points="112,16 118,22 114,22" fill="#ffffff"/>
  </g>

  <!-- BLOOM & PARTICLES -->
  <g id="bloom-fx" filter="url(#astral-bloom)">
    <!-- Blade Aura Line -->
    <line x1="50" y1="78" x2="110" y2="18" stroke="#38bdf8" stroke-width="3" opacity="0.6"/>

    <!-- Star Dust Particles -->
    <circle cx="80" cy="42" r="1.5" fill="#ffffff"/>
    <circle cx="94" cy="30" r="1.8" fill="#cffafe"/>
    <circle cx="106" cy="14" r="2.2" fill="#fef08a"/>
    <circle cx="68" cy="60" r="1.2" fill="#38bdf8"/>
    <circle cx="18" cy="108" r="4" fill="#67e8f9" opacity="0.7"/>
  </g>
</svg>`,
  },
  {
    id: "scholar-sorceress",
    title: "Arcane Scholar Sorceress",
    description: "Detailed human female scholar with layered violet coat, silver flowing hair, glasses, casting rune ring, and floating grimoire.",
    category: "character",
    perspective: "front",
    recommendedGrid: "64x64",
    dominantColors: ["#4c1d95", "#7c3aed", "#e0e7ff", "#f59e0b", "#fde047", "#1e1b4b"],
    hd2dStyle: "mana-sanctuary",
    promptUsed: "Detailed human female mage scholar with silver hair, wire-rim spectacles, royal violet academic coat, and glowing floating spellbook in Octopath HD-2D style",
    godotTip: "Set Sprite2D offset to Vector2(0, -32). Perfect for turn-based party member or dialogue portrait.",
    unityTip: "PPU: 32. In Universal RP, assign Sprite-Lit material with a Point Light component for the floating grimoire.",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Contact Shadow -->
    <radialGradient id="sorc-sh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.85"/>
      <stop offset="65%" stop-color="#2e1065" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <!-- Robe Velvet -->
    <linearGradient id="robe-violet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="50%" stop-color="#5b21b6"/>
      <stop offset="100%" stop-color="#2e1065"/>
    </linearGradient>
    <!-- Silver Hair -->
    <linearGradient id="silver-hair" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <!-- Book Gold Leaf -->
    <linearGradient id="book-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <!-- Magic Rune Bloom -->
    <filter id="spell-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2.2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- SHADOW -->
  <g id="shadows">
    <ellipse cx="64" cy="116" rx="30" ry="8" fill="url(#sorc-sh)" />
  </g>

  <!-- BASE GEOMETRY (Human Anatomy & Garments) -->
  <g id="base-art">
    <!-- Back Cloak Hem -->
    <path d="M46,62 C40,82 38,106 42,114 C56,116 72,116 86,114 C90,106 88,82 82,62 Z" fill="#1e1b4b"/>

    <!-- Slender Scholar Boots -->
    <rect x="54" y="98" width="7" height="16" rx="2" fill="#312e81"/>
    <rect x="67" y="98" width="7" height="16" rx="2" fill="#1e1b4b"/>
    <polygon points="53,114 62,114 61,111 53,111" fill="#0f172a"/>
    <polygon points="67,114 76,114 75,111 67,111" fill="#020617"/>

    <!-- Pleated Cream Skirt -->
    <polygon points="52,78 76,78 80,100 48,100" fill="#ede9fe" stroke="#c4b5fd" stroke-width="0.75"/>

    <!-- Tailored Academic Waistcoat & Tunic -->
    <path d="M50,48 L78,48 L74,80 L54,80 Z" fill="url(#robe-violet)" stroke="#312e81" stroke-width="0.75"/>
    <!-- Gold Trimmed Lapels -->
    <polygon points="58,48 64,68 56,68" fill="#f59e0b"/>
    <polygon points="70,48 64,68 72,68" fill="#d97706"/>

    <!-- Slender Neck & Face Anatomy -->
    <rect x="61" y="38" width="6" height="11" fill="#fed7aa"/>
    <!-- Head Base / Jawline -->
    <polygon points="54,26 74,26 72,40 64,44 56,40" fill="#ffedd5"/>

    <!-- Expressive Facial Details -->
    <!-- Eyes (Sapphire Mana Iris) -->
    <rect x="57" y="31" width="3" height="3.5" rx="0.5" fill="#1e3a8a"/>
    <circle cx="58" cy="32" r="0.8" fill="#60a5fa"/>
    <rect x="68" y="31" width="3" height="3.5" rx="0.5" fill="#1e3a8a"/>
    <circle cx="69" cy="32" r="0.8" fill="#60a5fa"/>
    <!-- Wire-Rim Spectacles -->
    <circle cx="58.5" cy="32.5" r="3" fill="none" stroke="#f59e0b" stroke-width="0.75"/>
    <circle cx="69.5" cy="32.5" r="3" fill="none" stroke="#f59e0b" stroke-width="0.75"/>
    <line x1="61.5" y1="32.5" x2="66.5" y2="32.5" stroke="#f59e0b" stroke-width="0.75"/>
    <!-- Gentle Smile & Nose -->
    <rect x="63.5" y="34.5" width="1" height="2" fill="#fb923c" opacity="0.6"/>
    <line x1="62.5" y1="39" x2="65.5" y2="39" stroke="#e11d48" stroke-width="0.8" stroke-linecap="round"/>

    <!-- Voluminous Silver Flowing Hair -->
    <path d="M54,26 C50,18 64,12 74,22 C82,24 84,36 82,50 C78,44 76,32 72,30 C68,28 60,28 56,34 C54,42 50,48 46,52 C44,38 48,28 54,26 Z" 
          fill="url(#silver-hair)" stroke="#94a3b8" stroke-width="0.5"/>
    <!-- Forehead Bangs -->
    <path d="M55,26 Q64,30 73,26 Q65,24 55,26 Z" fill="#ffffff"/>
  </g>

  <!-- PIXEL & SURFACE DETAILS -->
  <g id="details">
    <!-- Brass Buttons on Waistcoat -->
    <circle cx="64" cy="54" r="1" fill="#fde047"/>
    <circle cx="64" cy="62" r="1" fill="#fde047"/>
    <circle cx="64" cy="70" r="1" fill="#fde047"/>

    <!-- Left Hand Casting Gesture -->
    <polygon points="46,58 50,56 48,70 44,68" fill="#fed7aa"/>
    <circle cx="45" cy="71" r="1.5" fill="#fde047"/>
  </g>

  <!-- HD-2D RIM LIGHTING -->
  <g id="rim-lighting">
    <!-- Golden Sun Rim on Hair & Shoulder -->
    <path d="M74,22 C82,28 84,40 82,56" stroke="#fde047" stroke-width="1.2" fill="none" opacity="0.9"/>
    <!-- Cold Starlight Rim on Left Robe Edge -->
    <path d="M46,52 C42,70 40,94 42,114" stroke="#a5b4fc" stroke-width="1" fill="none" opacity="0.7"/>
  </g>

  <!-- FLOATING GRIMOIRE & SPELL FX -->
  <g id="bloom-fx" filter="url(#spell-glow)">
    <!-- Floating Grimoire Book (Levitating to her right) -->
    <polygon points="86,60 102,54 102,74 86,80" fill="#4c1d95" stroke="#7c3aed" stroke-width="0.75"/>
    <polygon points="102,54 116,60 116,80 102,74" fill="#6d28d9" stroke="#7c3aed" stroke-width="0.75"/>
    <!-- Glowing Parchment Pages -->
    <polygon points="88,61 101,56 101,73 88,78" fill="#fef08a"/>
    <polygon points="103,56 114,61 114,78 103,73" fill="#fef9c3"/>
    <!-- Book Gold Filigree Bookmark -->
    <path d="M102,54 L102,84" stroke="url(#book-gold)" stroke-width="1.5"/>

    <!-- Hand Cast Arcane Rune Ring -->
    <circle cx="45" cy="72" r="8" fill="none" stroke="#c084fc" stroke-width="0.75" stroke-dasharray="2,2"/>
    <polygon points="45,66 49,74 41,74" fill="none" stroke="#e879f9" stroke-width="0.5"/>
    <polygon points="45,78 41,70 49,70" fill="none" stroke="#e879f9" stroke-width="0.5"/>

    <!-- Floating Arcane Glyphs & Particles -->
    <circle cx="45" cy="72" r="2" fill="#ffffff"/>
    <circle cx="36" cy="65" r="1.2" fill="#c084fc"/>
    <circle cx="106" cy="48" r="1.5" fill="#fde047"/>
    <circle cx="94" cy="50" r="1.2" fill="#a855f7"/>
    <circle cx="118" cy="72" r="1" fill="#e879f9"/>
  </g>
</svg>`,
  },
  {
    id: "shadow-rogue",
    title: "Shadow Infiltrator Rogue",
    description: "Detailed human rogue in midnight cowl, twin silver stilettos with venom rim-light, flowing scarf, and agile combat idle pose.",
    category: "character",
    perspective: "front",
    recommendedGrid: "64x64",
    dominantColors: ["#0f172a", "#1e293b", "#dc2626", "#10b981", "#34d399", "#f1f5f9"],
    hd2dStyle: "triangle-strategy",
    promptUsed: "Detailed human rogue assassin in hooded cowl with flowing red scarf and twin poisoned daggers in Triangle Strategy HD-2D style",
    godotTip: "Configure AnimatedSprite2D with 'idle', 'sneak', and 'dagger_flurry' clips. Anchor at feet.",
    unityTip: "PPU: 32. Use Tight mesh generation with Physics Shape enabled for hit detection.",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rogue-sh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#042f2e" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="stealth-leather" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="60%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="scarf-crimson" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
    <filter id="venom-bloom" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- SHADOW -->
  <g id="shadows">
    <ellipse cx="64" cy="116" rx="36" ry="9" fill="url(#rogue-sh)" />
  </g>

  <!-- BASE GEOMETRY (Agile Human Anatomy) -->
  <g id="base-art">
    <!-- Flowing Crimson Scarf Tails -->
    <path d="M68,46 C78,54 94,62 104,74 C96,74 84,66 74,58 Z" fill="url(#scarf-crimson)"/>

    <!-- Crouched Agile Legs -->
    <!-- Left Leg (Bent forward) -->
    <polygon points="50,86 60,86 54,114 44,114" fill="url(#stealth-leather)"/>
    <!-- Right Leg (Braced backward) -->
    <polygon points="68,86 78,86 86,114 76,114" fill="#0f172a"/>
    <!-- Leather Boots with Straps -->
    <polygon points="42,114 56,114 55,110 43,110" fill="#020617"/>
    <polygon points="76,114 90,114 88,110 77,110" fill="#020617"/>

    <!-- Padded Leather Jerkin / Torso -->
    <polygon points="50,50 78,50 74,88 54,88" fill="url(#stealth-leather)" stroke="#0f172a" stroke-width="0.75"/>

    <!-- Scarf Collar Knot -->
    <path d="M52,48 C56,44 72,44 76,48 C72,56 56,56 52,48 Z" fill="url(#scarf-crimson)" stroke="#7f1d1d" stroke-width="0.75"/>

    <!-- Hooded Cowl / Human Head Base -->
    <path d="M52,44 C48,32 52,18 64,16 C76,18 80,32 76,44 C72,46 56,46 52,44 Z" 
          fill="#1e293b" stroke="#0f172a" stroke-width="1"/>

    <!-- Shadowed Face Under Cowl -->
    <polygon points="56,30 72,30 68,40 60,40" fill="#09090b"/>
    <!-- Intense Focused Eyes (Gleaming Amber) -->
    <circle cx="60.5" cy="34" r="1.2" fill="#fbbf24"/>
    <circle cx="67.5" cy="34" r="1.2" fill="#fbbf24"/>
    <line x1="59" y1="32.5" x2="63" y2="33.5" stroke="#f59e0b" stroke-width="0.8"/>
    <line x1="69" y1="32.5" x2="65" y2="33.5" stroke="#f59e0b" stroke-width="0.8"/>
  </g>

  <!-- PIXEL & SURFACE DETAILS -->
  <g id="details">
    <!-- Utility Belt with Pouch & Throwing Needles -->
    <rect x="52" y="80" width="24" height="4" rx="1" fill="#78350f"/>
    <rect x="68" y="78" width="5" height="7" rx="1" fill="#451a03" stroke="#78350f" stroke-width="0.5"/>
    <line x1="56" y1="81" x2="56" y2="86" stroke="#94a3b8" stroke-width="0.75"/>
    <line x1="58" y1="81" x2="58" y2="86" stroke="#94a3b8" stroke-width="0.75"/>
    <line x1="60" y1="81" x2="60" y2="86" stroke="#94a3b8" stroke-width="0.75"/>
  </g>

  <!-- HD-2D RIM LIGHTING -->
  <g id="rim-lighting">
    <!-- Cold Moonlight Rim Highlight on Left Shoulder -->
    <path d="M52,44 C48,58 48,74 50,86" stroke="#94a3b8" stroke-width="1.2" fill="none" opacity="0.8"/>
    <!-- Cowl Edge Sharp Highlight -->
    <path d="M52,36 C52,22 62,17 64,16" stroke="#f1f5f9" stroke-width="1" fill="none" opacity="0.9"/>
  </g>

  <!-- TWIN VENOM BLADES & BLOOM -->
  <g id="bloom-fx" filter="url(#venom-bloom)">
    <!-- Right Hand Stiletto (Pointed Downward) -->
    <polygon points="38,62 44,60 30,94 28,92" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.75"/>
    <line x1="40" y1="62" x2="29" y2="93" stroke="#34d399" stroke-width="1.5"/>

    <!-- Left Hand Stiletto (Reversed Grip Forward) -->
    <polygon points="86,66 92,64 106,78 104,80" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.75"/>
    <line x1="88" y1="66" x2="105" y2="79" stroke="#34d399" stroke-width="1.5"/>

    <!-- Toxic Venom Embers & Glint -->
    <circle cx="29" cy="94" r="2" fill="#6ee7b7"/>
    <circle cx="106" cy="79" r="2" fill="#6ee7b7"/>
    <circle cx="34" cy="80" r="1.2" fill="#a7f3d0"/>
    <circle cx="96" cy="70" r="1.2" fill="#a7f3d0"/>
  </g>
</svg>`,
  },
];
