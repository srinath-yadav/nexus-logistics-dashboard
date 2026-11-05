import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex flex-wrap items-center gap-6 px-8 py-4 bg-bar border-b border-line">
      <Link to="/" className="flex items-center gap-2.5">
        <img src="nexus-logo.png" alt="Nexus logo" width={24} height={24} />
        <span className="font-display text-live">NEXUS</span>
      </Link>
      <div className="flex justify-between align-middle w-[90%]">
        <div>
          <ul className="flex gap-3">
            <NavLink to="/" className="selected">
              Overview
            </NavLink>
            <NavLink to="/shipments">Shipments</NavLink>
            <li>Fleet & hubs</li>
          </ul>
        </div>
        <div>
          <ul className="flex gap-3">
            <li>Search</li>
            <li>Live </li>
            <li>Profile</li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
