import { useState } from "react";
import { div } from "three/tsl";

const KeyMetricsSection = () => {
  const [actionItems, setActionItems] = useState(12);

  const data = [
    {
      title: "In transit",
      description: "Sample data across 8 hubs",
      value: "1,284",
    },
    {
      title: "On-time rate",
      description: "Rolling 7 days",
      value: "94.2%",
    },
    {
      title: "Delayed",
      description: `${actionItems} need action today`,
      value: "37",
    },
    {
      title: "Avg transit",
      description: `door to door`,
      value: "3.8 d",
    },
  ];
  return (
    <section>
      <div className="metric-section p-4">
        {data.map((item) => {
          return (
            <div className="card manrope">
              <p className="uppercase">{item.title}</p>
              <p className="text-3xl ml-2.5 manrope">{item.value}</p>
              <p className="text-[12px]">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default KeyMetricsSection;
