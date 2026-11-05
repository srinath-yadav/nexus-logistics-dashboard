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

export const METRICS_DATA = [
  {
    title: "In transit",
    description: "Sample data across 8 hubs",
    value: "1,284",
  },
  {
    title: "On-time rate",
    description: "Rolling 7 days",
    value: "94.2%",
  },
  {
    title: "Delayed",
    description: "12 need action today",
    value: "37",
  },
  {
    title: "Avg transit",
    description: `door to door`,
    value: "3.8 d",
  },
];
