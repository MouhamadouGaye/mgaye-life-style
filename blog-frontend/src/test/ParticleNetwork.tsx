// // // // // import { useEffect, useRef } from "react";

// // // // // type Particle = {
// // // // //   x: number;
// // // // //   y: number;
// // // // //   dx: number;
// // // // //   dy: number;
// // // // // };

// // // // // const ParticleNetwork: React.FC = () => {
// // // // //   const canvasRef = useRef<HTMLCanvasElement | null>(null);

// // // // //   useEffect(() => {
// // // // //     const canvas = canvasRef.current!;
// // // // //     const ctx = canvas.getContext("2d")!;

// // // // //     const particles: Particle[] = [];
// // // // //     const PARTICLE_COUNT = 60;
// // // // //     const MAX_DIST = 120;

// // // // //     canvas.width = window.innerWidth;
// // // // //     canvas.height = window.innerHeight;

// // // // //     // Init particules
// // // // //     for (let i = 0; i < PARTICLE_COUNT; i++) {
// // // // //       particles.push({
// // // // //         x: Math.random() * canvas.width,
// // // // //         y: Math.random() * canvas.height,
// // // // //         dx: (Math.random() - 0.5) * 1.5,
// // // // //         dy: (Math.random() - 0.5) * 1.5,
// // // // //       });
// // // // //     }

// // // // //     const draw = () => {
// // // // //       ctx.clearRect(0, 0, canvas.width, canvas.height);

// // // // //       // Dessiner les particules
// // // // //       particles.forEach((p) => {
// // // // //         ctx.beginPath();
// // // // //         ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
// // // // //         ctx.fillStyle = "white";
// // // // //         ctx.fill();
// // // // //       });

// // // // //       // Dessiner les lignes
// // // // //       for (let i = 0; i < particles.length; i++) {
// // // // //         for (let j = i + 1; j < particles.length; j++) {
// // // // //           const dx = particles[i].x - particles[j].x;
// // // // //           const dy = particles[i].y - particles[j].y;
// // // // //           const dist = Math.sqrt(dx * dx + dy * dy);

// // // // //           if (dist < MAX_DIST) {
// // // // //             ctx.beginPath();
// // // // //             ctx.moveTo(particles[i].x, particles[i].y);
// // // // //             ctx.lineTo(particles[j].x, particles[j].y);
// // // // //             ctx.strokeStyle = `rgba(0, 150, 255, ${1 - dist / MAX_DIST})`;
// // // // //             ctx.stroke();
// // // // //           }
// // // // //         }
// // // // //       }

// // // // //       // Update positions
// // // // //       particles.forEach((p) => {
// // // // //         p.x += p.dx;
// // // // //         p.y += p.dy;

// // // // //         // rebond
// // // // //         if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
// // // // //         if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
// // // // //       });

// // // // //       requestAnimationFrame(draw);
// // // // //     };

// // // // //     draw();
// // // // //   }, []);

// // // // //   return (
// // // // //     <canvas ref={canvasRef} style={{ display: "block", background: "black" }} />
// // // // //   );
// // // // // };

// // // // // export default ParticleNetwork;

// // // // import { useEffect, useRef } from "react";

// // // // type Particle = {
// // // //   x: number;
// // // //   y: number;
// // // //   dx: number;
// // // //   dy: number;
// // // //   state: number; // 0 ou 1
// // // //   nextState: number;
// // // // };

// // // // const ParticleNetwork: React.FC = () => {
// // // //   const canvasRef = useRef<HTMLCanvasElement | null>(null);

// // // //   useEffect(() => {
// // // //     const canvas = canvasRef.current!;
// // // //     const ctx = canvas.getContext("2d")!;

// // // //     const PARTICLE_COUNT = 80;
// // // //     const MAX_DIST = 100;

// // // //     const particles: Particle[] = [];

// // // //     canvas.width = window.innerWidth;
// // // //     canvas.height = window.innerHeight;

// // // //     // 🔹 Initialisation
// // // //     for (let i = 0; i < PARTICLE_COUNT; i++) {
// // // //       particles.push({
// // // //         x: Math.random() * canvas.width,
// // // //         y: Math.random() * canvas.height,
// // // //         dx: (Math.random() - 0.5) * 1.2,
// // // //         dy: (Math.random() - 0.5) * 1.2,
// // // //         state: 0,
// // // //         nextState: 0,
// // // //       });
// // // //     }

// // // //     // 🔥 sources de signal (2 particules "input")
// // // //     const inputA = particles[0];
// // // //     const inputB = particles[1];

