#version 430

// Вызывается для каждой вершины

in vec3 vPosition; // Нам приходит
out vec3 glPosition; // Мы отправляем дальше

void main()
{
    gl_Position = vec4(vPosition, 1.0); // Необходимо присвоить
	glPosition = vPosition;
}
