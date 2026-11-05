type Metric = { label: string; value: string; note: string };

export const METRICS_DATA: Metric[] = [
  {
    label: "In transit",
    note: "Sample data across 8 hubs",
    value: "1,284",
  },
  {
    label: "On-time rate",
    note: "Rolling 7 days",
    value: "94.2%",
  },
  {
    label: "Delayed",
    note: "12 need action today",
    value: "37",
  },
  {
    label: "Avg transit",
    note: `door to door`,
    value: "3.8 d",
  },
];
