import type { ShipmentSummary, SummaryTone } from "../../lib/summary";

// Full class strings for Tailwind
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

const ShipmentSummaryCard = ({ summary }: { summary: ShipmentSummary }) => (
  <section
    aria-labelledby="summary-title"
    className={`rounded-xl border px-5 py-4.5 ${TONE_STYLES[summary.tone]}`}>
    <div className="mb-2 flex items-center justify-between gap-3">
      <h2
        id="summary-title"
        className="font-mono text-[11px] uppercase tracking-widest text-muted">
        Summary
      </h2>
      {/* Honest label until the LLM version exists */}
      <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
        Rule-based
      </span>
    </div>
    <p className="text-[15px] leading-relaxed">
      <strong className={`font-semibold ${HEADLINE_STYLES[summary.tone]}`}>
        {summary.headline}
      </strong>{" "}
      {summary.detail}
    </p>
  </section>
);

export default ShipmentSummaryCard;
