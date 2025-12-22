varying float vGrassHeight;
varying vec3 vWorldPos;

void main() {
  float h = clamp(vGrassHeight, 0.0, 1.0);
  float noise = cnoise(vWorldPos * 0.15);
  noise = noise * 0.5 + 0.5;

  vec3 colorLow  = vec3(0.10, 0.07, 0.04);
  vec3 colorHigh = vec3(0.7, 0.5, 0.8);

  vec3 baseColor = mix(colorLow, colorHigh, h);

  vec3 finalColor = baseColor * (0.9 + noise * 0.4);

  gl_FragColor = vec4(finalColor, 1.0);
}