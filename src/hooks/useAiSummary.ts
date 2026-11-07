import { useEffect, useState } from "react";
import type { ShipmentSummary, SummaryResponse } from "../lib/summary";
import type { Shipment } from "../types/shipment.types";

/**
 * Starts with the rule-based summary, then asks /api/summary for an AI version.
 * The fallback stays if the API is unavailable — the card never breaks.
 */
export function useAiSummary(shipment: Shipment, fallback: ShipmentSummary) {
  const [result, setResult] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipment }),
      signal: controller.signal, // lets us cancel the request
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<SummaryResponse>;
      })
      .then((data) => setResult(data))
      .catch((error: unknown) => {
        // Leaving the page cancels the request — that's expected, not an error
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        console.warn(
          "Summary API unavailable, keeping the rule-based summary.",
          error,
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    // Cleanup: runs when the component unmounts → cancel the request
    return () => controller.abort();
  }, [shipment]);

  return {
    summary: result ?? { ...fallback, source: "rules" as const },
    loading,
  };
}
