export type Hub = {
  code: string;
  city: string;
  lat: number;
  lon: number;
  capacityUsed: number; // 0 → 1 (0.62 = 62% full)
  vehicles: number; // vehicles based at this hub
};
