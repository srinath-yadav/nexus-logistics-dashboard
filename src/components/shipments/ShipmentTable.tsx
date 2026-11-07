import { Link } from "react-router-dom";
import { HUBS_BY_CODE } from "../../data/hubs";
import { STATUS_BAR_STYLES } from "../../lib/status";
import type { Shipment } from "../../types/shipment.types";
import StatusChip from "./StatusChip";

// "2026-11-12" → "12 Nov"
const etaFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
});

const COLUMNS = ["ID", "Route", "Carrier", "Progress", "ETA", "Status"];

const ShipmentTable = ({ shipments }: { shipments: Shipment[] }) => (
  // Wide tables scroll sideways inside their own box, never the page
  <div className="overflow-x-auto rounded-xl border border-line bg-panel">
    <table className="w-full min-w-[860px] border-collapse text-sm">
      <caption className="sr-only">
        Shipments, with route, progress and status
      </caption>
      <thead>
        <tr className="text-left font-mono text-[11px] tracking-widest text-muted">
          {COLUMNS.map((column) => (
            <th
              key={column}
              scope="col"
              className="px-4.5 py-3.5 font-medium uppercase">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {shipments.map((shipment) => {
          const percent = Math.round(shipment.progress * 100);
          return (
            <tr
              key={shipment.id}
              className="border-t border-line/60 hover:bg-raised/50">
              <td className="px-4.5 py-3.5 font-mono">
                <Link
                  to={`/shipments/${shipment.id}`}
                  className="text-live hover:underline">
                  {shipment.id}
                </Link>
              </td>
              <td className="px-4.5 py-3.5">
                {HUBS_BY_CODE[shipment.from]?.city ?? shipment.from}
                <span className="text-muted"> → </span>
                {HUBS_BY_CODE[shipment.to]?.city ?? shipment.to}
              </td>
              <td className="px-4.5 py-3.5 text-muted">{shipment.carrier}</td>
              <td className="px-4.5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${shipment.id} progress`}
                    className="h-1.5 w-32 overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full ${STATUS_BAR_STYLES[shipment.status]}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted tabular-nums">
                    {percent}%
                  </span>
                </div>
              </td>
              <td className="px-4.5 py-3.5 font-mono text-muted tabular-nums">
                {shipment.status === "delivered" ?
                  "Delivered"
                : etaFormatter.format(new Date(shipment.eta))}
              </td>
              <td className="px-4.5 py-3.5">
                <StatusChip status={shipment.status} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default ShipmentTable;
