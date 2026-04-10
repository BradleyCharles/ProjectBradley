"use client";

import { useEffect, useRef } from "react";

const ACCENT_COLORS = ["#d4916a", "#e0bc5a", "#6ab8e0", "#b07fec"];

export default function ArtistCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Drop = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      pulseOffset: number;
    };

    const drops: Drop[] = Array.from({ length: 28 }, () => {
      const base = Math.random() * 6 + 3;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: base,
        baseRadius: base,
        color: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
        alpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    });

    let tick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      for (const d of drops) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

        // Gentle pulse
        d.radius =
          d.baseRadius +
          Math.sin(tick * d.pulseSpeed + d.pulseOffset) * d.baseRadius * 0.4;

        // Outer glow
        const glow = ctx.createRadialGradient(
          d.x, d.y, 0,
          d.x, d.y, d.radius * 3.5
        );
        glow.addColorStop(0, `${d.color}${Math.round(d.alpha * 255).toString(16).padStart(2, "0")}`);
        glow.addColorStop(1, `${d.color}00`);

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core drop
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = d.color +
          Math.round((d.alpha + 0.2) * 255).toString(16).padStart(2, "0");
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
