import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  traction: z.number().min(0).max(100), // 0-100 normalized (revenue/users)
  team: z.number().min(0).max(100),
  market: z.number().min(0).max(100),
  product: z.string().trim().min(1).max(40), // idea/prototype/mvp/beta/launched/scaling
  deck: z.number().min(0).max(100),
  sector: z.string().trim().min(1).max(60),
  stage: z.string().trim().min(1).max(40),
});

export type ReadinessInput = z.infer<typeof inputSchema>;

export type ReadinessSuggestion = {
  area: string; // e.g. "Traction", "Pitch deck"
  priority: "high" | "medium" | "low";
  suggestion: string;
};

export type ReadinessResponse = {
  score: number; // 0-100
  verdict: string; // 1-line summary
  strengths: string[];
  weaknesses: string[];
  suggestions: ReadinessSuggestion[];
  generatedAt: string;
};

const productWeights: Record<string, number> = {
  idea: 10,
  prototype: 30,
  mvp: 55,
  beta: 75,
  launched: 90,
  scaling: 100,
};

function computeScore(d: ReadinessInput): number {
  const productScore = productWeights[d.product.toLowerCase()] ?? 50;
  // Weights: traction 30, team 20, market 15, product 20, deck 15
  const raw =
    d.traction * 0.30 +
    d.team * 0.20 +
    d.market * 0.15 +
    productScore * 0.20 +
    d.deck * 0.15;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

export const scoreReadiness = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<ReadinessResponse> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const score = computeScore(data);

    const systemPrompt = `You are a senior fundraising advisor at Atlas. Given a startup's self-assessed signals across traction, team, market, product stage, and pitch deck quality, identify concrete strengths, weaknesses, and ACTIONABLE suggestions to raise the readiness score before approaching investors. Be specific, quantitative, and avoid generic advice. Reference the inputs directly.`;

    const userPrompt = `Computed readiness score: ${score}/100.

Inputs (0-100 unless noted):
- Sector: ${data.sector}
- Stage: ${data.stage}
- Traction (revenue/users signal): ${data.traction}
- Team experience: ${data.team}
- Market size: ${data.market}
- Product stage: ${data.product}
- Pitch deck quality: ${data.deck}

Return strengths, weaknesses, and 3-5 prioritized suggestions.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_readiness",
              description: "Submit fundraising readiness analysis.",
              parameters: {
                type: "object",
                properties: {
                  verdict: { type: "string", description: "One sentence summary of overall readiness" },
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-4 specific strengths",
                  },
                  weaknesses: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-4 specific weaknesses",
                  },
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        area: { type: "string" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        suggestion: { type: "string", description: "Concrete action to improve the score" },
                      },
                      required: ["area", "priority", "suggestion"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["verdict", "strengths", "weaknesses", "suggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_readiness" } },
      }),
    });

    if (response.status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
    if (response.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    if (!response.ok) {
      const txt = await response.text();
      console.error("AI gateway error", response.status, txt);
      throw new Error("AI service unavailable. Please try again.");
    }

    const json = await response.json();
    const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) throw new Error("AI returned no analysis");

    let parsed: Omit<ReadinessResponse, "score" | "generatedAt">;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("AI returned malformed response");
    }

    return {
      score,
      verdict: String(parsed.verdict ?? "").slice(0, 240),
      strengths: (parsed.strengths ?? []).slice(0, 4).map((s) => String(s).slice(0, 200)),
      weaknesses: (parsed.weaknesses ?? []).slice(0, 4).map((s) => String(s).slice(0, 200)),
      suggestions: (parsed.suggestions ?? []).slice(0, 5).map((s) => ({
        area: String(s.area ?? "").slice(0, 40),
        priority: (["high", "medium", "low"].includes(s.priority) ? s.priority : "medium") as "high" | "medium" | "low",
        suggestion: String(s.suggestion ?? "").slice(0, 280),
      })),
      generatedAt: new Date().toISOString(),
    };
  });
