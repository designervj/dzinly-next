import { useEffect, useRef } from "react";


type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type NeuralProps = {
  intensity?: number; // 0–1 controls speed/density
};

export default function NeuralNetworkVisualizer({ intensity = 0.7 }: NeuralProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || 300;

    canvas.width = width;
    canvas.height = height;

    const nodeCount = Math.round(40 + intensity * 60);
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (0.3 + intensity * 0.7),
        vy: (Math.random() - 0.5) * (0.3 + intensity * 0.7),
      });
    }

    const maxDistance = 140;
    const pulseChance = 0.005 + intensity * 0.01;

    const handleResize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || 300;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#020617");
      gradient.addColorStop(1, "#0b1120");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = 1 - dist / maxDistance;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.8})`;
            ctx.lineWidth = alpha * 1.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            if (Math.random() < pulseChance) {
              const t = Math.random();
              const px = a.x + (b.x - a.x) * t;
              const py = a.y + (b.y - a.y) * t;
              const radius = 3 + alpha * 4;

              const pulseGradient = ctx.createRadialGradient(
                px,
                py,
                0,
                px,
                py,
                radius * 3
              );
              pulseGradient.addColorStop(0, "rgba(56, 189, 248, 0.9)");
              pulseGradient.addColorStop(1, "rgba(56, 189, 248, 0)");

              ctx.fillStyle = pulseGradient;
              ctx.beginPath();
              ctx.arc(px, py, radius * 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      nodes.forEach((node) => {
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3.5, 0, Math.PI * 2);
        ctx.fill();

        const glowGradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          10
        );
        glowGradient.addColorStop(0, "rgba(56, 189, 248, 0.6)");
        glowGradient.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ filter: "brightness(1.1) contrast(1.1)" }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-between px-4 pb-3 text-xs text-slate-400">
        <span className="uppercase tracking-[.2em] text-sky-400/80">
          Neural Processing
        </span>
        <span className="text-slate-500">Diffusion Engine</span>
      </div>
    </div>
  );
}
