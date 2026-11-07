import HubCard from "../components/fleet/HubCard";
import { HUBS } from "../data/hubs";
import FleetScene from "../three/FleetScene";

// Calculated once, from the data
const TOTAL_VEHICLES = HUBS.reduce((sum, hub) => sum + hub.vehicles, 0);

const Fleet = () => (
  <section className="h-full overflow-y-auto p-6">
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <div>
        <h1 className="font-display text-3xl font-semibold">
          Fleet &amp; hubs
        </h1>
        <p className="text-sm text-muted">
          {HUBS.length} hubs · {TOTAL_VEHICLES} vehicles · sample data
        </p>
      </div>

      <section
        aria-label="Hub load in 3D"
        className="relative h-[360px] overflow-hidden rounded-[14px] border border-line bg-[#060a12]">
        <FleetScene />
        <p className="sr-only">
          3D bar chart of hub load. Mumbai and Dubai are above 85% capacity.
          Exact values are in the cards below.
        </p>
        <p className="pointer-events-none absolute right-4 top-3 font-mono text-[11px] text-muted">
          Drag to orbit · hover a tower
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HUBS.map((hub) => (
          <HubCard key={hub.code} hub={hub} />
        ))}
      </div>
    </div>
  </section>
);

export default Fleet;
