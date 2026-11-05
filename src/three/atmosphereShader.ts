export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal); // direction relative to the camera
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;

  void main() {
    // 0 at the halo's outer edge, larger closer to the Earth
    float rim = max(0.0, -vNormal.z);
    float intensity = pow(rim, 1.5) * uStrength;

    gl_FragColor = vec4(uColor * intensity, 1.0);
    #include <colorspace_fragment>
  }
`;