// // // //     let tick = 0;

// // // //     const draw = () => {
// // // //       ctx.clearRect(0, 0, canvas.width, canvas.height);

// // // //       tick++;

// // // //       // 🔹 on injecte un signal périodique (comme un CPU clock)
// // // //       inputA.state = tick % 60 < 30 ? 1 : 0;
// // // //       inputB.state = tick % 90 < 45 ? 1 : 0;

// // // //       let globalSum = 0;

// // // //       // 🔹 CALCUL : propagation type "porte OR locale"
// // // //       for (let i = 0; i < particles.length; i++) {
// // // //         const p = particles[i];

// // // //         let active = p.state;

// // // //         for (let j = 0; j < particles.length; j++) {
// // // //           if (i === j) continue;

// // // //           const q = particles[j];

// // // //           const dx = p.x - q.x;
// // // //           const dy = p.y - q.y;
// // // //           const dist = Math.sqrt(dx * dx + dy * dy);

// // // //           if (dist < MAX_DIST && q.state === 1) {
// // // //             active = 1; // 🔥 propagation logique (OR spatial)
// // // //           }
// // // //         }

// // // //         p.nextState = active;
// // // //       }

// // // //       // 🔹 appliquer les nouveaux états + mouvement
// // // //       for (const p of particles) {
// // // //         p.state = p.nextState;

// // // //         p.x += p.dx;
// // // //         p.y += p.dy;

// // // //         if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
// // // //         if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

// // // //         globalSum += p.state;

// // // //         // draw particle
// // // //         ctx.beginPath();
// // // //         ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
// // // //         ctx.fillStyle = p.state === 1 ? "cyan" : "rgba(255,255,255,0.15)";
// // // //         ctx.fill();
// // // //       }

// // // //       // 🔹 connexions
// // // //       for (let i = 0; i < particles.length; i++) {
// // // //         for (let j = i + 1; j < particles.length; j++) {
// // // //           const a = particles[i];
// // // //           const b = particles[j];

// // // //           const dx = a.x - b.x;
// // // //           const dy = a.y - b.y;
// // // //           const dist = Math.sqrt(dx * dx + dy * dy);

// // // //           if (dist < MAX_DIST) {
// // // //             ctx.beginPath();
// // // //             ctx.moveTo(a.x, a.y);
// // // //             ctx.lineTo(b.x, b.y);

// // // //             const alpha = 1 - dist / MAX_DIST;
// // // //             ctx.strokeStyle = `rgba(0, 150, 255, ${alpha * 0.4})`;
// // // //             ctx.stroke();
// // // //           }
// // // //         }
// // // //       }

// // // //       // 🔹 OUTPUT (résultat du calcul global)
// // // //       const avg = globalSum / particles.length;

// // // //       ctx.fillStyle = "white";
// // // //       ctx.font = "18px monospace";
// // // //       ctx.fillText(`Signal global: ${avg.toFixed(2)}`, 20, 40);

// // // //       // couleur globale du système = résultat du calcul
// // // //       canvas.style.background = `rgba(0, 0, 0, ${0.2 + avg * 0.5})`;

// // // //       requestAnimationFrame(draw);
// // // //     };

// // // //     draw();
// // // //   }, []);

// // // //   return <canvas ref={canvasRef} style={{ display: "block" }} />;
// // // // };

// // // // export default ParticleNetwork;

// // // import { useEffect, useRef } from "react";

// // // type Particle = {
// // //   x: number;
// // //   y: number;
// // //   targetX: number;
// // //   targetY: number;
// // // };

// // // const ParticleLaptop: React.FC = () => {
// // //   const canvasRef = useRef<HTMLCanvasElement | null>(null);

// // //   useEffect(() => {
// // //     const canvas = canvasRef.current!;
// // //     const ctx = canvas.getContext("2d")!;

// // //     canvas.width = window.innerWidth;
// // //     canvas.height = window.innerHeight;

// // //     const particles: Particle[] = [];

// // //     // 🧠 générer une forme de laptop (points cibles)
// // //     const targets: { x: number; y: number }[] = [];

// // //     // écran
// // //     for (let i = 0; i < 80; i++) {
// // //       const t = i / 80;
// // //       targets.push({ x: 300 + t * 400, y: 150 });
// // //       targets.push({ x: 300 + t * 400, y: 300 });
// // //     }

