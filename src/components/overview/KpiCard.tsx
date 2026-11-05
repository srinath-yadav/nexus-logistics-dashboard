import type { Metric } from "../../data/metrics";

const KpiCard = ({ label, value, note }: Metric) => {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-[10px] border border-line bg-panel px-5 py-4"
      key={label}>
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
        {label}
      </p>
      <p className="font-display text-[34px] font-semibold">{value}</p>
      <p className="text-[13px] text-muted">{note}</p>
    </div>
  );
};
export default KpiCard;
