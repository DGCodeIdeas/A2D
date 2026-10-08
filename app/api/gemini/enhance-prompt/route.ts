import { NextRequest, NextResponse } from "next/server";
import { generateWithModelFallback } from "@/lib/models-server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, category = "prop", style = "octopath-lantern", model = "auto" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { response, modelUsed } = await generateWithModelFallback({
      selectedModel: model,
      contents: `You are an expert game art director specializing in the modern "HD-2D" visual style (Octopath Traveler, Triangle Strategy, Dragon Quest III HD-2D).
Rewrite this raw prompt into an exquisite, detail-rich HD-2D game asset prompt:
Raw prompt: "${prompt}"
Category: ${category}
Aesthetic lighting bias: ${style}

Include:
- Perspective (isometric 2.5D or side-battler)
- Architectural / material details (cracked stone, weathered oak, polished damascus steel, brass rivets)
- HD-2D Lighting specifics (golden candlelight specular bloom, cold moonlit rim light, contact cast shadow)
- Particle / atmospheric details (mana embers, floating dust motes, moss growth)

Respond with ONLY the polished prompt text (no quotes, no preamble, maximum 3-4 concise, evocative sentences).`,
    });

    const enhanced = response.text?.trim() || prompt;
    return NextResponse.json({ enhancedPrompt: enhanced, modelUsed });
  } catch (error: any) {
    console.error("Error enhancing prompt:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
