import type { Metric } from "../../data/metrics";

const KpiCard = (props: Metric) => {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-[10px] border border-line bg-panel px-5 py-4"
      key={props.label}>
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
        {props.label}
      </p>
      <p className="tont-display text-[34px] font-semibold">{props.value}</p>
      <p className="text-[13px] text-muted">{props.note}</p>
    </div>
  );
};
export default KpiCard;
