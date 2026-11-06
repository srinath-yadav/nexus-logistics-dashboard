import { MathUtils, QuadraticBezierCurve3, Vector3 } from "three";

export function latLonToVector3(lat: number, lon: number, radius = 1): Vector3 {
  const phi = MathUtils.degToRad(90 - lat);
  const theta = MathUtils.degToRad(lon + 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi); // height depends only on latitude
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
}

/** A curved path above the globe from start to end. Longer routes arc higher. */
export function arcCurve(start: Vector3, end: Vector3): QuadraticBezierCurve3 {
  const distance = start.distanceTo(end); // 0 (same place) … 2 (opposite sides)

  // Direction of the midpoint between the two cities
  const control = start.clone().add(end);
  if (control.lengthSq() < 1e-6) control.set(0, 1, 0); // cities on opposite sides: go over the pole

  // Push it above the surface: higher for longer routes
  control.normalize().multiplyScalar(1 + 0.15 + distance * 0.35);

  return new QuadraticBezierCurve3(start, control, end);
}
