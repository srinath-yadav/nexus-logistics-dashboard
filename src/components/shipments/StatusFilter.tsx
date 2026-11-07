import type { ShipmentStatus } from "../../types/shipment.types";

export type StatusFilterValue = ShipmentStatus | "all";

type Props = {
  value: StatusFilterValue;
  counts: Record<StatusFilterValue, number>;
  onChange: (value: StatusFilterValue) => void;
};

const OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in_transit", label: "In transit" },
  { value: "delayed", label: "Delayed" },
  { value: "exception", label: "Exceptions" },
  { value: "delivered", label: "Delivered" },
];

const StatusFilter = ({ value, counts, onChange }: Props) => (
  <div
    role="group"
    aria-label="Filter by status"
    className="flex flex-wrap gap-2">
    {OPTIONS.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          aria-pressed={active}
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-live ${
            active ?
              "border-live bg-raised text-ink"
            : "border-line text-muted hover:text-ink"
          }`}>
          {option.label}
          <span className="font-mono text-xs text-muted">
            {counts[option.value]}
          </span>
        </button>
      );
    })}
  </div>
);

export default StatusFilter;
