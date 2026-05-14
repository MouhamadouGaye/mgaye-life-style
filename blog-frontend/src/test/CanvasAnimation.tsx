import { useEffect, useRef } from "react";

const CanvasAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let x = 50;
    let y = 50;
    let dx = 2; // vitesse horizontale
    let dy = 2; // vitesse verticale
    const radius = 20;

    const draw = () => {
      // Effacer le canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner la balle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.closePath();

      // Rebond sur les bords
      if (x + dx > canvas.width - radius || x + dx < radius) {
        dx = -dx;
      }
      if (y + dy > canvas.height - radius || y + dy < radius) {
        dy = -dy;
      }

      // Mettre à jour la position
      x += dx;
      y += dy;

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      style={{ border: "1px solid black" }}
    />
  );
};

export default CanvasAnimation;
