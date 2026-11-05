export const cityLightsVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;                                         // where on the image this point is
    vNormal = normalize(mat3(modelMatrix) * normal);  // which way the surface faces (world space)
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const cityLightsFragment = /* glsl */ `
  uniform sampler2D uNightMap;
  uniform vec3 uSunDirection;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    // 1 = facing the sun, 0 = edge, -1 = facing away
    float facing = dot(normalize(vNormal), normalize(uSunDirection));

    // 0 on the day side, 1 on the night side, soft fade in between
    float night = 1.0 - smoothstep(-0.25, 0.15, facing);

    vec3 lights = texture2D(uNightMap, vUv).rgb;
    gl_FragColor = vec4(lights * night * 1.5, 1.0);

    #include <colorspace_fragment>
  }
`;
