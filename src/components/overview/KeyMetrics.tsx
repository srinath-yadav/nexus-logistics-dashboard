import { METRICS_DATA, type Metric } from "../../data/metrics";
import KpiCard from "./KpiCard";

const KeyMetrics = () => {
  return (
    <div className="w-75 shrink-0 flex flex-col gap-3.5">
      {METRICS_DATA.map((item: Metric) => {
        return <KpiCard key={item.label} {...item} />;
      })}
    </div>
  );
};

export default KeyMetrics;
