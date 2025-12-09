uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
  vColor = aColor;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // vertical flutter
  modelPosition.y += sin(uTime * 1.3 + modelPosition.x * 0.25) * aScale * 0.1;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;
  gl_PointSize = uSize * aScale * uPixelRatio;
  gl_PointSize *= (1.0 / - viewPosition.z);
}