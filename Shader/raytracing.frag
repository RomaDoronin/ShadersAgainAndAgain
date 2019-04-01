#version 430

varying vec2 fragCoordToVert; // �������� ��������� �� ���������� � ���������� ������ �����

#define EPSILON = 0.001
#define BIG = 1000000.0
const int DEFFUSE = 1;
const int REFLECTION = 2;
const int REFRACTION = 3;

struct SSphere
{
    vec3 Center;
    float Radius;
    int MaterialIdx;
};

struct STriangle
{
    vec3 v1;
    vec3 v2;
    vec3 v3;
    int MaterialIdx;
};

void initializeDefaultScene(out STriangle triangles[], out SSphere spheres[])
{
    // Cube
    // B
    triangles[0].v1 = vec3(-5.0,  5.0,  5.0);
    triangles[0].v2 = vec3( 5.0, -5.0,  5.0);
    triangles[0].v3 = vec3(-5.0, -5.0,  5.0);
    triangles[0].MaterialIdx = 0;


    triangles[1].v1 = vec3(-5.0,  5.0,  5.0);
    triangles[1].v2 = vec3( 5.0, -5.0,  5.0);
    triangles[1].v3 = vec3( 5.0,  5.0,  5.0);
    triangles[1].MaterialIdx = 0;

    // L
    triangles[2].v1 = vec3(-5.0,  5.0,  5.0);
    triangles[2].v2 = vec3(-5.0, -5.0, -5.0);
    triangles[2].v3 = vec3(-5.0, -5.0,  5.0);
    triangles[2].MaterialIdx = 0;

    
    triangles[3].v1 = vec3(-5.0,  5.0,  5.0);
    triangles[3].v2 = vec3(-5.0, -5.0, -5.0);
    triangles[3].v3 = vec3(-5.0, -5.0, -5.0);
    triangles[3].MaterialIdx = 0;

    // R
    triangles[4].v1 = vec3( 5.0, -5.0,  5.0);
    triangles[4].v2 = vec3( 5.0,  5.0, -5.0);
    triangles[4].v3 = vec3( 5.0, -5.0,  5.0);
    triangles[4].MaterialIdx = 0;

    triangles[5].v1 = vec3( 5.0, -5.0,  5.0);
    triangles[5].v2 = vec3( 5.0,  5.0, -5.0);
    triangles[5].v3 = vec3( 5.0,  5.0,  5.0);
    triangles[5].MaterialIdx = 0;

    // D
    triangles[6].v1 = vec3( 5.0, -5.0,  5.0);
    triangles[6].v2 = vec3(-5.0, -5.0, -5.0);
    triangles[6].v3 = vec3( 5.0, -5.0,  5.0);
    triangles[6].MaterialIdx = 0;

    triangles[7].v1 = vec3( 5.0, -5.0,  5.0);
    triangles[7].v2 = vec3(-5.0, -5.0, -5.0);
    triangles[7].v3 = vec3(-5.0, -5.0,  5.0);
    triangles[7].MaterialIdx = 0;

    // U
    triangles[8].v1 = vec3( 5.0,  5.0, -5.0);
    triangles[8].v2 = vec3(-5.0,  5.0,  5.0);
    triangles[8].v3 = vec3( 5.0,  5.0,  5.0);
    triangles[8].MaterialIdx = 0;

    triangles[9].v1 = vec3( 5.0,  5.0, -5.0);
    triangles[9].v2 = vec3(-5.0,  5.0,  5.0);
    triangles[9].v3 = vec3(-5.0,  5.0, -5.0);
    triangles[9].MaterialIdx = 0;

    // Sphere
    spheres[0].Center = vec3(-1.0, -1.0, 2.0);
    spheres[0].Radius = 2.0;
    spheres[0].MaterialIdx = 0;

    spheres[1].Center = vec3(2.0, 1.0, 2.0);
    spheres[1].Radius = 1.0;
    spheres[1].MaterialIdx = 0;
}

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
	STriangle triangles[10];
	SSphere spheres[2];
	initializeDefaultScene(triangles, spheres);

    SCamera uCamera = InitializeDefaultCamera();
    SRay ray = GenerateRay(uCamera);

    gl_FragColor = vec4(abs(ray.Direction.xy), 0.0, 1.0); // ���������� ��� ��������� �����
}
