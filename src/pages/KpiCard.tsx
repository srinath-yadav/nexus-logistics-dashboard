import GlobeSection from "../components/GlobeSection";
import KeyMetricsSection from "../components/KeyMetricsSection";
import LiveEventsSection from "../components/LiveEventsSection";

const KpiCard = () => {
  return (
    <div className="kpi-section flex">
      <KeyMetricsSection />
      <GlobeSection />
      <LiveEventsSection />
    </div>
  );
};

export default KpiCard;
