import { useAiSummary } from "../../hooks/useAiSummary";
import type { ShipmentSummary } from "../../lib/summary";
import type { Shipment } from "../../types/shipment.types";
import ShipmentSummaryCard from "./ShipmentSummaryCard";

type Props = { shipment: Shipment; fallback: ShipmentSummary };

const AiSummaryCard = ({ shipment, fallback }: Props) => {
  const { summary, loading } = useAiSummary(shipment, fallback);
  return <ShipmentSummaryCard summary={summary} loading={loading} />;
};

export default AiSummaryCard;
