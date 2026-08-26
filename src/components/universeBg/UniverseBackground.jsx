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

    // ── 1. STRENGTHENED TWINKLING STARS ──
    const stars = [];
    const numStars = 250;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.3 ? "#ffffff" : Math.random() > 0.5 ? "#a855f7" : "#06b6d4",
      });
    }

    // ── 2. SHOOTING STARS / METEORS ──
    const shootingStars = [];

    const spawnShootingStar = () => {
      if (Math.random() < 0.03 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          len: Math.random() * 80 + 40,
          speed: Math.random() * 12 + 8,
          angle: Math.PI / 4, // 45 degrees
          alpha: 1,
        });
      }
    };

    // ── 3. ORBITING PLANETS ──
    const planets = [
      { x: width * 0.85, y: height * 0.22, radius: 45, color: "#7c3aed", auraColor: "rgba(124, 58, 237, 0.3)", hasRing: true },
      { x: width * 0.12, y: height * 0.75, radius: 28, color: "#06b6d4", auraColor: "rgba(6, 182, 212, 0.25)", hasRing: false },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark universe background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#030308");
      bgGrad.addColorStop(0.5, "#070712");
      bgGrad.addColorStop(1, "#040409");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ── DRAW ORBITING PLANETS ──
      planets.forEach((p) => {
        // Planet Aura Glow
        ctx.save();
        const auraGrad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.5, p.x, p.y, p.radius * 2.5);
        auraGrad.addColorStop(0, p.auraColor);
        auraGrad.addColorStop(1, "transparent");
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Planet Body
        ctx.save();
        const planetGrad = ctx.createRadialGradient(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.1, p.x, p.y, p.radius);
        planetGrad.addColorStop(0, "#ffffff");
        planetGrad.addColorStop(0.3, p.color);
        planetGrad.addColorStop(1, "#030308");
        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Planet Ring (Saturn style)
        if (p.hasRing) {
          ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.radius * 1.8, p.radius * 0.4, -Math.PI / 8, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });

      // ── DRAW TWINKLING STARS ──
      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.2) s.twinkleSpeed = -s.twinkleSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;
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
        ss.alpha -= 0.015;

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
        trailGrad.addColorStop(0.3, "rgba(6, 182, 212, 0.8)");
        trailGrad.addColorStop(1, "transparent");

        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 2;
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
