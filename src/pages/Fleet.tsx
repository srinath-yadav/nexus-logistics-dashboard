import HubCard from "../components/fleet/HubCard";
import { HUBS } from "../data/hubs";

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

      {/* the 3D towers go here in Step 3 */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HUBS.map((hub) => (
          <HubCard key={hub.code} hub={hub} />
        ))}
      </div>
    </div>
  </section>
);

export default Fleet;
