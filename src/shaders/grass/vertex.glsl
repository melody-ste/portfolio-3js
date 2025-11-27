attribute vec3 instanceOffset;
attribute float instanceHeight;
attribute float instanceYaw;
attribute float instanceBend;

uniform float iTime;

varying vec3 vColor;

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

    pos.y *= instanceHeight;

    float bendAmount = sin(iTime * 0.002 + instanceBend) * 0.15;
    pos.x += pos.y * bendAmount;

    pos = rotateY(instanceYaw) * pos;

    pos += instanceOffset;

    vColor = vec3(pos.y / instanceHeight);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}