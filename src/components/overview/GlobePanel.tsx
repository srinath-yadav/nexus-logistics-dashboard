import GlobeScene from "../../three/GlobeScene";

const GlobePanel = () => {
  return (
    <section className="relative flex-1 min-w-0 overflow-hidden rounded-[14px] border border-line bg-[#060a12]">
      <div className="absolute inset-0">
        <GlobeScene />
      </div>
      <div className="pointer-events-none absolute left-5 top-4 flex flex-col gap-1">
        <h2 className="font-display text-lg font-semibold">Global network</h2>
        <p className="text-[13px] text-muted stacked with flex flex-col gap-1">
          Drag to rotate · scroll to zoom
        </p>
      </div>
    </section>
  );
};

export default GlobePanel;
