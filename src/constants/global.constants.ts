import type { NavItem } from "../types/header.types";

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Overview",
  },
  {
    to: "/shipments",
    label: "Shipments",
  },
  {
    to: "/fleet",
    label: "Fleet & hubs",
  },
];

export const LEGEND_ITEMS = [
  { label: "In transit", swatch: "h-0.5 w-4 bg-transit" },
  { label: "Delayed", swatch: "w-4 border-t-2 border-dashed border-delayed" },
  { label: "Exception", swatch: "h-1 w-4 bg-exception" },
  { label: "Hub", swatch: "h-2 w-2 rounded-full bg-ink" },
];
