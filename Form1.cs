using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

using OpenTK;
using OpenTK.Graphics.OpenGL;

namespace shaderlabonly
{
    public partial class Form1 : System.Windows.Forms.Form
    {
        int ShaderProgramID;
        int VertexShaderID;
        int FragmentShaderID;

        float counter = 0.0f;
        float deltaTime = 0.0f;
        float changeRate = 0.001f;
        int myUniformLocation;
        int myUniformPosition;
        int iTime;

        Color BackgroundColor = Color.LightGreen;

        int[] vaoHandle = new int[1];

        public Form1()
        {
            InitializeComponent();
        }

        private void glControl1_Load(object sender, EventArgs e)
        {
            InitShaders();
            InitUniformVariable();
            CreateBuffers();
            SetupViewport();

            Application.Idle += Application_Idle;
        }

        private void InitUniformVariable()
        {
            myUniformLocation = GL.GetUniformLocation(ShaderProgramID, "myUniform");
            myUniformPosition = GL.GetUniformLocation(ShaderProgramID, "myUniformPosition");
            iTime = GL.GetUniformLocation(ShaderProgramID, "iTime");
        }

        private void SetupViewport()
        {
            // Viewport - устанавливает рамеры выводимой области
            GL.Viewport(0, 0, glControl1.Width, glControl1.Height);
            //GL.ClearColor(BackgroundColor);
            GL.MatrixMode(MatrixMode.Projection);
            GL.LoadIdentity();
            GL.Ortho(-1, 1, -1, 1, 0.0, 4.0);
        }

        private void glControl1_Paint(object sender, PaintEventArgs e)
        {
            Render();
        }

        private void Render()
        {
            counter += changeRate;
            label1.Text = counter.ToString();

            float messageVal = (float)(Math.Abs(Math.Sin(counter)));
            if (messageVal == 1)
                counter = 0;
            GL.Uniform1(myUniformPosition, messageVal * 2);
            
            GL.Uniform4(myUniformLocation, messageVal, 1 - messageVal, 1.0f, 1.0f);
            deltaTime += 0.001f;
            GL.Uniform1(iTime, deltaTime);
            


            GL.Clear(ClearBufferMask.ColorBufferBit);
 
            GL.BindVertexArray(vaoHandle[0]);
            GL.DrawArrays(PrimitiveType.Quads, 0, 4);
            
            glControl1.SwapBuffers();

        }

        void Application_Idle(object sender, EventArgs e)
        {
            while (glControl1.IsIdle)
            {
                glControl1.Refresh();
            }
        }

        private void glControl1_MouseMove(object sender, MouseEventArgs e)
        {
            label1.Text = "X: " + e.X.ToString() + " Y: " + e.Y.ToString();
        }

        private void Form1_Resize(object sender, EventArgs e)
        {
            glControl1.Width = this.Size.Width - 40;
            glControl1.Height = this.Size.Height - 60;
            glControl1_Resize(sender, e);
        }

        private void glControl1_Resize(object sender, EventArgs e)
        {
            SetupViewport();
        }

        private void LoadShader(String filename, ShaderType type, int program, out int address)
        {

            address = GL.CreateShader(type);
            using (System.IO.StreamReader sr = new System.IO.StreamReader(filename))
            {
                GL.ShaderSource(address, sr.ReadToEnd());
            }
            GL.CompileShader(address);
            GL.AttachShader(program, address);

            string ErrWrnLog = GL.GetShaderInfoLog(address);
            if (ErrWrnLog != "")
            {
                throw new Exception(ErrWrnLog);
            }
        }

        private void CreateBuffers()
        {
            // VBO - VERTEX BUFFER OBJECT

            float div = 0.0f;

            // Вершины фигуры
            var positionData = new float[] {  -1.0f      , -1.0f + div, 0.0f,
                                               1.0f - div, -1.0f      , 0.0f,
                                               1.0f      ,  1.0f - div, 0.0f,
                                              -1.0f + div,  1.0f,       0.0f  };

            var colorData = new float[] { 1.0f, 0.5f, 0.4f,
                                          0.5f, 1.0f, 0.0f,

                                          0.7f, 0.4f, 1.0f,
                                          0.8f, 0.2f, 1.0f  };


            int[] vboHandles = new int[2];
            // Создание нового VBO и сохранение идентификатора VBO
            GL.GenBuffers(2, vboHandles);

            int positionBufferHandle = vboHandles[0];
            int colorBufferHandle = vboHandles[1];

            // Установка активности VBO. Связывание буфера и вершин
            GL.BindBuffer(BufferTarget.ArrayBuffer, positionBufferHandle);
            // Создает и инициализирует VBO
            GL.BufferData( BufferTarget.ArrayBuffer, new IntPtr(positionData.Length * sizeof(float)), positionData, BufferUsageHint.StaticDraw);

            //Fill color buffer
            GL.BindBuffer(BufferTarget.ArrayBuffer, colorBufferHandle);
            GL.BufferData(BufferTarget.ArrayBuffer, new IntPtr(positionData.Length * sizeof(float)), colorData, BufferUsageHint.StaticDraw);

            // VAO - VERTEX ARRAYS OBJECT
            GL.GenVertexArrays(1, vaoHandle);
            GL.BindVertexArray(vaoHandle[0]);

            // Activate arrays of vertex attribs
            GL.EnableVertexAttribArray(0);
            GL.EnableVertexAttribArray(1);

            // Закрепить индекс 0 за буфером с координатами
            GL.BindBuffer(BufferTarget.ArrayBuffer, positionBufferHandle);
            GL.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 0, 0);

            // Закрепить индекс 1 за буфером с координатами
            GL.BindBuffer(BufferTarget.ArrayBuffer, colorBufferHandle);
            GL.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 0, 0);
        }

        private bool InitShaders()
        {
            ShaderProgramID = GL.CreateProgram();
            LoadShader("..\\..\\Shader\\raytracing.vert", ShaderType.VertexShader, ShaderProgramID, out VertexShaderID);
            LoadShader("..\\..\\Shader\\raytracing.frag", ShaderType.FragmentShader, ShaderProgramID, out FragmentShaderID);
            GL.LinkProgram(ShaderProgramID);
            Console.WriteLine(GL.GetProgramInfoLog(ShaderProgramID));
            GL.UseProgram(ShaderProgramID);

            return true;
        }
    }
}
