import { LEGEND_ITEMS } from "../../constants/global.constants";
import GlobeScene from "../../three/GlobeScene";

const GlobePanel = () => {
  return (
    <section className="relative flex-1 min-w-0 overflow-hidden rounded-[14px] border border-line bg-[#060a12]">
      <div className="absolute inset-0">
        <GlobeScene />
      </div>

      {/* Screen readers can't "see" the 3D canvas, so describe it */}
      <p className="sr-only">
        Interactive 3D globe showing active shipments moving between 8 logistics
        hubs. The same shipments are listed on the Shipments page.
      </p>

      <div className="pointer-events-none absolute left-5 top-4 flex flex-col gap-1">
        <h2 className="font-display text-lg font-semibold">Global network</h2>
        <p className="text-[13px] text-muted">
          Drag to rotate · scroll to zoom
        </p>
      </div>

      <ul className="pointer-events-none absolute bottom-4 left-5 flex flex-wrap gap-4 text-xs text-muted">
        {LEGEND_ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {/* the sample is decoration — the text label carries the meaning */}
            <span
              aria-hidden="true"
              className={`inline-block ${item.swatch}`}
            />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
};
export default GlobePanel;
