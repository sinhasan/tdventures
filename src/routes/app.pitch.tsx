import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, Copy, Check, Download, AlertTriangle, AlertCircle, Plus, FileText, Wand2, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
const pitchFunction = async (input: any) => {
  return { result: "ok" };
};

export const Route = createFileRoute("/app/pitch")({
  head: () => ({ meta: [{ title: "Pitch Polish — Atlas Intelligence" }] }),
  component: PitchPage,
});

const SAMPLE = `Problem: Founders waste weeks finding investors. The current process is broken and inefficient.

Solution: Atlas is an AI-powered platform that helps you raise.

Market: Huge market, growing fast.

Traction: We have users and good engagement.

Team: Experienced founders.

Ask: Raising a round.`;

function PitchPage() {
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<PitchResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const charCount = input.trim().length;

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await polishPitch({ data: { text: input } });
      setResponse(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to polish pitch");
    } finally {
      setRunning(false);
    }
  };

  const copy = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response.improvedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    if (!response) return;
    const blob = new Blob([response.improvedMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atlas-pitch-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell
      title="Pitch Polish"
      subtitle="Paste your deck or summary. Atlas rewrites it for clarity, flags weak spots, and surfaces missing slides."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInput(SAMPLE)}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs hover:bg-surface/70"
          >
            <FileText className="h-3.5 w-3.5" /> Load sample
          </button>
          <button
            onClick={run}
            disabled={running || charCount < 40}
            className="inline-flex items-center gap-2 rounded-md bg-lime px-4 py-2 text-sm font-medium text-lime-foreground hover:bg-lime/90 disabled:opacity-50"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {running ? "Polishing…" : response ? "Re-polish" : "Polish pitch"}
          </button>
        </div>
      }
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT — input */}
        <section className="rounded-lg border border-border bg-surface/30 flex flex-col min-h-[640px]">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg leading-none">Original</h2>
              <p className="text-[11px] text-muted-foreground mt-1">Paste your pitch deck text, summary, or notes.</p>
            </div>
            <span className={`font-mono text-[10px] uppercase tracking-wider ${charCount < 40 ? "text-muted-foreground" : "text-lime"}`}>
              {charCount} chars
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Problem: …&#10;Solution: …&#10;Market: …&#10;Traction: …&#10;Team: …&#10;Ask: …"
            className="flex-1 w-full bg-transparent p-5 text-sm leading-relaxed font-mono resize-none focus:outline-none placeholder:text-muted-foreground/50"
          />

          {/* Weak sections overlay (after analysis) */}
          {response && response.weakSections.length > 0 && (
            <div className="border-t border-border p-4 space-y-2 max-h-72 overflow-y-auto">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <AlertTriangle className="h-3.5 w-3.5" /> Weak sections detected
              </div>
              {response.weakSections.map((w, i) => (
                <div key={i} className="rounded-md border border-amber-400/30 bg-amber-400/5 p-3 text-xs">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400/80 mb-1">Excerpt</div>
                  <div className="italic text-foreground/90 mb-2">"{w.excerpt}"</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Issue</div>
                      <div>{w.issue}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-lime mb-0.5">Fix</div>
                      <div>{w.fix}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT — output */}
        <section className="rounded-lg border border-border bg-surface/30 flex flex-col min-h-[640px]">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg leading-none flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-lime" /> Improved
              </h2>
              <p className="text-[11px] text-muted-foreground mt-1">
                {response ? response.summary : "Run the polisher to see the rewritten deck."}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copy}
                disabled={!response}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface/70 disabled:opacity-50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-lime" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={download}
                disabled={!response}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface/70 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" /> .md
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!response && !running && !error && <EmptyState />}
            {running && <LoadingState />}
            {error && (
              <div className="m-5 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm flex gap-2">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-destructive">Polish failed</div>
                  <div className="text-muted-foreground mt-0.5">{error}</div>
                  <button onClick={run} className="mt-2 inline-flex items-center gap-1.5 text-xs text-foreground hover:text-lime">
                    <RefreshCw className="h-3 w-3" /> Try again
                  </button>
                </div>
              </div>
            )}
            {response && (
              <div className="p-5 space-y-5">
                <MarkdownLite text={response.improvedMarkdown} />

                {response.sections.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground pt-2 border-t border-border">
                      Why these rewrites work
                    </div>
                    {response.sections.map((s, i) => (
                      <details key={i} className="group rounded-md border border-border bg-surface/40">
                        <summary className="cursor-pointer list-none px-3 py-2 text-xs flex items-center justify-between hover:bg-surface/70">
                          <span className="font-medium">{s.title}</span>
                          <span className="text-muted-foreground group-open:rotate-90 transition-transform">›</span>
                        </summary>
                        <div className="px-3 pb-3 pt-1 text-xs text-muted-foreground leading-relaxed">{s.rationale}</div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Missing slides — full width below */}
      {response && response.missingSlides.length > 0 && (
        <section className="mt-6 rounded-lg border border-border bg-surface/30 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Plus className="h-4 w-4 text-lime" />
            <h2 className="font-display text-lg">Missing slides investors will ask for</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Add these to round out the narrative. Each one comes with a starter sentence.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {response.missingSlides.map((m, i) => (
              <div key={i} className="rounded-md border border-border bg-surface/60 p-4">
                <div className="font-display text-base">{m.slide}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.why}</div>
                <div className="mt-3 text-xs italic border-l-2 border-lime/60 pl-2 text-foreground/90">
                  "{m.prompt}"
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="h-full min-h-[480px] grid place-items-center p-8 text-center">
      <div>
        <div className="mx-auto h-12 w-12 rounded-full bg-lime/10 grid place-items-center mb-4">
          <Wand2 className="h-5 w-5 text-lime" />
        </div>
        <div className="font-display text-xl">Your improved deck appears here</div>
        <div className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          Paste pitch content on the left and click <span className="text-foreground">Polish pitch</span>. Atlas rewrites for clarity, flags weak spots, and surfaces missing slides.
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-5 space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-3 rounded bg-surface animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
      ))}
    </div>
  );
}

/* Lightweight markdown renderer for the improved output (headings + paragraphs + lists + bold). */
function MarkdownLite({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuf: string[] = [];

  const flushList = () => {
    if (listBuf.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="list-disc pl-5 space-y-1 text-sm text-foreground/90">
          {listBuf.map((li, i) => <li key={i}><Inline text={li} /></li>)}
        </ul>
      );
      listBuf = [];
    }
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (/^\s*[-*]\s+/.test(line)) {
      listBuf.push(line.replace(/^\s*[-*]\s+/, ""));
      return;
    }
    flushList();
    if (/^#{3,}\s+/.test(line)) {
      blocks.push(<h4 key={i} className="font-display text-base mt-4">{line.replace(/^#{3,}\s+/, "")}</h4>);
    } else if (/^##\s+/.test(line)) {
      blocks.push(
        <h3 key={i} className="font-display text-xl mt-5 pb-1 border-b border-border">
          {line.replace(/^##\s+/, "")}
        </h3>
      );
    } else if (/^#\s+/.test(line)) {
      blocks.push(<h2 key={i} className="font-display text-2xl mt-5">{line.replace(/^#\s+/, "")}</h2>);
    } else if (line.trim() === "") {
      blocks.push(<div key={i} className="h-1" />);
    } else {
      blocks.push(<p key={i} className="text-sm leading-relaxed text-foreground/90"><Inline text={line} /></p>);
    }
  });
  flushList();
  return <div className="space-y-1.5">{blocks}</div>;
}

function Inline({ text }: { text: string }) {
  // Render **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (/^\*[^*]+\*$/.test(p)) return <em key={i}>{p.slice(1, -1)}</em>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
