#version 430

varying vec2 fragCoordToVert; // передача координат из вершинного в пиксельный вектор ПРИЕМ

#define EPSILON = 0.001
#define BIG = 1000000.0
const int DEFFUSE = 1;
const int REFLECTION = 2;
const int REFRACTION = 3;

// Сфера
struct SSphere
{
    vec3 Center;
    float Radius;
    int MaterialIdx;
};

// Треугольник
struct STriangle
{
    vec3 v1;
    vec3 v2;
    vec3 v3;
    int MaterialIdx;
};

struct SLight
{
    vec3 Position;
};

// Камера
struct SCamera
{
    vec3 Position;
    vec3 View;
    vec3 Up;
    vec3 Side;
    vec2 Scale;
};

// Структура хранящая пересечение
struct SIntersection
{
    float Time;
    vec3 Point;
    vec3 Normal;
    vec3 Color;
    vec4 LightCoeffs;
    float ReflectionCoef;
    float RefractionCoef;
    int MaterialType;
};

struct SMaterial
{
    vec3 Color;
    vec4 LightCoeffs;
    float ReflectionCoef;
    float RefractionCoef;
    int MaterialType;
};

// Луч
struct SRay
{
    vec3 Origin;
    vec3 Direction;
};

SLight light;
SMaterial materials[6];

// Инициализация фигур на сцене
void initializeDefaultScene(out STriangle triangles[10], out SSphere spheres[2])
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

// Генерация луча
SRay GenerateRay(SCamera uCamera)
{
    vec2 coords = fragCoordToVert * uCamera.Scale;
    vec3 direction = uCamera.View + uCamera.Side * coords.x + uCamera.Up * coords.y;

    return SRay(uCamera.Position, normalize(direction));
}

// Инициализация камеры
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

bool IntersectSphere(SSphere sphere, SRay ray, float start, float end, out float time)
{
    ray.Origin -= sphere.Center;
    float A = dot(ray.Direction, ray.Direction);
    float B = dot(ray.Direction, ray.Origin);
    float C = dot(ray.Origin, ray.Origin) - sphere.Radius * sphere.Radius;
    float D = B * B - A * C;
    
    if (D > 0.0)
    {
        D = sqrt(D);
        float t1 = (-B - D) / A;
        float t2 = (-B + D) / A;

        if (t1 < 0 && t2 < 0)
        {
            return false;
        }
        
        if (min(t1, t2) < 0)
        {
            time = max(t1, t2);
            return true;
        }

        time = min(t1, t2);
        return true;
    }

    return false;
}

bool IntersectTriangle(SRay ray, vec3 v1, vec3 v2, vec3 v3, out float time)
{
    time = -1;

    vec3 A = v2 - v1;
    vec3 B = v3 - v1;
    vec3 N = cross(A,B); // Нормализация

    // Проверка на параллельность луча и поверхности
    float NDotRayDirection = dot(N, ray.Direction);
    if (abs(NDotRayDirection) < 0.001)
    {
        return false;
    }

    // Проверка на то что луч проходит перед треугольником
    float d = dot(N, v1);
    float t = -(dot(N, ray.Origin) - d) / NDotRayDirection;
    if (t < 0)
    {
        return false;
    }

    // Вычисление точки пересечения
    vec3 P = ray.Origin + t * ray.Direction;
    // Проверка: Снаружи или Внутри
    vec3 C;
    vec3 edge1 = v2 - v1;
    vec3 VP1 = P - v1;
    C = cross(edge1, VP1);
    if (dot(N, C) < 0)
    {
        return false;
    }

    vec3 edge2 = v3 - v2;
    vec3 VP2 = P - v2;
    C = cross(edge2, VP2);
    if (dot(N, C) < 0)
    {
        return false;
    }

    vec3 edge3 = v1 - v3;
    vec3 VP3 = P - v3;
    C = cross(edge3, VP3);
    if (dot(N, C) < 0)
    {
        return false;
    }

    time = t;

    return true;
}

void InitializeDefaultLightMaterials(out SLight light, out SMaterial materials[6])
{
    light.Position = vec3(0.0, 2.0, -4.0);

    vec4 lightCoefs = vec4(0.4, 0.9, 0.0, 512.0);
    materials[0].Color = vec3(0.0, 1.0, 0.0);
    materials[0].LightCoeffs = vec4(lightCoefs);
    materials[0].ReflectionCoef = 0.5;
    materials[0].RefractionCoef = 1.0;
    materials[0].MaterialType = DEFFUSE;

    materials[1].Color = vec3(0.0, 0.0, 1.0);
    materials[1].LightCoeffs = vec4(lightCoefs);
    materials[1].ReflectionCoef = 0.5;
    materials[1].RefractionCoef = 1.0;
    materials[1].MaterialType = DEFFUSE;
}

// Функция трасирующая луч
bool Raytrace(SRay ray, SSphere spheres[2], STriangle triangles[10], SMaterial materials[6], float start, float end, inout SIntersection intersect)
{
    bool result = false;
    float test = start;
    intersect.Time = end;
    STriangle triangles[10];
    SSphere spheres[2];

    // Расчет пересечений со сферой
    for (int i = 0; i < 2; i++)
    {
        SSphere sphere = spheres[i];

        if (IntersectSphere(sphere, ray, start, end, test) && test < intersect.Time)
        {
            intersect.Time           = test;
            intersect.Point          = ray.Origin + ray.Direction * test;
            intersect.Normal         = normalize(intersect.Point - spheres[i].Center);
            intersect.Color          = vec3(1,0,0);
            intersect.LightCoeffs    = vec4(0,0,0,0);
            intersect.ReflectionCoef = 0;
            intersect.RefractionCoef = 0;
            intersect.MaterialType   = 0;

            result = true;
        }
    }

    //Расчет пересечений с треугольниками
    for (int i = 0; i < 10; i++)
    {
        STriangle triangle = triangles[i];

        if (IntersectTriangle(ray, triangle.v1, triangle.v2, triangle.v3, test) && test < intersect.Time)
        {
            intersect.Time           = test;
            intersect.Point          = ray.Origin + ray.Direction * test;
            intersect.Normal         = normalize(cross(triangle.v1 - triangle.v2, triangle.v3 - triangle.v2));
            intersect.Color          = vec3(1,0,0);
            intersect.LightCoeffs    = vec4(0,0,0,0);
            intersect.ReflectionCoef = 0;
            intersect.RefractionCoef = 0;
            intersect.MaterialType   = 0;

            result = true;
        }
    }

    return result;
}

void main(void)
{
    float start = 0;
    float end = 1000000.0;

    SCamera uCamera = InitializeDefaultCamera();
    SRay ray = GenerateRay(uCamera);
    SIntersection intersect;
    intersect.Time = 1000000.0;
    vec3 resultColor = vec3(0,0,0);
    initializeDefaultScene(triangles, spheres);

    if (Raytrace(ray, shperes, triangles, materials, start, end, intersect))
    {
        resultColor = vec3(1,0,0);
    }
    
    gl_FragColor = vec4(resultColor, 1.0); // Переменная для итогового цвета
}
