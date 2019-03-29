#version 430

// Вызывается для каждой вершины

attribute vec2 a_position;

void main()
{
    gl_Position = vec4(a_position, 0, 1); // Координаты для вершинного шейдера
}
