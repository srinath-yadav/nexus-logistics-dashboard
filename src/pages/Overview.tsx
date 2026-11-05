import GlobeSection from "../components/overview/GlobePanel";
import KeyMetricsSection from "../components/overview/KeyMetrics";
import LiveEventsSection from "../components/overview/LiveEvents";

const Overview = () => {
  return (
    <section className="manrope flex h-full">
      <KeyMetricsSection />
      <GlobeSection />
      <LiveEventsSection />
    </section>
  );
};

export default Overview;
