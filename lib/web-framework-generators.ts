import { HD2DAsset } from "./preset-assets";

export interface WebFrameworkCode {
  id: string;
  name: string;
  language: string;
  category: "2d" | "2.5d-3d" | "minimal";
  snippet: string;
  instructions: string;
  badge: string;
}

export function generatePhaserCode(asset: HD2DAsset): string {
  const assetName = asset.id.replace(/[^a-zA-Z0-9]/g, "_");
  return `// Phaser 3 / 4 Scene Integration
// Framework: Phaser (WebGL / Canvas)
// Supports SVG directly via data-URI or asset loader

export class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainGameScene' });
  }

  preload() {
    // 1. Load SVG vector asset directly via base64 data URI
    const svgDataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(\`${asset.svg.replace(/`/g, "\\`")}\`);
    this.load.svg('${assetName}', svgDataUri, {
      width: ${parseInt(asset.recommendedGrid) || 64},
      height: ${parseInt(asset.recommendedGrid) || 64}
    });
  }

  create() {
    // 2. Spawn HD-2D sprite with pixel art nearest-neighbor rendering
    const player = this.add.sprite(400, 300, '${assetName}');
    
    // Enable HD-2D depth Y-sorting: objects lower on screen draw on top
    player.setOrigin(0.5, 0.9); // Anchor to feet
    player.setDepth(player.y);

    // Phaser Post-FX Pipeline: Warm Golden Bloom & Specular Glow
    if (this.renderer.pipelines && this.renderer.pipelines.has('Bloom')) {
      player.setPostPipeline('Bloom');
    }

    // 3. Simple WASD movement controller
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = player;
  }

  update() {
    const speed = 160;
    if (this.cursors.left.isDown) {
      this.player.x -= speed * (1 / 60);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.x += speed * (1 / 60);
      this.player.setFlipX(false);
    }
    if (this.cursors.up.isDown) this.player.y -= speed * (1 / 60);
    if (this.cursors.down.isDown) this.player.y += speed * (1 / 60);

    // Update Y-sorting depth continuously
    this.player.setDepth(this.player.y);
  }
}`;
}

export function generatePixiCode(asset: HD2DAsset): string {
  const assetName = asset.id.replace(/[^a-zA-Z0-9]/g, "_");
  return `// PixiJS v8 Scene Integration
// Ultra-fast WebGL / WebGPU 2D renderer
import { Application, Assets, Sprite, PointFilter } from 'pixi.js';

(async () => {
  // 1. Initialize Pixi application
  const app = new Application();
  await app.init({ 
    width: 800, 
    height: 600, 
    backgroundColor: 0x09090b,
    antialias: false,
    resolution: window.devicePixelRatio || 1,
  });
  document.body.appendChild(app.canvas);

  // 2. Load SVG Asset into Pixi Texture Cache
  const svgDataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(\`${asset.svg.replace(/`/g, "\\`")}\`);
  const texture = await Assets.load({
    src: svgDataUri,
    loadParser: 'loadTextures',
  });

  // Enforce NEAREST neighbor for crisp HD-2D pixel clarity
  texture.source.scaleMode = 'nearest';

  // 3. Create HD-2D Sprite
  const character = new Sprite(texture);
  character.anchor.set(0.5, 0.9); // Pivot at feet for proper ground alignment
  character.position.set(400, 300);
  character.scale.set(2); // 2x scale for retro aesthetic
  
  app.stage.addChild(character);

  // 4. Game Loop with gentle floating / breathing animation
  let ticker = 0;
  app.ticker.add((time) => {
    ticker += 0.05 * time.deltaTime;
    character.scale.y = 2 + Math.sin(ticker) * 0.04; // Subtle idle breathing
  });
})();`;
}

