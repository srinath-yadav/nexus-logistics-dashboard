import { METRICS_DATA } from "../../data/metrics";

const KeyMetrics = () => {
  return (
    <section>
      <div className="metric-section p-4 w-75 shrink-0">
        {METRICS_DATA.map((item) => {
          return (
            <div className="card" key={item.label}>
              <p className="uppercase">{item.label}</p>
              <p className="text-3xl ml-2.5">{item.value}</p>
              <p className="text-[12px]">{item.note}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default KeyMetrics;
