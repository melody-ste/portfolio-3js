attribute vec3 instanceOffset;
attribute float instanceHeight;
attribute float instanceYaw;
attribute float instanceBend;

uniform float iTime;

varying float vGrassHeight;
varying vec3 vWorldPos;

// Rotate around Y
mat3 rotateY(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0,  c
    );
}

void main() {
    vec3 pos = position;

    vGrassHeight = position.y / instanceHeight;

    pos.y *= instanceHeight;

    float bendAmount = sin(iTime * 0.0005 + instanceBend) * 0.15;
    pos.x += pos.y * bendAmount;

    pos = rotateY(instanceYaw) * pos;
    pos += instanceOffset;

    vWorldPos = instanceOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}