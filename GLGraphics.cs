using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenTK;
using OpenTK.Graphics.OpenGL;
using System.Drawing;
using System.Drawing.Imaging;
using System.Threading;

namespace shaderlabonly
{
    class GLGraphics
    {
        // Поля класса --------------------------------------------------------
        public MainCamera mainCamera;
        public float addVal = 0.01f;

        /// <summary>
        /// Широта
        /// </summary>
        private float latitude;
        /// <summary>
        /// Долгата
        /// </summary>
        private float longitude;
        /// <summary>
        /// Радиус
        /// </summary>
        private float radius;

        int ShaderProgramID;
        int VertexShaderID;
        int FragmentShaderID;

        int[] vaoHandle = new int[1];

        // Setters and Getters ------------------------------------------------
        public void SetLatitude(float val)
        {
            latitude = val;
        }
        public float GetLatitude()
        {
            return latitude;
        }

        public void SetLongitude(float val)
        {
            longitude = val;
        }
        public float GetLongitude()
        {
            return longitude;
        }

        public void SetRadius(float val)
        {
            radius = val;
        }
        public float GetRadius()
        {
            return radius;
        }

        // Методы класса ------------------------------------------------------
        /// <summary>
        /// Инициализирует начальное состояние сцены
        /// </summary>
        /// <param name="width">Ширина буфера</param>
        /// <param name="height">Высота буфера</param>
        public void Start(int width, int height)
        {
            // Инициализация полей
            mainCamera = new MainCamera();
            mainCamera.Init();

            latitude = 47.98f;
            longitude = 60.41f;
            radius = 5.385f;

            // Заливаем буфер экрана одним цветом
            GL.ClearColor(Color.DarkGray);
            // Устанавливаем тип отрисовки полигонов с оттенками
            GL.ShadeModel(ShadingModel.Smooth);
            // Включаем буфер глубины
            GL.Enable(EnableCap.DepthTest);

            // Создает матрицу проекции. Настраивает ее согласно по размерам окна и загружает в контекст OpenGL
            // Матрица перспективы
            Matrix4 perspectiveMat = Matrix4.CreatePerspectiveFieldOfView(
                MathHelper.PiOver4,
                width / (float)height, 1, 64);
            GL.MatrixMode(MatrixMode.Projection); // Projection - проекция
            GL.LoadMatrix(ref perspectiveMat);

            SetupLightint();
        }

        public Vector3 TestVector { get; set; }

        /// <summary>
        /// Функция вызывающаяся каждый фрейм
        /// </summary>
        public void Update()
        {
            addVal += 0.01f;

            // Отчищаем буфер
            GL.Clear(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit);

            TestVector = new Vector3(
                (float)(radius * Math.Cos(Math.PI / 180.0f * latitude) * Math.Cos(Math.PI / 180.0f * longitude)),
                (float)(radius * Math.Cos(Math.PI / 180.0f * latitude) * Math.Sin(Math.PI / 180.0f * longitude)),
                (float)(radius * Math.Sin(Math.PI / 180.0f * latitude)));

            // Вычисление позиции интерактивной камеры
            mainCamera.Position = new Vector3(
                (float)(radius * Math.Cos(Math.PI / 180.0f * latitude) * Math.Cos(Math.PI / 180.0f * longitude)),
                (float)(radius * Math.Cos(Math.PI / 180.0f * latitude) * Math.Sin(Math.PI / 180.0f * longitude)),
                (float)(radius * Math.Sin(Math.PI / 180.0f * latitude)));
            

            // Настройка камеры
            Matrix4 viewMat = Matrix4.LookAt(mainCamera.Position, mainCamera.Directon, mainCamera.Up);
            GL.MatrixMode(MatrixMode.Modelview);
            GL.LoadMatrix(ref viewMat);

            // Отрисовка
            Render();
        }

        /// <summary>
        /// Функция отрисовывает объекты
        /// </summary>
        public void Render()
        {
            List<Vector3> vertexList = new List<Vector3>() {
                new Vector3(-1, -1, -1), new Vector3(-1,  1, -1),
                new Vector3( 1,  1, -1), new Vector3( 1, -1, -1) };
            List<Color> colorList = new List<Color>() {
                Color.Blue, Color.Red, Color.Yellow, Color.Green };

            DrawTestQuad(vertexList, colorList);
        }

        /// <summary>
        /// Функция рисует квадрат
        /// </summary>
        /// <param name="vertexList">Массив вершин квадрата</param>
        /// <param name="colorList">Массив цветов вершин квадрата</param>
        private void DrawTestQuad(List<Vector3> vertexList, List<Color> colorList)
        {
            GL.Begin(PrimitiveType.Quads);

            for (int i = 0; i < vertexList.Count; i++)
            {
                GL.Color3(colorList[i]);
                GL.Vertex3(vertexList[i]);
            }

            GL.End();
        }

        private void SetupLightint()
        {
            GL.Enable(EnableCap.Lighting);
            GL.Enable(EnableCap.Light0);
            GL.Enable(EnableCap.ColorMaterial);
            Vector4 lightPosition = new Vector4(1.0f, 1.0f, 4.0f, 0.0f);
            GL.Light(LightName.Light0, LightParameter.Position, lightPosition);
            Vector4 ambientColor = new Vector4(0.2f, 0.2f, 0.2f, 1.0f);
            GL.Light(LightName.Light0, LightParameter.Ambient, ambientColor);
            Vector4 diffuseColor = new Vector4(0.6f, 0.6f, 0.6f, 1.0f);
            GL.Light(LightName.Light0, LightParameter.Diffuse, diffuseColor);

            Vector4 materialSpecular = new Vector4(1.0f, 1.0f, 1.0f, 1.0f);
            GL.Material(MaterialFace.Front, MaterialParameter.Specular, materialSpecular);
            float materialShininess = 100;
            GL.Material(MaterialFace.Front, MaterialParameter.Shininess, materialShininess);
        }

        // SHADER -------------------------------------------------------------
        public void LoadShader(String filename, ShaderType type, int program, out int adress)
        {
            adress = GL.CreateShader(type);
            using (System.IO.StreamReader sr = new System.IO.StreamReader(filename))
            {
                GL.ShaderSource(adress, sr.ReadToEnd());
            }
            GL.CompileShader(adress);
            GL.AttachShader(program, adress);
            Console.WriteLine(GL.GetShaderInfoLog(adress));
        }

        public void InitShaders()
        {
            int BasicProgramID = GL.CreateProgram();
            int BasicVertexShader;
            int BasicFragmentShader;

            LoadShader("..\\..\\raytracing.vert", ShaderType.VertexShader, BasicProgramID, out BasicVertexShader);
            LoadShader("..\\..\\raytracing.frag", ShaderType.FragmentShader, BasicProgramID, out BasicFragmentShader);

            GL.LinkProgram(BasicProgramID);
            int status = 0;
            GL.GetProgram(BasicProgramID, GetProgramParameterName.LinkStatus, out status);
            Console.WriteLine(GL.GetProgramInfoLog(BasicProgramID));
        }
    }
}
