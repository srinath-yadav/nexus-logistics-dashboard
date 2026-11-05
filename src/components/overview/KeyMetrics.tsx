import { METRICS_DATA } from "../../constants/global.constants";

const KeyMetrics = () => {
  return (
    <section>
      <div className="metric-section p-4">
        {METRICS_DATA.map((item) => {
          return (
            <div className="card" key={item.title}>
              <p className="uppercase">{item.title}</p>
              <p className="text-3xl ml-2.5">{item.value}</p>
              <p className="text-[12px]">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default KeyMetrics;
