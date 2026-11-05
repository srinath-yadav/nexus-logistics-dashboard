import GlobePanel from "../components/overview/GlobePanel";
import KeyMetrics from "../components/overview/KeyMetrics";
import LiveEvents from "../components/overview/LiveEvents";

const Overview = () => {
  return (
    <section className="flex h-full gap-6 p-6">
      <KeyMetrics />
      <GlobePanel />
      <LiveEvents />
    </section>
  );
};

export default Overview;
