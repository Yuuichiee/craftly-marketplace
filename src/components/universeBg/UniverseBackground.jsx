import React, { useEffect, useRef } from "react";
import "./UniverseBackground.scss";

const UniverseBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // ── 1. TINY GEMINI 4-POINT SPARKLE STARS ──
    const stars = [];
    const numStars = 220;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.6, // Super tiny size (0.6px to 2.2px)
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.4 ? "#ffffff" : Math.random() > 0.5 ? "#d8b4fe" : "#7dd3fc",
        isGeminiSparkle: Math.random() > 0.4, // 60% of stars are 4-pointed Gemini sparkles
      });
    }

    // Helper: Draw 4-pointed Gemini Sparkle Shape (✦)
    const drawGeminiSparkle = (context, x, y, size) => {
      context.beginPath();
      context.moveTo(x, y - size);
      context.quadraticCurveTo(x, y, x + size, y);
      context.quadraticCurveTo(x, y, x, y + size);
      context.quadraticCurveTo(x, y, x - size, y);
      context.quadraticCurveTo(x, y, x, y - size);
      context.closePath();
      context.fill();
    };

    // ── 2. RECURRING SHOOTING STARS ──
    const shootingStars = [];

    const spawnShootingStar = () => {
      if (Math.random() < 0.02 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          len: Math.random() * 70 + 35,
          speed: Math.random() * 12 + 8,
          angle: Math.PI / 4,
          alpha: 0.9,
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark void background
      ctx.fillStyle = "#020205";
      ctx.fillRect(0, 0, width, height);

      // ── DRAW TINY GEMINI STARS ──
      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.2) s.twinkleSpeed = -s.twinkleSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;

        if (s.isGeminiSparkle) {
          drawGeminiSparkle(ctx, s.x, s.y, s.size * 1.5);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // ── DRAW SHOOTING STARS ──
      spawnShootingStar();
      for (let i = 0; i < shootingStars.length; i++) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.02;

        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          i--;
          continue;
        }

        ctx.save();
        ctx.globalAlpha = ss.alpha;
        const trailGrad = ctx.createLinearGradient(
          ss.x,
          ss.y,
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y - Math.sin(ss.angle) * ss.len
        );
        trailGrad.addColorStop(0, "#ffffff");
        trailGrad.addColorStop(0.5, "rgba(125, 211, 252, 0.6)");
        trailGrad.addColorStop(1, "transparent");

        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="universe-bg-canvas" />;
};

export default UniverseBackground;
