uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aColor;

varying vec3 vColor;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vColor = aColor;

  vec3 pos = position;
  float seed = rand(pos.xy);

  // --- MOVEMENT VERTICAL ---
  pos.y += sin(uTime * (0.8 + seed * 2.0)) * 0.25;

  // --- LEFT / RIGHT DRIFT ---
  pos.x += sin(uTime * 0.6 + seed * 4.0) * 0.35;

  // --- BACK / FORWARD DRIFT ---
  pos.z += cos(uTime * 0.7 + seed * 3.0) * 0.35;

  // --- MOVEMENT CIRCLE ---
  float radius = 0.15 + seed * 0.2;
  pos.x += cos(uTime * 1.2 + seed * 6.0) * radius;
  pos.z += sin(uTime * 1.4 + seed * 5.0) * radius;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / - viewPosition.z);
}