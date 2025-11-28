varying vec3 vColor;

void main() {
    vec3 col = mix(vec3(0.04, 0.03, 0.10), vec3(0.7, 0.5, 0.8), vColor.y);
    gl_FragColor = vec4(col, 1.0);
}