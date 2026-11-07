import { Link, useParams } from "react-router-dom";
import StatusChip from "../components/shipments/StatusChip";
import Timeline from "../components/shipments/Timeline";
import { HUBS_BY_CODE } from "../data/hubs";
import { SHIPMENTS } from "../data/shipments";
import { distanceKm } from "../lib/geo";
import { buildTimeline } from "../lib/timeline";
import RouteFocusScene from "../three/RouteFocusScene";
import ShipmentSummaryCard from "../components/shipments/ShipmentSummaryCard";
import { summarizeShipment } from "../lib/summary";

const etaFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const kmFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const ShipmentDetail = () => {
  const { id } = useParams();
  const shipment = SHIPMENTS.find((s) => s.id === id);
  const from = shipment && HUBS_BY_CODE[shipment.from];
  const to = shipment && HUBS_BY_CODE[shipment.to];

  // Unknown ID (or unknown hub) → a clear message, not a crash
  if (!shipment || !from || !to) {
    return (
      <section className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Shipment not found
        </h1>
        <p className="text-muted">
          No shipment with ID <span className="font-mono text-ink">{id}</span>.
        </p>
        <Link to="/shipments" className="text-live hover:underline">
          ← All shipments
        </Link>
      </section>
    );
  }

  const percent = Math.round(shipment.progress * 100);
  const remainingKm = distanceKm(from, to) * (1 - shipment.progress);
  const steps = buildTimeline(shipment, from.city, to.city);

  const stats = [
    { label: "Progress", value: `${percent}%` },
    { label: "Distance left", value: `${kmFormatter.format(remainingKm)} km` },
    { label: "Carrier", value: shipment.carrier },
    {
      label: "ETA",
      value:
        shipment.status === "delivered" ?
          "Delivered"
        : etaFormatter.format(new Date(shipment.eta)),
    },
  ];

  const summary = summarizeShipment(shipment, from, to, remainingKm);
  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <Link
          to="/shipments"
          className="self-start text-sm text-live hover:underline">
          ← All shipments
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-medium">{shipment.id}</h1>
          <StatusChip status={shipment.status} />
          <p className="text-muted">
            {from.city} → {to.city}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[10px] border border-line bg-panel px-4.5 py-3.5">
              <dt className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-xl font-semibold tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-5">
          <section
            aria-label="Route view"
            className="relative h-[460px] min-w-0 flex-[999_1_560px] overflow-hidden rounded-[14px] border border-line bg-[#060a12]">
            {/* key: a different shipment = a fresh scene with a fresh camera */}
            <RouteFocusScene key={shipment.id} shipment={shipment} />
            <p className="sr-only">
              3D view of the route from {from.city} to {to.city}, with the
              shipment {percent}% of the way.
            </p>
            <p className="pointer-events-none absolute right-4 top-3 font-mono text-[11px] text-muted">
              Drag to rotate · scroll to zoom
            </p>
          </section>

          <div className="flex flex-[1_1_320px] flex-col gap-5">
            <ShipmentSummaryCard summary={summary} />
            <section
              aria-labelledby="timeline-title"
              className="rounded-xl border border-line bg-panel px-5 py-4.5">
              <h2
                id="timeline-title"
                className="mb-4 font-display text-base font-semibold">
                Timeline
              </h2>
              <Timeline steps={steps} />
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShipmentDetail;
