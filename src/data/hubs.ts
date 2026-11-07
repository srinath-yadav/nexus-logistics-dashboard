import type { Hub } from "../types/hub.types";

export const HUBS: Hub[] = [
  {
    code: "MAA",
    city: "Chennai",
    lat: 13.08,
    lon: 80.27,
    capacityUsed: 0.62,
    vehicles: 48,
  },
  {
    code: "BOM",
    city: "Mumbai",
    lat: 19.08,
    lon: 72.88,
    capacityUsed: 0.91,
    vehicles: 75,
  },
  {
    code: "SIN",
    city: "Singapore",
    lat: 1.35,
    lon: 103.82,
    capacityUsed: 0.7,
    vehicles: 66,
  },
  {
    code: "DXB",
    city: "Dubai",
    lat: 25.2,
    lon: 55.27,
    capacityUsed: 0.87,
    vehicles: 52,
  },
  {
    code: "RTM",
    city: "Rotterdam",
    lat: 51.92,
    lon: 4.48,
    capacityUsed: 0.51,
    vehicles: 41,
  },
  {
    code: "HAM",
    city: "Hamburg",
    lat: 53.55,
    lon: 9.99,
    capacityUsed: 0.44,
    vehicles: 37,
  },
  {
    code: "SHA",
    city: "Shanghai",
    lat: 31.23,
    lon: 121.47,
    capacityUsed: 0.66,
    vehicles: 80,
  },
  {
    code: "LAX",
    city: "Los Angeles",
    lat: 33.94,
    lon: -118.41,
    capacityUsed: 0.38,
    vehicles: 29,
  },
];

// "MAA" → { code, city, lat, lon } — instant lookup instead of HUBS.find() every time
export const HUBS_BY_CODE: Record<string, Hub> = Object.fromEntries(
  HUBS.map((hub) => [hub.code, hub]),
);
