import type { SummaryResponse, SummaryTone } from "../../lib/summary";

const TONE_STYLES: Record<SummaryTone, string> = {
  good: "border-delivered/40 bg-delivered/5",
  watch: "border-delayed/40 bg-delayed/5",
  action: "border-exception/40 bg-exception/5",
};

const HEADLINE_STYLES: Record<SummaryTone, string> = {
  good: "text-delivered",
  watch: "text-delayed",
  action: "text-exception",
};

type Props = { summary: SummaryResponse; loading: boolean };

const ShipmentSummaryCard = ({ summary, loading }: Props) => {
  const badge =
    loading ? "Writing AI summary…"
    : summary.source === "ai" ? "AI · Llama 3.1"
    : "Rule-based";

  return (
    <section
      aria-labelledby="summary-title"
      aria-busy={loading}
      className={`rounded-xl border px-5 py-4.5 ${TONE_STYLES[summary.tone]}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2
          id="summary-title"
          className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Summary
        </h2>
        <span
          className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
            summary.source === "ai" && !loading ?
              "border-live/50 text-live"
            : "border-line text-muted"
          } ${loading ? "animate-pulse" : ""}`}>
          {badge}
        </span>
      </div>
      {/* aria-live: screen readers announce the text when the AI version swaps in */}
      <p aria-live="polite" className="text-[15px] leading-relaxed">
        <strong className={`font-semibold ${HEADLINE_STYLES[summary.tone]}`}>
          {summary.headline}
        </strong>{" "}
        {summary.detail}
      </p>
    </section>
  );
};

export default ShipmentSummaryCard;