// // //     for (let i = 0; i < 80; i++) {
// // //       const t = i / 80;
// // //       targets.push({ x: 300, y: 150 + t * 150 });
// // //       targets.push({ x: 700, y: 150 + t * 150 });
// // //     }

// // //     // clavier
// // //     for (let i = 0; i < 120; i++) {
// // //       const t = i / 120;
// // //       targets.push({ x: 280 + t * 440, y: 380 });
// // //       targets.push({ x: 280 + t * 440, y: 460 });
// // //     }

// // //     // 🧪 init particules random
// // //     for (let i = 0; i < targets.length; i++) {
// // //       particles.push({
// // //         x: Math.random() * canvas.width,
// // //         y: Math.random() * canvas.height,
// // //         targetX: targets[i].x,
// // //         targetY: targets[i].y,
// // //       });
// // //     }

// // //     const draw = () => {
// // //       ctx.clearRect(0, 0, canvas.width, canvas.height);

// // //       // 🧠 animation + dessin
// // //       for (const p of particles) {
// // //         // mouvement vers cible
// // //         p.x += (p.targetX - p.x) * 0.05;
// // //         p.y += (p.targetY - p.y) * 0.05;

// // //         // particules
// // //         ctx.beginPath();
// // //         ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
// // //         ctx.fillStyle = "cyan";
// // //         ctx.fill();
// // //       }

// // //       // 🔗 lignes entre proches (structure wireframe)
// // //       for (let i = 0; i < particles.length; i++) {
// // //         for (let j = i + 1; j < particles.length; j++) {
// // //           const a = particles[i];
// // //           const b = particles[j];

// // //           const dx = a.x - b.x;
// // //           const dy = a.y - b.y;
// // //           const dist = Math.sqrt(dx * dx + dy * dy);

// // //           if (dist < 40) {
// // //             ctx.beginPath();
// // //             ctx.moveTo(a.x, a.y);
// // //             ctx.lineTo(b.x, b.y);
// // //             ctx.strokeStyle = "rgba(0,200,255,0.2)";
// // //             ctx.stroke();
// // //           }
// // //         }
// // //       }

// // //       requestAnimationFrame(draw);
// // //     };

// // //     draw();
// // //   }, []);

// // //   return <canvas ref={canvasRef} style={{ background: "black" }} />;
// // // };

// // // export default ParticleLaptop;

// // import { useEffect, useRef } from "react";

// // type Particle = {
// //   x: number;
// //   y: number;
// //   targetX: number;
// //   targetY: number;
// // };

// // const ParticleLaptop: React.FC = () => {
// //   const canvasRef = useRef<HTMLCanvasElement | null>(null);

// //   useEffect(() => {
// //     const canvas = canvasRef.current!;
// //     const ctx = canvas.getContext("2d")!;

// //     const resize = () => {
// //       canvas.width = window.innerWidth;
// //       canvas.height = window.innerHeight;
// //     };

// //     resize();
// //     window.addEventListener("resize", resize);

// //     const particles: Particle[] = [];
// //     const targets: { x: number; y: number }[] = [];

// //     // 🧠 centre canvas
// //     const cx = canvas.width / 2;
// //     const cy = canvas.height / 2;

// //     // 💻 dimensions laptop
// //     const screenW = 420;
// //     const screenH = 260;

// //     const baseW = 520;
// //     const baseH = 80;

// //     // =========================
// //     // 📺 ÉCRAN
// //     // =========================

// //     for (let i = 0; i < 120; i++) {
// //       const t = i / 120;

// //       // haut écran
// //       targets.push({
// //         x: cx - screenW / 2 + t * screenW,
// //         y: cy - 180,
// //       });

// //       // bas écran
// //       targets.push({
// //         x: cx - screenW / 2 + t * screenW,
// //         y: cy + screenH - 180,
// //       });
// //     }

// //     for (let i = 0; i < 80; i++) {
// //       const t = i / 80;

// //       // côtés écran
// //       targets.push({
// //         x: cx - screenW / 2,
// //         y: cy - 180 + t * screenH,
// //       });

// //       targets.push({
// //         x: cx + screenW / 2,
// //         y: cy - 180 + t * screenH,
// //       });
// //     }

// //     // =========================
// //     // 💻 BASE (clavier)
// //     // =========================

// //     for (let i = 0; i < 160; i++) {
// //       const t = i / 160;

// //       // haut base (charnière)
// //       targets.push({
// //         x: cx - baseW / 2 + t * baseW,
// //         y: cy + 120,
// //       });

