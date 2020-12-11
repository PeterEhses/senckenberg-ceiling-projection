precision mediump float;
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform float uTime;
uniform sampler2D planeTexture;
void main() {
    // just distort the text a bit
    vec2 textureCoords = vTextureCoord;
    textureCoords.x += sin(uTime / 30.0) / 100.0 * cos(textureCoords.y * 20.0);
    gl_FragColor = texture2D(planeTexture, textureCoords);
}
