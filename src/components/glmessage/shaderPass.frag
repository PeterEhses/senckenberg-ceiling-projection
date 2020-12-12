precision mediump float;
// get our varyings
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
uniform vec2 uResolution;
// our render texture
uniform sampler2D uRenderTexture;

const float Pi = 6.28318530718; // Pi*2

// GAUSSIAN BLUR SETTINGS {{{
const float Directions = 100.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
const float Quality = 3.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
float Size = 80.0; // BLUR SIZE (Radius)
// GAUSSIAN BLUR SETTINGS }}}
vec2 Radius = Size/uResolution;

    // Normalized pixel coordinates (from 0 to 1)
    //vec2 uv = (vVertexPosition.xy+1.)*.5/normalize(uResolution.xy);
    // Pixel colour


    // // Blur calculations
    // for( float d=0.0; d<Pi; d+=Pi/Directions)
    // {
		// for(float i=1.0/Quality; i<=1.0; i+=1.0/Quality)
    //     {
		// 	Color += texture( uRenderTexture, uv+vec2(cos(d),sin(d))*Radius*i);
    //     }
    // }

    // Output to screen
    //Color /= Quality * Directions - 15.0;
void main() {


  vec4 Color = texture2D(uRenderTexture, vTextureCoord);

  for( float d=0.0; d<Pi; d+=Pi/Directions){
    for(float i=1.0/Quality; i<=1.0; i+=1.0/Quality){
       Color += texture2D( uRenderTexture, vTextureCoord+vec2(cos(d),sin(d))*Radius*i);
      }
  }
Color /= Quality * Directions - 15.0;
Color = step(vec4(.001), Color);
vec4 Color1 = texture2D(uRenderTexture, vTextureCoord);
//Color = step(vec2(.5), vec2(Color.x, Color.y));
//Color = step(.1, uResolution);
// display our render texture, which contains our shader pass frame buffer object content
gl_FragColor = texture2D(uRenderTexture, vTextureCoord);
gl_FragColor = vec4(Color1.r, Color1.g, Color1.b, Color.a*.7+Color1.a);
//gl_FragColor = vec4(Radius.x,Radius.y,1.0,1.0);
}
