import { isHighLoad } from "../../lib/hubLoad";
import type { Hub } from "../../types/hub.types";

const HubCard = ({ hub }: { hub: Hub }) => {
  const percent = Math.round(hub.capacityUsed * 100);
  const atRisk = isHighLoad(hub);

  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-[10px] border border-line bg-panel px-4.5 py-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold">{hub.city}</h3>
        <span className="font-mono text-xs text-muted">{hub.code}</span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${hub.city} capacity used`}
        className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full ${atRisk ? "bg-delayed" : "bg-transit"}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[13px] text-muted">
        <span>
          Capacity used{" "}
          <span className="font-mono text-ink tabular-nums">{percent}%</span>
        </span>
        <span className="tabular-nums">{hub.vehicles} vehicles</span>
      </div>

      {/* Colour + a word, never colour alone */}
      {atRisk && (
        <span className="self-start rounded-full border border-delayed/40 bg-delayed/10 px-2.5 py-0.5 text-xs font-semibold text-delayed">
          At risk of congestion
        </span>
      )}
    </article>
  );
};

export default HubCard;
