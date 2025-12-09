varying vec3 vColor;

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));

  float strength = 0.1 / distanceToCenter - 0.1;
  strength = clamp(strength, 0.0, 1.0);

  vec3 color = vColor * strength * 1.2;

  gl_FragColor = vec4(color, strength);
}