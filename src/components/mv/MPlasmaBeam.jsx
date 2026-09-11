import React, { useEffect, useRef } from "react";
import "./MarvelPlasmaBeam.scss";

const MarvelPlasmaBeam = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || 900);
    let height = (canvas.height = 180);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = 180;
      }
    };
    window.addEventListener("resize", handleResize);

    // Plasma Ember Sparks Pool
    const sparks = [];
    const maxSparks = 45;

    class Spark {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height / 2 + (Math.random() - 0.5) * 30;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 4 + 1.5; // Plasma blast flow
        this.speedY = (Math.random() - 0.5) * 2;
        this.alpha = Math.random() * 0.9 + 0.1;
        this.color = Math.random() > 0.4 ? "#e081f9" : "#06b6d4";
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.015;

        if (this.alpha <= 0 || this.x > width) {
          this.reset();
        }
      }

      draw(context) {
        context.save();
        context.globalAlpha = Math.max(0, this.alpha);
        context.fillStyle = this.color;
        context.shadowColor = this.color;
        context.shadowBlur = 12;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    for (let i = 0; i < maxSparks; i++) {
      sparks.push(new Spark());
    }

    let time = 0;

    const render = () => {
      time += 0.04;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";

      const centerY = height / 2;

      // ── 1. OUTER MAGENTA AURA GLOW BEAM ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let x = 0; x <= width; x += 20) {
        const wave = Math.sin(x * 0.01 + time) * 18 + Math.cos(x * 0.02 - time * 0.5) * 10;
        ctx.lineTo(x, centerY + wave);
      }
      ctx.lineWidth = 28;
      ctx.strokeStyle = "rgba(224, 129, 249, 0.25)";
      ctx.shadowColor = "#e081f9";
      ctx.shadowBlur = 35;
      ctx.stroke();
      ctx.restore();

      // ── 2. CYAN PLASMA TENDRILLS (UPPER & LOWER BEAMS) ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let x = 0; x <= width; x += 15) {
        const wave = Math.sin(x * 0.02 - time * 1.5) * 12 + Math.sin(x * 0.04 + time) * 8;
        ctx.lineTo(x, centerY + wave);
      }
      ctx.lineWidth = 10;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
      ctx.shadowColor = "#06b6d4";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.restore();

      // ── 3. SECONDARY VIOLET PLASMA CURVE ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let x = 0; x <= width; x += 15) {
        const wave = Math.cos(x * 0.025 + time * 1.2) * 14;
        ctx.lineTo(x, centerY + wave);
      }
      ctx.lineWidth = 6;
      ctx.strokeStyle = "rgba(168, 85, 247, 0.85)";
      ctx.shadowColor = "#a855f7";
      ctx.shadowBlur = 25;
      ctx.stroke();
      ctx.restore();

      // ── 4. HIGH-INTENSITY WHITE PLASMA CORE BEAM ──
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      for (let x = 0; x <= width; x += 30) {
        const wave = Math.sin(x * 0.015 + time) * 6;
        ctx.lineTo(x, centerY + wave);
      }
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      // ── 5. DRAW EMBER SPARKS ──
      sparks.forEach((spark) => {
        spark.update();
        spark.draw(ctx);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="marvel-plasma-canvas" />;
};

export default MarvelPlasmaBeam;

// not in use 