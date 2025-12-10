uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;
varying float vEdgeDist;

void main()
{
  // Displace the UV
  vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime* 0.1));

  // Perlin noise
  float strength = cnoise(vec3(displacedUv * 5.0, uTime* 0.2));

  // Outer glow
  float edgeFactor = 1.0 - vEdgeDist;
 float glow = smoothstep(0.5, 1.0, edgeFactor);

  glow = pow(glow, 0.5);
  glow *= 3.0; 

  strength += glow;

  // Apply cool step
  strength += step(- 0.1, strength) * 0.03;

  // Final color
  // vec3 color = vec3(glow);
  vec3 color = mix(uColorStart, uColorEnd, strength);

  gl_FragColor = vec4(color, 1.0);
}