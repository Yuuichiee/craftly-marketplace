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

    // ── 1. APPLE / LINEAR LUXURY METALLIC STARS (ZERO PURPLE CIRCLES) ──
    const stars = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.4, // Micro tiny sizes
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        // Apple/Linear Palette: Pure White, Platinum, Muted Slate Titanium
        color: Math.random() > 0.4 ? "#ffffff" : Math.random() > 0.5 ? "#f1f5f9" : "#94a3b8",
        isGeminiSparkle: Math.random() > 0.5,
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
      if (Math.random() < 0.018 && shootingStars.length < 2) {
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

      // Deep Apple Space Black Obsidian Void background
      ctx.fillStyle = "#040407";
      ctx.fillRect(0, 0, width, height);

      // ── DRAW TINY GEMINI LUXURY STARS ──
      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.2) s.twinkleSpeed = -s.twinkleSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;

        if (s.isGeminiSparkle) {
          drawGeminiSparkle(ctx, s.x, s.y, s.size * 1.4);
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
        trailGrad.addColorStop(0.5, "rgba(241, 245, 249, 0.6)");
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

/**
 * UniverseBackground.jsx — Global Dark Universe Canvas Background
 * 
 * Where it is used:
 *   - App.jsx (renders globally behind all pages)
 * 
 * What it renders:
 *   - 200 twinkling 4-pointed Gemini sparkle stars (✦)
 *   - Deep space dark background (#050508) with background shooting stars.
 */