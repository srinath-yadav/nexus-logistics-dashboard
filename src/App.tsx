import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header";
import Overview from "./pages/Overview";
import Shipments from "./pages/Shipments";
import Fleet from "./pages/Fleet";
import ShipmentDetail from "./pages/ShipmentDetail";
import NotFound from "./pages/Notfound";

function App() {
  return (
    <BrowserRouter>
      <div className="h-dvh flex flex-col bg-bg text-ink">
        <Header />

        <main className="flex-1 min-h-0">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/shipments/:id" element={<ShipmentDetail />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
