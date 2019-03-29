#version 430

#define GOLD vec4(1.0, 0.86, 0.6, 1.0)
#define MEDIUM_SPRING_GREEN vec4(0.0, 0.97, 0.6, 1.0)

uniform float iTime;
varying vec2 fragCoordToVert;

void main(void)
{
    // Time varying pixel color
    vec3 col = 0.5 + 0.5 * cos(iTime + fragCoordToVert.xyx + vec3(0,2,4));

    // Output to screen
	gl_FragColor = vec4(col, 1.0);
}