// //       // bas base
// //       targets.push({
// //         x: cx - baseW / 2 + t * baseW,
// //         y: cy + 120 + baseH,
// //       });
// //     }

// //     for (let i = 0; i < 100; i++) {
// //       const t = i / 100;

// //       // côtés base
// //       targets.push({
// //         x: cx - baseW / 2,
// //         y: cy + 120 + t * baseH,
// //       });

// //       targets.push({
// //         x: cx + baseW / 2,
// //         y: cy + 120 + t * baseH,
// //       });
// //     }

// //     // =========================
// //     // 🖱️ TRACKPAD
// //     // =========================

// //     for (let i = 0; i < 60; i++) {
// //       const t = i / 60;

// //       targets.push({
// //         x: cx - 60 + t * 120,
// //         y: cy + 220,
// //       });

// //       targets.push({
// //         x: cx - 60 + t * 120,
// //         y: cy + 270,
// //       });
// //     }

// //     // =========================
// //     // 🧪 INIT PARTICULES
// //     // =========================

// //     for (let i = 0; i < targets.length; i++) {
// //       particles.push({
// //         x: Math.random() * canvas.width,
// //         y: Math.random() * canvas.height,
// //         targetX: targets[i].x,
// //         targetY: targets[i].y,
// //       });
// //     }

// //     // =========================
// //     // 🎬 ANIMATION LOOP
// //     // =========================

// //     const draw = () => {
// //       ctx.clearRect(0, 0, canvas.width, canvas.height);

// //       // fond léger (optionnel glow)
// //       ctx.fillStyle = "transparent";
// //       ctx.fillRect(0, 0, canvas.width, canvas.height);

// //       // ✨ particules
// //       for (const p of particles) {
// //         p.x += (p.targetX - p.x) * 0.06;
// //         p.y += (p.targetY - p.y) * 0.06;

// //         ctx.beginPath();
// //         ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
// //         ctx.fillStyle = "cyan";
// //         ctx.fill();
// //       }

// //       // 🔗 connexions légères
// //       for (let i = 0; i < particles.length; i++) {
// //         for (let j = i + 1; j < particles.length; j++) {
// //           const a = particles[i];
// //           const b = particles[j];

// //           const dx = a.x - b.x;
// //           const dy = a.y - b.y;
// //           const dist = Math.sqrt(dx * dx + dy * dy);

// //           if (dist < 35) {
// //             ctx.beginPath();
// //             ctx.moveTo(a.x, a.y);
// //             ctx.lineTo(b.x, b.y);
// //             ctx.strokeStyle = "rgba(0,200,255,0.15)";
// //             ctx.stroke();
// //           }
// //         }
// //       }

// //       requestAnimationFrame(draw);
// //     };

// //     draw();

// //     return () => window.removeEventListener("resize", resize);
// //   }, []);

// //   return (
// //     <canvas
// //       ref={canvasRef}
// //       style={{ width: "50%", backgroundColor: "transparent", display: "block" }}
// //     />
// //   );
// // };

// // export default ParticleLaptop;
// import { useEffect, useRef } from "react";

// type Particle = {
//   x: number;
//   y: number;
//   targetX: number;
//   targetY: number;
// };

// const ParticleLaptop: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current!;
//     const ctx = canvas.getContext("2d")!;

//     const resize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     resize();
//     window.addEventListener("resize", resize);

//     const particles: Particle[] = [];
//     const targets: { x: number; y: number }[] = [];

//     const cx = () => canvas.width / 2;
//     const cy = () => canvas.height / 2;

//     const screenW = 380;
//     const screenH = 240;

//     const baseW = 520;
//     const baseH = 160;

//     // =========================
//     // 💻 ÉCRAN (propre rectangle)
//     // =========================

//     for (let i = 0; i < 140; i++) {
//       const t = i / 140;

//       // haut
//       targets.push({
//         x: cx() - screenW / 2 + t * screenW,
//         y: cy() - 160,
//       });

//       // bas
//       targets.push({
//         x: cx() - screenW / 2 + t * screenW,
//         y: cy() + screenH - 160,
//       });
//     }

//     for (let i = 0; i < 100; i++) {
//       const t = i / 100;

//       // côtés
//       targets.push({
//         x: cx() - screenW / 2,
//         y: cy() - 160 + t * screenH,
//       });

//       targets.push({
//         x: cx() + screenW / 2,
//         y: cy() - 160 + t * screenH,
//       });
//     }

//     // =========================
//     // 💻 BASE (clavier réel)
//     // =========================

