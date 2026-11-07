import { HUBS_BY_CODE } from "../src/data/hubs";
import { distanceKm } from "../src/lib/distance";
import { isHighLoad } from "../src/lib/hubLoad";
import { STATUS_LABELS } from "../src/lib/status";
import { summarizeShipment, type SummaryResponse } from "../src/lib/summary";
import type { Hub } from "../src/types/hub.types";
import type { Shipment } from "../src/types/shipment.types";
import { validateShipment } from "./validate";

const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const AI_TIMEOUT_MS = 10000; // a bigger model can take a little longer
const DAY_MS = 24 * 60 * 60 * 1000;
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// The model's job description. Strict rules keep the output short, factual and safe.
const SYSTEM_PROMPT = `You write one status update for a logistics operations dashboard.

Return JSON with one field, "detail": one or two short sentences, at most 40 words.

Rules:
- Use ONLY the facts provided. Never invent numbers, dates, causes, people or places.
- Copy the eta exactly as written in the facts.
- Always name the destination city and give the percent complete and kilometres remaining.
- If status is "In transit": say when it arrives.
- If status is "Delayed": say it is running late and when it is now expected.
- If status is "Exception": say the shipment is stopped and the ETA is at risk. Never say it is arriving. End by telling the operator to contact the carrier by name.
- Mention hub congestion only if destinationCongested is true, naming the destination hub and its capacity percent.
- Plain English. No emojis, no markdown, no greetings.

Example facts:
{"destination":"Singapore","carrier":"Oceanic Line","status":"In transit","tone":"good","percentComplete":42,"kilometresRemaining":1700,"eta":"12 Nov 2026","daysUntilEta":5,"destinationHubCapacityPercent":70,"destinationCongested":false}
Example answer:
{"detail":"42% of the way to Singapore with 1,700 km left, arriving 12 Nov 2026 in about 5 days."}`;

// JSON mode: the model must answer in exactly this shape
const SUMMARY_SCHEMA = {
  type: "object",
  properties: {
    detail: { type: "string" },
  },
  required: ["detail"],
};

/** Everything the model may talk about, computed by code (never by the model). */
function buildFacts(
  shipment: Shipment,
  from: Hub,
  to: Hub,
  remainingKm: number,
  tone: string,
  headline: string,
) {
  return {
    headline,
    shipmentId: shipment.id,
    origin: from.city,
    destination: to.city,
    carrier: shipment.carrier,
    status: STATUS_LABELS[shipment.status],
    tone,
    percentComplete: Math.round(shipment.progress * 100),
    kilometresRemaining: Math.round(remainingKm),
    eta: dateFormatter.format(new Date(shipment.eta)),
    daysUntilEta: Math.ceil((Date.parse(shipment.eta) - Date.now()) / DAY_MS),
    destinationHubCapacityPercent: Math.round(to.capacityUsed * 100),
    destinationCongested: isHighLoad(to),
  };
}

type Facts = ReturnType<typeof buildFacts>;

/** Rejects if the promise takes longer than `ms`. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms),
    ),
  ]);
}

/** Never trust model output blindly: check it has the right shape and size. */
/** All the numbers the model is allowed to use, without commas: "1,700" → "1700". */
function allowedNumbers(facts: Facts): Set<string> {
  const text = JSON.stringify(facts);
  return new Set(
    (text.match(/\d[\d,]*/g) ?? []).map((n) => n.replace(/,/g, "")),
  );
}

/** Never trust model output blindly: check shape, size, and that it's grounded in the facts. */
/** Never trust model output blindly: check shape, size, and that it's grounded in the facts. */
function checkModelOutput(data: unknown, facts: Facts): { detail: string } {
  if (typeof data !== "object" || data === null)
    throw new Error("Model returned no object");
  const { detail } = data as Record<string, unknown>;

  if (typeof detail !== "string" || !detail.trim() || detail.length > 320) {
    throw new Error(`Bad detail from model: ${String(detail)}`);
  }

  // Grounding: right place, exact ETA text, and no invented numbers
  if (!detail.includes(facts.destination)) {
    throw new Error(`Detail doesn't mention ${facts.destination}: ${detail}`);
  }
  if (!detail.includes(facts.eta)) {
    throw new Error(
      `Detail doesn't contain the exact ETA "${facts.eta}": ${detail}`,
    );
  }
  const allowed = allowedNumbers(facts);
  const used = (detail.match(/\d[\d,]*/g) ?? []).map((n) =>
    n.replace(/,/g, ""),
  );
  const invented = used.filter((n) => !allowed.has(n));
  if (invented.length > 0) {
    throw new Error(
      `Detail has numbers not in the facts (${invented.join(", ")}): ${detail}`,
    );
  }

  return { detail: detail.trim() };
}

async function askModel(env: Env, facts: Facts) {
  const result = await env.AI.run(MODEL, {
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Facts:\n${JSON.stringify(facts, null, 2)}` },
    ],
    response_format: { type: "json_schema", json_schema: SUMMARY_SCHEMA },
    max_tokens: 200,
    temperature: 0.3, // low = consistent, factual wording
  });

  // JSON mode may return an object or a JSON string — handle both
  const raw: unknown = (result as { response?: unknown }).response;
  const data: unknown = typeof raw === "string" ? JSON.parse(raw) : raw;
  return checkModelOutput(data, facts);
}

export async function handleSummary(
  request: Request,
  env: Env,
): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Use POST" },
      { status: 405, headers: { Allow: "POST" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON" }, { status: 400 });
  }

  const checked = validateShipment(
    (body as { shipment?: unknown } | null)?.shipment,
  );
  if (!checked.ok)
    return Response.json({ error: checked.error }, { status: 400 });

  const { shipment } = checked;
  const from = HUBS_BY_CODE[shipment.from];
  const to = HUBS_BY_CODE[shipment.to];
  const remainingKm = distanceKm(from, to) * (1 - shipment.progress);

  // The rule-based summary: our tone source AND our fallback
  const rules = summarizeShipment(shipment, from, to, remainingKm);
  if (shipment.status === "delivered") {
    const response: SummaryResponse = { ...rules, source: "rules" };
    return Response.json(response);
  }

  try {
    const facts = buildFacts(
      shipment,
      from,
      to,
      remainingKm,
      rules.tone,
      rules.headline,
    );
    const ai = await withTimeout(askModel(env, facts), AI_TIMEOUT_MS);
    const response: SummaryResponse = {
      headline: rules.headline, // always correct for the status — never from the model
      detail: ai.detail,
      tone: rules.tone,
      source: "ai",
    };
    return Response.json(response);
  } catch (error) {
    console.error("AI summary failed, falling back to rules:", error); // shows in Cloudflare logs
    const response: SummaryResponse = { ...rules, source: "rules" };
    return Response.json(response);
  }
}