export function generateThreeJsCode(asset: HD2DAsset): string {
  return `// Three.js 2.5D / HD-2D Spatial Scene Integration
// Creates an Octopath-style 2.5D world: 2D Sprite billboard in a 3D lit environment
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// 1. Setup 3D Scene with HD-2D Warm Lantern Point Light & Ambient Fog
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x09090b);
scene.fog = new THREE.FogExp2(0x09090b, 0.02);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 7);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: false }); // crisp pixels
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 2. HD-2D Lighting: Warm Amber Point Light (Torch) + Cold Moon Rim Light
const torchLight = new THREE.PointLight(0xffae42, 2.5, 12);
torchLight.position.set(2, 2.5, 1.5);
torchLight.castShadow = true;
scene.add(torchLight);

const ambientLight = new THREE.AmbientLight(0x1e293b, 0.8);
scene.add(ambientLight);

// 3. Cobblestone 3D Ground Plane
const groundGeo = new THREE.PlaneGeometry(20, 20);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 4. Load SVG into Texture with NEAREST filtering (HD-2D Billboard Sprite)
const svgDataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(\`${asset.svg.replace(/`/g, "\\`")}\`);
const textureLoader = new THREE.TextureLoader();
textureLoader.load(svgDataUri, (texture) => {
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  const spriteMat = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true,
    depthWrite: false 
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(2, 2, 1);
  sprite.position.set(0, 1, 0); // Position above ground
  scene.add(sprite);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`;
}

export function generateKaplayCode(asset: HD2DAsset): string {
  const assetName = asset.id.replace(/[^a-zA-Z0-9]/g, "_");
  return `// Kaplay / Kaboom.js 2D Game Framework
// Modern, friendly HTML5 game engine
import kaplay from "kaplay";

// 1. Initialize Kaplay with retro pixel grid scale
const k = kaplay({
  width: 640,
  height: 360,
  scale: 2,
  letterbox: true,
  background: [9, 9, 11],
  crisp: true, // Crucial for crisp HD-2D pixels!
});

// 2. Load SVG Sprite directly
const svgDataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(\`${asset.svg.replace(/`/g, "\\`")}\`);
k.loadSprite("${assetName}", svgDataUri);

// 3. Spawn Player Entity with 8-directional movement & Y-sorting
k.scene("game", () => {
  const player = k.add([
    k.sprite("${assetName}"),
    k.pos(k.center()),
    k.anchor("bot"), // Pivot at feet for isometric sorting
    k.area(),
    k.body(),
    k.z(10),
  ]);

  const SPEED = 120;

  k.onUpdate(() => {
    let dir = k.vec2(0, 0);
    if (k.isKeyDown("left") || k.isKeyDown("a")) dir.x -= 1;
    if (k.isKeyDown("right") || k.isKeyDown("d")) dir.x += 1;
    if (k.isKeyDown("up") || k.isKeyDown("w")) dir.y -= 1;
    if (k.isKeyDown("down") || k.isKeyDown("s")) dir.y += 1;

    if (dir.len() > 0) {
      player.move(dir.unit().scale(SPEED));
      // Flip sprite based on horizontal direction
      player.flipX = dir.x < 0;
    }

    // Dynamic HD-2D Y-sorting: objects lower on screen draw on top
    player.z = player.pos.y;
  });
});

k.go("game");`;
}

export function generateCanvas2DCode(asset: HD2DAsset): string {
  return `// Zero-Dependency Vanilla HTML5 Canvas2D HD-2D Game Loop
// Runs in any modern browser without any external libraries!

const canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 360;
canvas.style.width = '100%';
canvas.style.maxWidth = '800px';
canvas.style.imageRendering = 'pixelated';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // Nearest-neighbor crisp pixel rendering

// 1. Prepare SVG Image
const sprite = new Image();
sprite.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(\`${asset.svg.replace(/`/g, "\\`")}\`);

// 2. Player State
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  speed: 150,
  flipX: false,
  width: ${parseInt(asset.recommendedGrid) || 64},
  height: ${parseInt(asset.recommendedGrid) || 64},
};

const keys = {};
window.addEventListener('keydown', (e) => (keys[e.key.toLowerCase()] = true));
window.addEventListener('keyup', (e) => (keys[e.key.toLowerCase()] = false));

// 3. Game Loop
let lastTime = performance.now();

function gameLoop(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  // Movement input (WASD / Arrows)
  let dx = 0, dy = 0;
  if (keys['arrowleft'] || keys['a']) { dx -= 1; player.flipX = true; }
  if (keys['arrowright'] || keys['d']) { dx += 1; player.flipX = false; }
  if (keys['arrowup'] || keys['w']) dy -= 1;
  if (keys['arrowdown'] || keys['s']) dy += 1;

  if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }
  player.x += dx * player.speed * dt;
  player.y += dy * player.speed * dt;

  // Render Scene
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Isometric Grid Background
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Draw HD-2D Contact Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.ellipse(player.x, player.y + 4, player.width * 0.35, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Sprite (with flip support)
  ctx.save();
  ctx.translate(player.x, player.y - player.height * 0.8);
  if (player.flipX) ctx.scale(-1, 1);
  ctx.drawImage(sprite, -player.width / 2, -player.height / 2, player.width, player.height);
  ctx.restore();

  requestAnimationFrame(gameLoop);
}

sprite.onload = () => requestAnimationFrame(gameLoop);`;
}

