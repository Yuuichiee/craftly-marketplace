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

    // ── 1. ULTRA-SHINY TWINKLING STARS (NO PLANETS / NO BALLS) ──
    const stars = [];
    const numStars = 320;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        color: Math.random() > 0.3 ? "#ffffff" : Math.random() > 0.5 ? "#c084fc" : "#38bdf8",
      });
    }

    // ── 2. RECURRING SHOOTING STARS ──
    const shootingStars = [];

    const spawnShootingStar = () => {
      if (Math.random() < 0.025 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          len: Math.random() * 90 + 50,
          speed: Math.random() * 14 + 10,
          angle: Math.PI / 4, // 45 degrees
          alpha: 1,
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Pitch-dark void background
      ctx.fillStyle = "#010104";
      ctx.fillRect(0, 0, width, height);

      // ── DRAW SHINY TWINKLING STARS ──
      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.3) s.twinkleSpeed = -s.twinkleSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0.2, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;

        // Shiny star glow halo
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.radius * 6;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ── DRAW SHOOTING STARS ──
      spawnShootingStar();
      for (let i = 0; i < shootingStars.length; i++) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.018;

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
        trailGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.8)");
        trailGrad.addColorStop(1, "transparent");

        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10;
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
