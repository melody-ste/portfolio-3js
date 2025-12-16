varying float vGrassHeight;
void main() {
    float h = clamp(vGrassHeight, 0.0, 1.0);
    vec3 col = mix(vec3(0.10, 0.07, 0.04), vec3(0.7, 0.5, 0.8), h);
    gl_FragColor = vec4(col, 1.0);
}