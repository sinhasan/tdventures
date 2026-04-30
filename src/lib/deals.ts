export type Deal = {
  slug: string;
  name: string;
  tagline: string;
  sector: string;
  stage: "Pre-Seed" | "Seed" | "Series A" | "Series B";
  geography: string;
  raising: string;
  valuation: string;
  committed: number; // 0-100
  arr: string;
  growth: string;
  founded: string;
  team: number;
  highlights: string[];
  description: string;
  metrics: { label: string; value: string }[];
};

export const deals: Deal[] = [
  {
    slug: "nimbus-grid",
    name: "Nimbus Grid",
    tagline: "Edge compute infrastructure for AI inference at the network periphery.",
    sector: "Cloud Infra",
    stage: "Series A",
    geography: "San Francisco, US",
    raising: "$12M",
    valuation: "$72M post",
    committed: 64,
    arr: "$3.4M",
    growth: "22% MoM",
    founded: "2023",
    team: 18,
    highlights: ["Backed by Sequoia Scout", "ex-Cloudflare founders", "92% gross margin"],
    description:
      "Nimbus Grid operates a distributed inference network across 140+ edge locations, slashing AI latency by 8x for production workloads. Customers include three Fortune 500 retailers.",
    metrics: [
      { label: "ARR", value: "$3.4M" },
      { label: "Net Retention", value: "148%" },
      { label: "Burn Multiple", value: "0.6x" },
      { label: "Runway", value: "22 mo" },
    ],
  },
  {
    slug: "ledgerline",
    name: "Ledgerline",
    tagline: "Programmable settlement rails for cross-border B2B payments.",
    sector: "Fintech Infra",
    stage: "Seed",
    geography: "London, UK",
    raising: "$6M",
    valuation: "$30M post",
    committed: 41,
    arr: "$840K",
    growth: "31% MoM",
    founded: "2024",
    team: 9,
    highlights: ["FCA sandbox approved", "$240M in TPV processed", "Stripe alumni team"],
    description:
      "Ledgerline replaces legacy correspondent banking with a programmable settlement layer. Payments clear in under 30 seconds across 14 currencies at 1/10th the cost.",
    metrics: [
      { label: "TPV", value: "$240M" },
      { label: "Take Rate", value: "0.42%" },
      { label: "Customers", value: "180" },
      { label: "Runway", value: "18 mo" },
    ],
  },
  {
    slug: "kelp-systems",
    name: "Kelp Systems",
    tagline: "Open-source observability platform for distributed AI agents.",
    sector: "DevTools",
    stage: "Pre-Seed",
    geography: "Berlin, DE",
    raising: "$2.5M",
    valuation: "$14M post",
    committed: 78,
    arr: "$120K",
    growth: "Pre-revenue",
    founded: "2025",
    team: 4,
    highlights: ["12k GitHub stars", "Y Combinator W25", "OpenAI partnership"],
    description:
      "Kelp gives engineering teams full traceability into multi-agent LLM systems — token cost, tool calls, hallucination drift — through a single SDK and a stunning timeline UI.",
    metrics: [
      { label: "GH Stars", value: "12.1k" },
      { label: "Self-host orgs", value: "640" },
      { label: "Pilot ACVs", value: "$48k" },
      { label: "Runway", value: "14 mo" },
    ],
  },
  {
    slug: "harbor-os",
    name: "Harbor OS",
    tagline: "Kubernetes-native deployment platform for regulated industries.",
    sector: "Cloud Infra",
    stage: "Series A",
    geography: "New York, US",
    raising: "$18M",
    valuation: "$110M post",
    committed: 52,
    arr: "$5.1M",
    growth: "14% MoM",
    founded: "2022",
    team: 31,
    highlights: ["SOC 2 + HIPAA + FedRAMP", "3 of top 10 US banks", "$1.2M ACV"],
    description:
      "Harbor abstracts compliance plumbing for healthcare, finance, and defense. Teams ship to production in days instead of quarters, with audit trails baked into every deploy.",
    metrics: [
      { label: "ARR", value: "$5.1M" },
      { label: "ACV", value: "$1.2M" },
      { label: "Logo Retention", value: "98%" },
      { label: "Runway", value: "26 mo" },
    ],
  },
  {
    slug: "solstice-data",
    name: "Solstice Data",
    tagline: "Synthetic training data pipelines for vertical AI models.",
    sector: "AI Infra",
    stage: "Seed",
    geography: "Toronto, CA",
    raising: "$8M",
    valuation: "$42M post",
    committed: 33,
    arr: "$1.1M",
    growth: "26% MoM",
    founded: "2024",
    team: 12,
    highlights: ["Anthropic design partner", "Patent pending", "Ex-DeepMind founders"],
    description:
      "Solstice generates compliant, domain-specific training datasets that outperform real data on accuracy benchmarks — critical for healthcare, legal, and financial AI.",
    metrics: [
      { label: "ARR", value: "$1.1M" },
      { label: "Datasets shipped", value: "240" },
      { label: "NPS", value: "72" },
      { label: "Runway", value: "20 mo" },
    ],
  },
  {
    slug: "meridian-flow",
    name: "Meridian Flow",
    tagline: "Workflow orchestration for high-throughput data engineering teams.",
    sector: "DevTools",
    stage: "Series B",
    geography: "Austin, US",
    raising: "$32M",
    valuation: "$280M post",
    committed: 88,
    arr: "$14.2M",
    growth: "9% MoM",
    founded: "2021",
    team: 64,
    highlights: ["Profitable in Q2", "Snowflake integration", "1,400 customers"],
    description:
      "Meridian replaces Airflow for the modern data stack — declarative pipelines, instant rollback, and SLAs measured in seconds. The de-facto standard at data-first companies.",
    metrics: [
      { label: "ARR", value: "$14.2M" },
      { label: "NRR", value: "131%" },
      { label: "Gross Margin", value: "84%" },
      { label: "Runway", value: "Profitable" },
    ],
  },
];

export const getDeal = (slug: string) => deals.find((d) => d.slug === slug);
