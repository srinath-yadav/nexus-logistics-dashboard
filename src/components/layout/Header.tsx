import { Link, NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/header.constants";
import LiveClock from "./LiveClock";

const Header = () => {
  return (
    <header className="flex flex-wrap items-center gap-6 px-8 py-4 bg-bar border-b border-line">
      <Link to="/" className="flex items-center gap-2.5">
        <img src="/nexus-logo.png" alt="" width={28} height={28} />
        <span className="font-display font-bold text-xl tracking-[3px] text-ink">
          NEXUS
        </span>
      </Link>
      <nav aria-label="Main" className="flex gap-1">
        {NAV_ITEMS.map((nav) => (
          <NavLink
            key={nav.to}
            to={nav.to}
            className={({ isActive }) =>
              `focus-visible:outline-2 focus-visible:outline-live
     px-3.5 py-2 rounded-md text-sm font-semibold
     ${isActive ? "bg-raised text-ink" : "text-muted hover:text-ink"}`
            }>
            {nav.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex-1" />
      <label htmlFor="search" className="sr-only">
        Search shipments
      </label>
      <input
        type="search"
        name="search"
        id="search"
        placeholder="Search shipment ID, hub, carrier…"
        className="w-75 max-w-full px-3.5 py-2 rounded-lg border border-line bg-field text-sm text-ink placeholder:text-muted focus:outline-none focus:border-live"
      />
      <LiveClock />
      <button
        type="button"
        aria-label="Account"
        className="h-9 w-9 rounded-full border border-line-strong bg-raised text-[13px] font-bold text-ink hover:border-live focus-visible:outline-2 focus-visible:outline-live">
        SY
      </button>
    </header>
  );
};

export default Header;
