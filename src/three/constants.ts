import { latLonToVector3 } from "../lib/geo";

// Direction from the Earth's centre to the sun (length 1)
export const SUN_DIRECTION = latLonToVector3(20, 78, 1);
