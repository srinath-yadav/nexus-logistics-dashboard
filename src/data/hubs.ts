import type { Hub } from "../types/hub.types";

export const HUBS: Hub[] = [
  { code: "MAA", city: "Chennai", lat: 13.08, lon: 80.27 },
  { code: "BOM", city: "Mumbai", lat: 19.08, lon: 72.88 },
  { code: "SIN", city: "Singapore", lat: 1.35, lon: 103.82 },
  { code: "DXB", city: "Dubai", lat: 25.2, lon: 55.27 },
  { code: "RTM", city: "Rotterdam", lat: 51.92, lon: 4.48 },
  { code: "HAM", city: "Hamburg", lat: 53.55, lon: 9.99 },
  { code: "SHA", city: "Shanghai", lat: 31.23, lon: 121.47 },
  { code: "LAX", city: "Los Angeles", lat: 33.94, lon: -118.41 },
];

// "MAA" → { code, city, lat, lon } — instant lookup instead of HUBS.find() every time
export const HUBS_BY_CODE: Record<string, Hub> = Object.fromEntries(
  HUBS.map((hub) => [hub.code, hub]),
);
