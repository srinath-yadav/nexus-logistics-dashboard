import { STATUS_CHIP_STYLES, STATUS_LABELS } from "../../lib/status";
import type { ShipmentStatus } from "../../types/shipment.types";

const StatusChip = ({ status }: { status: ShipmentStatus }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CHIP_STYLES[status]}`}>
    {STATUS_LABELS[status]}
  </span>
);

export default StatusChip;
