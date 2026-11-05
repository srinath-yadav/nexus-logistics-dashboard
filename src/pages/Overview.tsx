import GlobePanel from "../components/overview/GlobePanel";
import KeyMetrics from "../components/overview/KeyMetrics";
import LiveEvents from "../components/overview/LiveEvents";

const Overview = () => {
  return (
    <section className="manrope flex h-full">
      <KeyMetrics />
      <GlobePanel />
      <LiveEvents />
    </section>
  );
};

export default Overview;
