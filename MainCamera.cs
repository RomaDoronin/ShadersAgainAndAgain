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
    class MainCamera
    {
        /// <summary>
        /// Позиция камеры
        /// </summary>
        public Vector3 Position { get; set; }
        /// <summary>
        /// Направление камеры
        /// </summary>
        public Vector3 Directon { get; set; }
        /// <summary>
        /// Нормаль камеры
        /// </summary>
        public Vector3 Up { get; set; }

        public void Init()
        {
            Position = new Vector3(2, 3, 4);
            Directon = new Vector3(0, 0, 0);
            Up = new Vector3(0, 0, 1);
        }
    }
}
