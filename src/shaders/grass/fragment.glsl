varying float vGrassHeight;
void main() {
    vec3 col = mix(vec3(0.20, 0.15, 0.08), vec3(0.7, 0.5, 0.8), vGrassHeight);
    gl_FragColor = vec4(col, 1.0);
}