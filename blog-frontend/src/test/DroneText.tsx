import { useEffect, useRef } from "react";
import { data } from "react-router-dom";

type Particle = {
  x: number;
  y: number;
  tx: number; // target x
  ty: number; // target y
};

const DroneText: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = 600;
    canvas.height = 200;

    // 1️⃣ Dessiner du texte invisible
    ctx.font = "bold 80px Arial";
    ctx.fillText("HI", 150, 120);

    // 2️⃣ Récupérer les pixels
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const particles: Particle[] = [];

    for (let y = 0; y < canvas.height; y += 6) {
      for (let x = 0; x < canvas.width; x += 6) {
        const index = (y * canvas.width + x) * 4;

        if (imageData.data[index + 3] > 128) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            tx: x,
            ty: y,
          });
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // mouvement vers la cible (effet drone)
        p.x += (p.tx - p.x) * 0.05;
        p.y += (p.ty - p.y) * 0.05;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "cyan";
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return <canvas ref={canvasRef} style={{ background: "black" }} />;
};

export default DroneText;
