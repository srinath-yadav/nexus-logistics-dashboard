import { useMemo, useState } from "react";
import ShipmentTable from "../components/shipments/ShipmentTable";
import StatusFilter, {
  type StatusFilterValue,
} from "../components/shipments/StatusFilter";
import { HUBS_BY_CODE } from "../data/hubs";
import { SHIPMENTS } from "../data/shipments";

const Shipments = () => {
  // Only what the user CHOSE lives in state
  const [status, setStatus] = useState<StatusFilterValue>("all");
  const [query, setQuery] = useState("");

  // Counts per status — calculated, not stored
  const counts = useMemo(() => {
    const result: Record<StatusFilterValue, number> = {
      all: SHIPMENTS.length,
      in_transit: 0,
      delayed: 0,
      exception: 0,
      delivered: 0,
    };
    SHIPMENTS.forEach((shipment) => result[shipment.status]++);
    return result;
  }, []);

  // The rows to show — calculated from status + query
  const visible = useMemo(() => {
    const search = query.trim().toLowerCase();
    return SHIPMENTS.filter((shipment) => {
      if (status !== "all" && shipment.status !== status) return false;
      if (!search) return true;
      const text = [
        shipment.id,
        shipment.carrier,
        HUBS_BY_CODE[shipment.from]?.city,
        HUBS_BY_CODE[shipment.to]?.city,
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(search);
    });
  }, [status, query]);

  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold">Shipments</h1>
            <p className="text-sm text-muted">
              {SHIPMENTS.length} shipments · sample data
            </p>
          </div>
          <div>
            <label htmlFor="shipment-filter" className="sr-only">
              Filter shipments
            </label>
            <input
              id="shipment-filter"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by ID, city or carrier"
              className="w-72 max-w-full rounded-lg border border-line bg-field px-3.5 py-2 text-sm text-ink placeholder:text-muted focus:border-live focus:outline-none"
            />
          </div>
        </div>

        <StatusFilter value={status} counts={counts} onChange={setStatus} />

        {visible.length > 0 ?
          <ShipmentTable shipments={visible} />
        : <p className="rounded-xl border border-dashed border-line px-6 py-10 text-center text-muted">
            No shipments match these filters.
          </p>
        }
      </div>
    </section>
  );
};

export default Shipments;
