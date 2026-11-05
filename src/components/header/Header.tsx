import nexusLogo from "../../../public/nexus-logo.png";

const Header = () => {
  return (
    <header className="header">
      <img src={nexusLogo} alt="Nexus logo" width={24} height={24} />
      <span>NEXUS</span>
      <div className="flex justify-between align-middle w-[90%]">
        <div>
          <ul className="flex gap-3">
            <li>Overview</li>
            <li>Shipments</li>
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
