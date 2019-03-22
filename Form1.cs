using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace shaderlabonly
{
    public partial class Form1 : System.Windows.Forms.Form
    {
        private GLGraphics glGraphics = new GLGraphics();

        public Form1()
        {
            InitializeComponent();
        }

        private void glControl1_Load(object sender, EventArgs e)
        {
            glGraphics.Start(glControl1.Width, glControl1.Height);
            Application.Idle += Application_Idle;
        }

        private void glControl1_Paint(object sender, PaintEventArgs e)
        {
            glGraphics.Update();
            glControl1.SwapBuffers();
        }

        void Application_Idle(object sender, EventArgs e)
        {
            while (glControl1.IsIdle)
                glControl1.Refresh();
        }

        private void glControl1_MouseMove(object sender, MouseEventArgs e)
        {
            float widthCoef = (e.X - glControl1.Width * 0.5f) / (float)glControl1.Width;
            float heightCoef = (-e.Y + glControl1.Height * 0.5f) / (float)glControl1.Height;
            glGraphics.SetLatitude(heightCoef * 180);
            glGraphics.SetLongitude(widthCoef * 360);
        }
    }
}
