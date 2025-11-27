varying vec3 vColor;

void main() {
    vec3 col = mix(vec3(0.0, 0.3, 0.0), vec3(0.4, 0.8, 0.4), vColor.y);
    gl_FragColor = vec4(col, 1.0);
}