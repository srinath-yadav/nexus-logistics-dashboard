import { MathUtils, Vector3 } from "three";

export function latLonToVector3(lat: number, lon: number, radius = 1): Vector3 {
  const phi = MathUtils.degToRad(90 - lat);
  const theta = MathUtils.degToRad(lon + 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi); // height depends only on latitude
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
}
