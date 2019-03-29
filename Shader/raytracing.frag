#version 430

#define GOLD vec4(1.0, 0.86, 0.6, 1.0)
#define MEDIUM_SPRING_GREEN vec4(0.0, 0.97, 0.6, 1.0)

uniform float iTime;
varying vec2 fragCoordToVert;

struct SCamera
{
	vec3 Position;
	vec3 View;
	vec3 Up;
	vec3 Side;
	vec2 Scale;
};

struct SRay
{
	vec3 Origin;
	vec3 Direction;
};

SRay GenerateRay(SCamera uCamera)
{
	vec2 coords = fragCoordToVert * uCamera.Scale;
	vec3 direction = uCamera.View + uCamera.Side * coords.x + uCamera.Up * coords.y;

	return SRay(uCamera.Position, normalize(direction));
}

SCamera InitializeDefaultCamera()
{
    SCamera camera;

	camera.Position = vec3(0.0, 0.0, -8.0);
	camera.View = vec3(0.0, 0.0, 1.0);
	camera.Up = vec3(0.0, 1.0, 0.0);
	camera.Side = vec3(1.0, 0.0, 0.0);
	camera.Scale = vec2(1.0, 1.0);

	return camera;
}

void main(void)
{
	SCamera uCamera = InitializeDefaultCamera();
	SRay ray = GenerateRay(uCamera);

    // Time varying pixel color
    //vec3 col = 0.5 + 0.5 * cos(iTime + fragCoordToVert.xyx + vec3(0,2,4));

    // Output to screen
	//gl_FragColor = vec4(col, 1.0);
	gl_FragColor = vec4(abs(ray.Direction.xy), 0.0, 1.0);
}
