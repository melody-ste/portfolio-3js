uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

varying vec2 vUv;
varying vec3 vLocalPos;

void main()
{
  // Displace the UV
  vec2 displacedUv = vUv + cnoise(vec3(vUv * 5.0, uTime* 0.1));

  // Perlin noise
  float strength = cnoise(vec3(displacedUv * 5.0, uTime* 0.2));

  // Outer glow
  float distToEdge = 1.0 - smoothstep(0.0, 0.2, length(vLocalPos.xy));  
  float glow = distToEdge * 2.0;

  strength += glow;

  // Apply cool step
  strength += step(- 0.1, strength) * 0.7;

  // Final color
  vec3 color = mix(uColorStart, uColorEnd, strength);

  gl_FragColor = vec4(color, 1.0);
}