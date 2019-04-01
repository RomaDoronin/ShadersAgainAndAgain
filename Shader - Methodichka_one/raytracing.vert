#version 430

// Вызывается для каждой вершины

attribute vec2 fragCoord;
varying vec2 fragCoordToVert;

void main()
{
	fragCoordToVert = fragCoord;
	vec4 res = vec4(fragCoord, 0, 1);	
	gl_Position = res; // Координаты для вершинного шейдера
}
