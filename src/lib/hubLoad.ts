import type { Hub } from "../types/hub.types";

// At or above this, a hub is "at risk" of congestion
export const HIGH_LOAD = 0.85;

export const isHighLoad = (hub: Hub) => hub.capacityUsed >= HIGH_LOAD;
