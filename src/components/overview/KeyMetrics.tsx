import { METRICS_DATA } from "../../data/metrics";
import KpiCard from "./KpiCard";

const KeyMetrics = () => {
  return (
    <section
      aria-label="Key metrics"
      className="w-75 shrink-0 flex flex-col gap-3.5">
      {METRICS_DATA.map((item) => {
        return <KpiCard key={item.label} {...item} />;
      })}
    </section>
  );
};

export default KeyMetrics;
