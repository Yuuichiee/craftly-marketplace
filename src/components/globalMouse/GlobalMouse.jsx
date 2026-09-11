import React, { useEffect, useRef } from "react";
import "./GlobalMouse.scss";

const GlobalMouse = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle pool for mouse energy trail & smoke
    const particles = [];
    const maxParticles = 60;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 3;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5 - 0.5; // slight rise like energy smoke
        this.color = Math.random() > 0.5 ? "rgba(124, 58, 237, " : "rgba(6, 182, 212, ";
        this.alpha = 0.8;
        this.decay = Math.random() * 0.02 + 0.015;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size += 0.15; // expanding energy smoke ring
        this.alpha -= this.decay;
      }

      draw(context) {
        context.save();
        context.globalAlpha = Math.max(0, this.alpha);
        context.fillStyle = this.color + this.alpha + ")";
        context.shadowColor = this.color.includes("124") ? "#7c3aed" : "#06b6d4";
        context.shadowBlur = 12;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const handleMouseMove = (e) => {
      // Spawn energy smoke particles on cursor move
      for (let i = 0; i < 2; i++) {
        if (particles.length < maxParticles) {
          particles.push(new Particle(e.clientX, e.clientY));
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="global-mouse-canvas" />;
};

export default GlobalMouse;

/**
 * GlobalMouse.jsx — Interactive Mouse Cursor Trail Component
 * 
 * What it does:
 *   - Spawns glowing purple & cyan particle smoke rings that follow the mouse cursor.
 *   - Uses HTML5 2D Canvas for high-performance particle animation.
 */