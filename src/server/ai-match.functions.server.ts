import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { investors, type Investor } from "@/lib/platform-data";

const inputSchema = z.object({
  sector: z.string().trim().min(1).max(60),
  stage: z.string().trim().min(1).max(40),
  fundingAsk: z.number().int().min(10).max(500_000), // in $K, so $10K to $500M
  geography: z.string().trim().min(1).max(60),
});

export type MatchResult = {
  investorId: string;
  score: number; // 0-100
  reasons: string[]; // 2-4 short bullets
};

export type MatchResponse = {
  results: Array<MatchResult & { investor: Investor }>;
  generatedAt: string;
};

export const aiMatchInvestors = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<MatchResponse> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Pre-filter to a manageable shortlist before sending to the AI.
    // Score by overlap with the requested sector/stage/geo, then keep the top 60.
    const wantSector = data.sector.toLowerCase();
    const wantStage = data.stage.toLowerCase();
    const wantGeo = data.geography.toLowerCase();
    const shortlist = investors
      .map((i) => {
        let s = 0;
        if (i.sectors.some((x) => x.toLowerCase().includes(wantSector))) s += 3;
        if (i.industry?.toLowerCase().includes(wantSector)) s += 2;
        if (i.keywords?.toLowerCase().includes(wantSector)) s += 1;
        if (i.stages.some((x) => x.toLowerCase() === wantStage)) s += 2;
        if (
          i.city?.toLowerCase() === wantGeo ||
          i.country?.toLowerCase() === wantGeo ||
          i.region.toLowerCase() === wantGeo
        ) s += 2;
        if (data.fundingAsk >= i.ticketMin && data.fundingAsk <= i.ticketMax * 2) s += 1;
        return { i, s };
      })
      .sort((a, b) => b.s - a.s)
      .slice(0, 60)
      .map(({ i }) => i);

    const catalog = shortlist.map((i) => ({
      id: i.id,
      name: i.name,
      firm: i.firm,
      type: i.type,
      stages: i.stages,
      sectors: i.sectors.slice(0, 4),
      geography: i.geography,
      ticketRangeK: [i.ticketMin, i.ticketMax],
      portfolioCount: i.portfolio,
      responseRate: i.responseRate,
      notable: i.notable,
    }));

    const systemPrompt = `You are an expert venture capital analyst at Atlas, a startup-investor matching platform.
Your job: rank investors against a startup's fundraise criteria and explain WHY each match works.
Be sharp, specific, and quantitative. Avoid generic statements.
Score 0-100 based on: sector alignment, stage fit, ticket size overlap with the ask, geography proximity, and response rate.
Only include investors with a meaningful match (score >= 50). Return at most 8.`;

    const userPrompt = `Startup criteria:
- Sector: ${data.sector}
- Stage: ${data.stage}
- Funding ask: $${data.fundingAsk}K
- Geography: ${data.geography}

Investor catalog:
${JSON.stringify(catalog, null, 2)}

Return ranked matches.`;

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
              name: "submit_matches",
              description: "Submit ranked investor matches with scores and reasoning.",
              parameters: {
                type: "object",
                properties: {
                  matches: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        investorId: { type: "string", description: "ID from the catalog (e.g. i-001)" },
                        score: { type: "number", description: "0-100 match score" },
                        reasons: {
                          type: "array",
                          items: { type: "string" },
                          description: "2-4 short, specific reasons (e.g. 'Sector match: AI Infra', 'Ticket fits ask: $500K-$3M')",
                        },
                      },
                      required: ["investorId", "score", "reasons"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["matches"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_matches" } },
      }),
    });

    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    if (response.status === 402) {
      throw new Error("AI credits exhausted. Add credits in workspace settings.");
    }
    if (!response.ok) {
      const txt = await response.text();
      console.error("AI gateway error", response.status, txt);
      throw new Error("AI service unavailable. Please try again.");
    }

    const json = await response.json();
    const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("AI returned no matches");
    }

    let parsed: { matches: MatchResult[] };
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("AI returned malformed response");
    }

    const byId = new Map(investors.map((i) => [i.id, i] as const));
    const results = parsed.matches
      .filter((m) => byId.has(m.investorId))
      .map((m) => ({
        investorId: m.investorId,
        score: Math.max(0, Math.min(100, Math.round(m.score))),
        reasons: (m.reasons ?? []).slice(0, 4).map((r) => String(r).slice(0, 140)),
        investor: byId.get(m.investorId)!,
      }))
      .sort((a, b) => b.score - a.score);

    return { results, generatedAt: new Date().toISOString() };
  });
