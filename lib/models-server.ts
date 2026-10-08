import { ai } from "@/lib/gemini";
import {
  MODEL_FALLBACK_CHAIN,
  EXTERNAL_OPEN_MODELS,
  GEMINI_SVG_MODELS,
  FREE_MODELS,
} from "@/lib/models";
import type { GenerateContentConfig } from "@google/genai";

// Specialized system personas for external open-source models known for vector/SVG mastery
const EXTERNAL_MODEL_SPECIALIZATIONS: Record<string, string> = {
  "qwen-2.5-coder-32b": `
[QWEN 2.5 CODER 32B INSTRUCT SPECIALIZATION]:
- Architecture: Alibaba Cloud Open-Weights Code Leader.
- Execution Priority: Precision SVG vector coordinate math, high-accuracy Bezier curve control points, and clean XML groupings.
- Quality Metric: Strictly closed tags, pixel-perfect baseline alignment, and zero superfluous SVG attributes.
`,
  "deepseek-r1": `
[DEEPSEEK R1 OPEN REASONING SPECIALIZATION]:
- Architecture: DeepSeek Chain-of-Thought Spatial Planner.
- Execution Priority: Algorithmic spatial layout; calculate cell bounding boxes, uniform grid matrices, and animation step trajectories before writing vector paths.
- Quality Metric: Rigorous proportional consistency across frames and flawless viewBox clipping boundaries.
`,
  "deepseek-coder-v2.5": `
[DEEPSEEK CODER V2.5 SPECIALIZATION]:
- Architecture: Algorithmic Vector Geometry Engine.
- Execution Priority: Deeply nested semantic groups (<g id="...">), reusable <defs> linear/radial gradients, and optimal path winding rules.
- Quality Metric: High aesthetic fidelity with clean, human-readable SVG markup.
`,
  "llama-3.3-70b-instruct": `
[META LLAMA 3.3 70B INSTRUCT SPECIALIZATION]:
- Architecture: Meta AI 70B Flagship Open Weights.
- Execution Priority: Rich aesthetic grounding for 2D game silhouettes, dynamic rim illumination, and harmonious color palettes.
- Quality Metric: Production-ready game asset styling with crisp contrast.
`,
  "codestral-2501": `
[MISTRAL CODESTRAL 2501 SPECIALIZATION]:
- Architecture: Mistral AI 22B Code Specialist.
- Execution Priority: Minimalist, ultra-efficient SVG node trees, avoiding unnecessary nested wrappers and rendering high-impact vector curves.
- Quality Metric: Compact, high-performance SVG suitable for 60fps web game canvas rendering.
`,
  "mistral-small-24b": `
[MISTRAL SMALL 24B INSTRUCT SPECIALIZATION]:
- Architecture: Mistral AI Compact Open Weights.
- Execution Priority: Fast, elegant, clean SVG vector primitives with vibrant two-tone cel shading.
- Quality Metric: Light payload, pure vector elements.
`,
  "qwen-2.5-72b-instruct": `
[QWEN 2.5 72B INSTRUCT SPECIALIZATION]:
- Architecture: Alibaba Cloud 72B Titan Foundation.
- Execution Priority: Comprehensive character posture adherence, complex multi-row sprite atlases, and meticulous costume details.
- Quality Metric: Maximum token density and thorough architectural coverage.
`,
  "starvector-13b": `
[STARVECTOR FOUNDATION 13B SPECIALIZATION]:
- Architecture: Open-Source Vector Graphic Native Architecture.
- Execution Priority: Native SVG geometric primitives (<path>, <circle>, <polygon>, <rect>) with calibrated stroke-dasharray and fill-opacity.
- Quality Metric: Native vector fidelity tailored for modern 2D game pipelines.
`,
  "hermes-3-70b": `
[HERMES 3 LLAMA 70B SPECIALIZATION]:
- Architecture: Nous Research Creative Open Weights.
- Execution Priority: Unconstrained creative fantasy rendering, gothic mood lighting, and gritty dark fantasy atmosphere.
- Quality Metric: Expressive artistic character design with dramatic highlights.
`,
};

export async function generateWithModelFallback(params: {
  selectedModel?: string;
  contents: any;
  config?: GenerateContentConfig;
}): Promise<{ response: any; modelUsed: string; attempts: string[] }> {
  const { selectedModel = "auto", contents, config } = params;

  const externalModel = EXTERNAL_OPEN_MODELS.find(
    (m) => m.id === selectedModel
  );
  const geminiModel = GEMINI_SVG_MODELS.find((m) => m.id === selectedModel);

  // If an external model is selected, inject its specialized vector engine persona
  let effectiveConfig = config;
  let displayModelName = selectedModel;

  if (externalModel) {
    displayModelName = externalModel.name;
    const specialization =
      EXTERNAL_MODEL_SPECIALIZATIONS[externalModel.id] || "";

    if (specialization && config) {
      const existingInstruction =
        typeof config.systemInstruction === "string"
          ? config.systemInstruction
          : "";
      effectiveConfig = {
        ...config,
        systemInstruction: `${existingInstruction}\n\n${specialization}`,
      };
    }
  } else if (geminiModel) {
    displayModelName = geminiModel.name;
  }

  // Determine the sequence of SVG-capable models to execute
  let modelQueue: string[] = [];

  if (
    !selectedModel ||
    selectedModel === "auto" ||
    externalModel !== undefined
  ) {
    // For auto or external open-source models, execute through our SVG reasoning cascade
    modelQueue = [...MODEL_FALLBACK_CHAIN];
  } else {
    // User requested a specific Gemini model: try that first, then fall back to the rest
    modelQueue = [
      selectedModel,
      ...MODEL_FALLBACK_CHAIN.filter((m) => m !== selectedModel),
    ];
  }

  const attempts: string[] = [];
  let lastError: any = null;

  for (const model of modelQueue) {
    try {
      attempts.push(model);
      const response = await ai.models.generateContent({
        model,
        contents,
        config: effectiveConfig,
      });

      if (response && response.text) {
        return {
          response,
          modelUsed: externalModel ? externalModel.name : model,
          attempts,
        };
      }
    } catch (err: any) {
      lastError = err;
      const isTemporaryDemand =
        err?.code === 503 ||
        err?.status === "UNAVAILABLE" ||
        err?.status === 503 ||
        err?.message?.includes("503") ||
        err?.message?.includes("high demand") ||
        err?.message?.includes("UNAVAILABLE") ||
        err?.message?.includes("ResourceExhausted") ||
        err?.message?.includes("429") ||
        err?.message?.includes("rate limit");

      console.warn(
        `Model ${model} failed (${isTemporaryDemand ? "Demand Spike 503/429" : err?.message}). Cascading to next candidate...`
      );
    }
  }

  // If all models in the fallback chain failed
  throw new Error(
    lastError?.message ||
      `All AI models in the pool are temporarily unavailable. Please try again in a few moments.`
  );
}
