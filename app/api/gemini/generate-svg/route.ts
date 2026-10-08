import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { vectorizeImageToInkscape } from "@/lib/inkscape-vectorizer";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      category,
      perspective,
      hd2dStyle = "none",
      resolution = 128,
      numColors = 8,
      removeBackground = true,
      cornerSmoothing = 1.0,
      suppressSpeckles = 2,
      imageBase64,
      imageMimeType = "image/png",
      contentMode = "unfiltered",
      model = "auto",
    } = body;

    if (!prompt && !imageBase64) {
      return NextResponse.json(
        { error: "Prompt or image is required" },
        { status: 400 }
      );
    }

    const styleDescriptions: Record<string, string> = {
      "none": "",
      "octopath-lantern": "warm amber candlelight and crisp HD-2D pixel contours",
      "triangle-strategy": "tactical medieval realism with cold silvery rim lighting",
      "mana-sanctuary": "ethereal turquoise cyan and magenta crystalline bloom",
      "dungeon-crypt": "dark fantasy dungeon with purple soulfire rim lights",
      "cyberpunk-neon": "cyberpunk 2.5D with electric cyan and magenta neon backlights",
      "ghibli-verdant": "lush emerald moss and gentle anime watercolor lighting",
    };

    const chosenStyleDescription = styleDescriptions[hd2dStyle] || "";

    let imageBuffer: Buffer;
    let sourceImageUrl: string = "";
    let modelUsed = model === "auto" ? "Flux 2D Game Asset Engine" : model;

    // STEP 1: OBTAIN IMAGE (Pure User Prompt -> Image, or User Uploaded Image)
    if (imageBase64) {
      // User uploaded an image to vectorize
      const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
      sourceImageUrl = imageBase64.startsWith("data:")
        ? imageBase64
        : `data:${imageMimeType};base64,${base64Data}`;
      modelUsed = "Direct Image Upload -> Inkscape Multi-Layer Vectorizer";
    } else {
      // Pure user prompt by default! No archetypes, no forced outfits, no rigid injections.
      const rawUserPrompt = (prompt || "").trim();
      const promptParts = [rawUserPrompt];

      if (chosenStyleDescription) {
        promptParts.push(chosenStyleDescription);
      }

      const fullImagePrompt = promptParts.filter(Boolean).join(", ");

      let generatedBuffer: Buffer | null = null;

      // If user specifically requested Gemini image models, try that first
      if (model.includes("gemini") && model.includes("image")) {
        try {
          const res = await ai.models.generateContent({
            model,
            contents: fullImagePrompt,
            config: {
              imageConfig: { aspectRatio: "1:1" } as any,
            },
          });
          const parts = res.candidates?.[0]?.content?.parts || [];
          for (const p of parts) {
            if (p.inlineData?.data) {
              generatedBuffer = Buffer.from(p.inlineData.data, "base64");
              sourceImageUrl = `data:${p.inlineData.mimeType || "image/png"};base64,${p.inlineData.data}`;
              modelUsed = model;
              break;
            }
          }
        } catch (geminiErr: any) {
          console.warn("Gemini image generation unavailable, failing over to Flux/SDXL:", geminiErr?.message);
        }
      }

      // If not generated yet, use premier Free Open-Source Image Engine (Flux / SDXL via Pollinations)
      if (!generatedBuffer) {
        const seed = Math.floor(Math.random() * 1000000);
        let pollModel = "flux";
        if (model === "flux-turbo") pollModel = "turbo";
        else if (model === "sdxl-sprites") pollModel = "sdxl";
        else if (model === "unity-craft") pollModel = "unity";

        // Generate at high fidelity (512 or 768) so vectorizer has crisp contours & details
        const reqRes = Number(resolution) || 512;
        const imgGenDim = reqRes >= 768 ? 768 : 512;
        const encodedPrompt = encodeURIComponent(fullImagePrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${imgGenDim}&height=${imgGenDim}&model=${pollModel}&seed=${seed}&nologo=true`;

        try {
          const imageRes = await fetch(imageUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
            cache: "no-store",
          });

          if (!imageRes.ok) {
            throw new Error(`External image model returned ${imageRes.status}`);
          }

          const arrayBuf = await imageRes.arrayBuffer();
          generatedBuffer = Buffer.from(arrayBuf);
          sourceImageUrl = `data:image/jpeg;base64,${generatedBuffer.toString("base64")}`;
          modelUsed =
            model === "auto"
              ? "Flux 2D Game Asset Engine"
              : `${model} (Free Open Engine)`;
        } catch (pollErr: any) {
          console.error("Pollinations image generation error:", pollErr);
          throw new Error(
            `Image generation failed: ${pollErr?.message || "Could not generate raster image for vectorization"}`
          );
        }
      }

      imageBuffer = generatedBuffer;
    }

    // STEP 2: IMAGE -> INKSCAPE SVG VECTORIZATION
    const targetSize = Math.max(64, Math.min(1024, Number(resolution) || 512));
    const colorsCount = Math.max(4, Math.min(16, Number(numColors) || 8));

    const vectorResult = vectorizeImageToInkscape(imageBuffer, {
      targetSize,
      numColors: colorsCount,
      removeBackground: Boolean(removeBackground),
      cornerSmoothing: typeof cornerSmoothing === "number" ? cornerSmoothing : undefined,
      suppressSpeckles: typeof suppressSpeckles === "number" ? suppressSpeckles : undefined,
      title: prompt ? prompt.slice(0, 32) : "HD-2D Game Asset",
    });

    // STEP 3: ASSET METADATA & ENGINE TIPS
    // Generate clean descriptive metadata
    const assetTitle = prompt
      ? prompt
          .split(" ")
          .slice(0, 5)
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : "Custom HD-2D Asset";

    const assetDesc = `${chosenStyleDescription.split(",")[0]} rendered as a multi-layer Inkscape SVG vector game asset with ${vectorResult.stats.layerCount} distinct color layers and ${vectorResult.stats.pathCount} paths.`;

    const godotTip = `Import the Inkscape SVG directly into Godot 4. In Sprite2D: Set texture filter to 'Nearest'. Split the ${vectorResult.stats.layerCount} Inkscape layers into separate CanvasItems to animate glow and shadows independently.`;
    const unityTip = `Import the SVG as a Vector Sprite using Unity Vector Graphics package. Set Pixels Per Unit to ${targetSize / 4}, Point (no filter) sampling, and pivot to (0.5, 0.1).`;

    return NextResponse.json({
      title: assetTitle,
      description: assetDesc,
      category,
      perspective,
      recommendedGrid: `${targetSize}x${targetSize}`,
      dominantColors: vectorResult.palette,
      svg: vectorResult.inkscapeSvg,
      plainSvg: vectorResult.plainSvg,
      sourceImageUrl,
      vectorStats: vectorResult.stats,
      layers: vectorResult.layers,
      godotTip,
      unityTip,
      contentMode,
      modelUsed,
      pipeline: "Text -> Image -> Inkscape SVG",
    });
  } catch (error: any) {
    console.error("Error in Text->Image->Inkscape SVG pipeline:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process Text->Image->Inkscape SVG pipeline" },
      { status: 500 }
    );
  }
}
