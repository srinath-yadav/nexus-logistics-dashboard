import { Link } from "react-router-dom";
import { EVENTS } from "../../data/events";
import { EVENT_LEVEL_STYLES } from "../../lib/status";

const LiveEvents = () => {
  return (
    <section
      aria-labelledby="live-events-title"
      className="flex w-80 shrink-0 flex-col overflow-hidden rounded-[10px] border border-line bg-panel">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-4.5 py-4">
        <h2
          id="live-events-title"
          className="font-display text-base font-semibold">
          Live events
        </h2>
        <span className="font-mono text-[11px] tracking-widest text-muted">
          LAST 30 MIN
        </span>
      </div>

      {/* List: scrolls inside the panel, not the page */}
      <ol className="min-h-0 flex-1 overflow-y-auto">
        {EVENTS.map((event) => {
          const style = EVENT_LEVEL_STYLES[event.level];
          return (
            <li
              key={event.id}
              className="border-b border-line/60 last:border-b-0">
              <Link
                to={`/shipments/${event.shipmentId}`}
                className="flex gap-3 px-4.5 py-3.5 hover:bg-raised focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-live">
                {/* coloured severity bar (decoration) */}
                <span
                  aria-hidden="true"
                  className={`w-1 shrink-0 rounded-full ${style.bar}`}
                />

                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-mono text-xs text-muted">
                    {event.time} · {event.shipmentId}
                  </span>
                  <span className="text-sm">
                    {/* spoken, not shown: gives the colour a meaning */}
                    <span className="sr-only">{style.label}: </span>
                    {event.text}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default LiveEvents;