export function generateStandAloneHtmlGame(asset: HD2DAsset): string {
  const escapedSvg = encodeURIComponent(asset.svg);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${asset.title} - HD-2D Web Game Demo</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #09090b;
      color: #f4f4f5;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    #game-container {
      position: relative;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245, 158, 11, 0.2);
      border: 1px solid #27272a;
      border-radius: 12px;
      overflow: hidden;
    }
    canvas {
      display: block;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    .hud {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(9, 9, 11, 0.85);
      border: 1px solid #3f3f46;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 11px;
      line-height: 1.4;
      pointer-events: none;
      backdrop-filter: blur(8px);
    }
    .badge {
      color: #fbbf24;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .keys {
      color: #a1a1aa;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div id="game-container">
    <canvas id="viewport" width="640" height="360"></canvas>
    <div class="hud">
      <div class="badge">${asset.title}</div>
      <div class="keys">Use WASD or Arrow Keys to move &middot; Space to dash</div>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('viewport');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const sprite = new Image();
    sprite.src = 'data:image/svg+xml;utf8,${escapedSvg}';

    const player = {
      x: canvas.width / 2,
      y: canvas.height / 2 + 30,
      vx: 0,
      vy: 0,
      speed: 160,
      flipX: false,
      size: ${parseInt(asset.recommendedGrid) || 64},
      scaleY: 1
    };

    const torch = {
      x: canvas.width / 2,
      y: canvas.height / 2 - 40,
      radius: 180,
      pulse: 0
    };

    const keys = {};
    window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
    window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

    let last = performance.now();

    function loop(now) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      // Input
      let dx = 0, dy = 0;
      if (keys['arrowleft'] || keys['a']) { dx -= 1; player.flipX = true; }
      if (keys['arrowright'] || keys['d']) { dx += 1; player.flipX = false; }
      if (keys['arrowup'] || keys['w']) dy -= 1;
      if (keys['arrowdown'] || keys['s']) dy += 1;

      const dash = keys[' '] ? 1.8 : 1.0;

      if (dx !== 0 && dy !== 0) { dx *= 0.7071; dy *= 0.7071; }
      player.x += dx * player.speed * dash * dt;
      player.y += dy * player.speed * dash * dt;

      // Keep in canvas bounds
      player.x = Math.max(30, Math.min(canvas.width - 30, player.x));
      player.y = Math.max(40, Math.min(canvas.height - 30, player.y));

      // Walking bounce
      if (dx !== 0 || dy !== 0) {
        player.scaleY = 1 + Math.sin(now * 0.015) * 0.08;
      } else {
        player.scaleY = 1 + Math.sin(now * 0.003) * 0.02; // idle breathing
      }

      // 1. Draw Dark Cobblestone Dungeon Floor
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor tiles
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // 2. Volumetric HD-2D Ambient Torch Light
      torch.pulse = Math.sin(now * 0.005) * 6;
      const r = torch.radius + torch.pulse;
      const grad = ctx.createRadialGradient(torch.x, torch.y, 20, torch.x, torch.y, r);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(torch.x, torch.y, r, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Player Dynamic Contact Shadow
      const shadowDistX = (player.x - torch.x) * 0.05;
      const shadowDistY = (player.y - torch.y) * 0.03;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(player.x + shadowDistX, player.y + shadowDistY, player.size * 0.35, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. Draw Character Sprite
      ctx.save();
      ctx.translate(player.x, player.y - player.size * 0.45);
      if (player.flipX) ctx.scale(-1, 1);
      ctx.scale(1, player.scaleY);
      ctx.drawImage(sprite, -player.size / 2, -player.size / 2, player.size, player.size);
      ctx.restore();

      requestAnimationFrame(loop);
    }

    sprite.onload = () => requestAnimationFrame(loop);
  </script>
</body>
</html>`;
}