//     for (let i = 0; i < 180; i++) {
//       const t = i / 180;

//       targets.push({
//         x: cx() - baseW / 2 + t * baseW,
//         y: cy() + 120,
//       });

//       targets.push({
//         x: cx() - baseW / 2 + t * baseW,
//         y: cy() + 120 + baseH,
//       });
//     }

//     for (let i = 0; i < 120; i++) {
//       const t = i / 120;

//       targets.push({
//         x: cx() - baseW / 2,
//         y: cy() + 120 + t * baseH,
//       });

//       targets.push({
//         x: cx() + baseW / 2,
//         y: cy() + 120 + t * baseH,
//       });
//     }

//     // =========================
//     // 🖱️ TRACKPAD
//     // =========================

//     for (let i = 0; i < 80; i++) {
//       const t = i / 80;

//       targets.push({
//         x: cx() - 70 + t * 140,
//         y: cy() + 200,
//       });

//       targets.push({
//         x: cx() - 70 + t * 140,
//         y: cy() + 260,
//       });
//     }

//     // =========================
//     // 🧪 PARTICULES
//     // =========================

//     for (let i = 0; i < targets.length; i++) {
//       particles.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         targetX: targets[i].x,
//         targetY: targets[i].y,
//       });
//     }

//     // =========================
//     // 🎬 DRAW
//     // =========================

//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // fond propre
//       ctx.fillStyle = "#000";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // particules
//       for (const p of particles) {
//         p.x += (p.targetX - p.x) * 0.07;
//         p.y += (p.targetY - p.y) * 0.07;

//         ctx.beginPath();
//         ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
//         ctx.fillStyle = "cyan";
//         ctx.fill();
//       }

//       requestAnimationFrame(draw);
//     };

//     draw();

//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   return <canvas ref={canvasRef} style={{ display: "block" }} />;
// };

// export default ParticleLaptop;
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
};

const ParticleLaptop: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    const targets: { x: number; y: number }[] = [];

    const cx = () => canvas.width / 2;
    const cy = () => canvas.height / 2;

    // =========================
    // 💻 LAYOUT UNIFIÉ
    // =========================

    const screenWTop = 260;
    const screenWBottom = 420;
    const screenH = 200;

    const baseWTop = 340;
    const baseWBottom = 520;
    const baseH = 170;

    // 🔥 rapprochement écran/base (IMPORTANT)
    const screenY = cy() - 140;
    const baseY = screenY + screenH - 10; // charnière commune

    // =========================
    // 📺 ÉCRAN
    // =========================

    for (let i = 0; i < 120; i++) {
      const t = i / 120;

      const topX = cx() - screenWTop / 2 + t * screenWTop;
      const bottomX = cx() - screenWBottom / 2 + t * screenWBottom;

      targets.push({ x: topX, y: screenY });
      targets.push({ x: bottomX, y: screenY + screenH });
    }

    for (let i = 0; i < 60; i++) {
      const t = i / 60;

      targets.push({
        x: cx() - screenWTop / 2,
        y: screenY + t * screenH,
      });

      targets.push({
        x: cx() + screenWTop / 2,
        y: screenY + t * screenH,
      });
    }

    // =========================
    // 🔗 CHARNIÈRE (clé pour éviter "2 objets")
    // =========================

    for (let i = 0; i < 60; i++) {
      const t = i / 60;

      targets.push({
        x: cx() - 120 + t * 240,
        y: baseY,
      });
    }

    // =========================
    // 💻 BASE
    // =========================

    for (let i = 0; i < 140; i++) {
      const t = i / 140;

      const topX = cx() - baseWTop / 2 + t * baseWTop;
      const bottomX = cx() - baseWBottom / 2 + t * baseWBottom;

      targets.push({ x: topX, y: baseY });
      targets.push({ x: bottomX, y: baseY + baseH });
    }

    for (let i = 0; i < 80; i++) {
      const t = i / 80;

      targets.push({
        x: cx() - baseWTop / 2,
        y: baseY + t * baseH,
      });

      targets.push({
        x: cx() + baseWTop / 2,
        y: baseY + t * baseH,
      });
    }

    // =========================
    // 🧪 PARTICULES
    // =========================

    for (let i = 0; i < targets.length; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: targets[i].x,
        targetY: targets[i].y,
      });
    }

    // =========================
    // 🎬 ANIMATION
    // =========================

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += (p.targetX - p.x) * 0.06;
        p.y += (p.targetY - p.y) * 0.06;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#00f6ff";
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default ParticleLaptop;
