import { HUBS_BY_CODE } from "../src/data/hubs";
import { distanceKm } from "../src/lib/distance";
import { isHighLoad } from "../src/lib/hubLoad";
import { STATUS_LABELS } from "../src/lib/status";
import { summarizeShipment, type SummaryResponse } from "../src/lib/summary";
import type { Hub } from "../src/types/hub.types";
import type { Shipment } from "../src/types/shipment.types";
import { validateShipment } from "./validate";

const MODEL = "@cf/meta/llama-3.1-8b-instruct";
const AI_TIMEOUT_MS = 8000;
const DAY_MS = 24 * 60 * 60 * 1000;
const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// The model's job description. Strict rules keep the output short, factual and safe.
const SYSTEM_PROMPT = `You write status summaries for a logistics operations dashboard.

Rules:
- Use ONLY the facts provided. Never invent numbers, dates, causes, people or places.
- "headline": 2 to 4 words ending with a full stop, for example "On track." or "Needs action."
- "detail": one or two short sentences, at most 40 words, that an operations manager can act on.
- Mention destination hub congestion only if destinationCongested is true.
- Match the tone field: "good" = calm and reassuring, "watch" = cautious, "action" = urgent; for "action", suggest contacting the carrier.
- Plain English. No emojis, no markdown, no greetings.`;

// JSON mode: the model must answer in exactly this shape
const SUMMARY_SCHEMA = {
  type: "object",
  properties: {
    headline: { type: "string" },
    detail: { type: "string" },
  },
  required: ["headline", "detail"],
};

/** Everything the model may talk about, computed by code (never by the model). */
function buildFacts(
  shipment: Shipment,
  from: Hub,
  to: Hub,
  remainingKm: number,
  tone: string,
) {
  return {
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
function checkModelOutput(data: unknown): { headline: string; detail: string } {
  if (typeof data !== "object" || data === null)
    throw new Error("Model returned no object");
  const { headline, detail } = data as Record<string, unknown>;
  if (
    typeof headline !== "string" ||
    !headline.trim() ||
    headline.length > 40
  ) {
    throw new Error("Bad headline from model");
  }
  if (typeof detail !== "string" || !detail.trim() || detail.length > 320) {
    throw new Error("Bad detail from model");
  }
  return { headline: headline.trim(), detail: detail.trim() };
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
  return checkModelOutput(data);
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

  try {
    const facts = buildFacts(shipment, from, to, remainingKm, rules.tone);
    const ai = await withTimeout(askModel(env, facts), AI_TIMEOUT_MS);
    const response: SummaryResponse = { ...ai, tone: rules.tone, source: "ai" };
    return Response.json(response);
  } catch (error) {
    console.error("AI summary failed, falling back to rules:", error); // shows in Cloudflare logs
    const response: SummaryResponse = { ...rules, source: "rules" };
    return Response.json(response);
  }
}
