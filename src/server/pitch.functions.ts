import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  text: z.string().trim().min(40, "Please paste at least 40 characters of pitch content").max(20_000),
});

export type PitchSection = {
  title: string;          // e.g. "Problem", "Solution", "Market"
  improved: string;       // rewritten content for this section (markdown)
  rationale: string;      // why the rewrite is stronger
};

export type WeakSection = {
  excerpt: string;        // short snippet from the original
  issue: string;          // what's weak
  fix: string;            // concrete fix
};

export type MissingSlide = {
  slide: string;          // e.g. "Go-to-market", "Competitive landscape"
  why: string;            // why investors expect this
  prompt: string;         // a starter sentence the founder can fill in
};

export type PitchResponse = {
  summary: string;          // 1-2 line headline of the rewrite
  improvedMarkdown: string; // full improved deck in markdown
  sections: PitchSection[]; // structured rewrites
  weakSections: WeakSection[];
  missingSlides: MissingSlide[];
  generatedAt: string;
};

export const polishPitch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<PitchResponse> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a senior pitch coach at Atlas, advising founders raising from top-tier VCs.
You rewrite pitch decks for clarity, narrative flow, and quantitative sharpness.
Style: punchy, specific, numbers-forward, no fluff. Cut hype words. Keep founder's voice.
Always structure the improved deck with clear slide headings (## Slide Name) in markdown.`;

    const userPrompt = `Improve the following pitch content. Then identify weak sections and suggest missing slides investors expect.

Original pitch content:
"""
${data.text}
"""`;

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
              name: "submit_polish",
              description: "Submit improved pitch with structured analysis.",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "1-2 sentence headline of what was improved" },
                  improvedMarkdown: {
                    type: "string",
                    description: "Full improved deck as markdown. Use '## Slide Name' for each slide heading.",
                  },
                  sections: {
                    type: "array",
                    description: "Per-slide rewrites with rationale (3-8 items)",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        improved: { type: "string", description: "Improved content for this slide (markdown)" },
                        rationale: { type: "string", description: "Why this rewrite is stronger" },
                      },
                      required: ["title", "improved", "rationale"],
                      additionalProperties: false,
                    },
                  },
                  weakSections: {
                    type: "array",
                    description: "2-5 weak parts from the original with concrete fixes",
                    items: {
                      type: "object",
                      properties: {
                        excerpt: { type: "string", description: "Short snippet from the original (max 160 chars)" },
                        issue: { type: "string" },
                        fix: { type: "string" },
                      },
                      required: ["excerpt", "issue", "fix"],
                      additionalProperties: false,
                    },
                  },
                  missingSlides: {
                    type: "array",
                    description: "2-5 slides investors will expect that are missing",
                    items: {
                      type: "object",
                      properties: {
                        slide: { type: "string" },
                        why: { type: "string" },
                        prompt: { type: "string", description: "A starter sentence the founder can fill in" },
                      },
                      required: ["slide", "why", "prompt"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["summary", "improvedMarkdown", "sections", "weakSections", "missingSlides"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_polish" } },
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

    let parsed: Omit<PitchResponse, "generatedAt">;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("AI returned malformed response");
    }

    return {
      summary: String(parsed.summary ?? "").slice(0, 280),
      improvedMarkdown: String(parsed.improvedMarkdown ?? "").slice(0, 30_000),
      sections: (parsed.sections ?? []).slice(0, 10).map((s) => ({
        title: String(s.title ?? "").slice(0, 80),
        improved: String(s.improved ?? "").slice(0, 4000),
        rationale: String(s.rationale ?? "").slice(0, 400),
      })),
      weakSections: (parsed.weakSections ?? []).slice(0, 6).map((w) => ({
        excerpt: String(w.excerpt ?? "").slice(0, 200),
        issue: String(w.issue ?? "").slice(0, 280),
        fix: String(w.fix ?? "").slice(0, 280),
      })),
      missingSlides: (parsed.missingSlides ?? []).slice(0, 6).map((m) => ({
        slide: String(m.slide ?? "").slice(0, 60),
        why: String(m.why ?? "").slice(0, 240),
        prompt: String(m.prompt ?? "").slice(0, 240),
      })),
      generatedAt: new Date().toISOString(),
    };
  });
