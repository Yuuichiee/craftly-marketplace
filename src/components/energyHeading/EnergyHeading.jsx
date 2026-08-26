import React, { useEffect, useRef } from "react";
import "./EnergyHeading.scss";

const EnergyHeading = ({ text, highlightText }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;

    let width = (canvas.width = canvas.parentElement.offsetWidth || 800);
    let height = (canvas.height = 140);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = 140;
      }
    };
    window.addEventListener("resize", handleResize);

    const smokeParticles = [];
    const maxSmoke = 30;

    class SmokeParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height - 10;
        this.size = Math.random() * 20 + 10;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = -(Math.random() * 0.8 + 0.4);
        this.alpha = Math.random() * 0.3 + 0.1;
        this.decay = Math.random() * 0.005 + 0.003;
        this.hue = Math.random() > 0.5 ? 270 : 190; // Violet or Cyan
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size += 0.2;
        this.alpha -= this.decay;

        if (this.alpha <= 0 || this.y < 0) {
          this.reset();
        }
      }

      draw(context) {
        context.save();
        context.globalAlpha = Math.max(0, this.alpha);
        context.fillStyle = `hsla(${this.hue}, 90%, 65%, ${this.alpha})`;
        context.shadowColor = `hsla(${this.hue}, 90%, 65%, 0.8)`;
        context.shadowBlur = 20;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    for (let i = 0; i < maxSmoke; i++) {
      smokeParticles.push(new SmokeParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      smokeParticles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="energy-heading-wrap">
      <canvas ref={canvasRef} className="energy-smoke-canvas" />
      <h1 className="energy-title">
        {text} <br />
        <span className="rgb-text">{highlightText}</span>
      </h1>
    </div>
  );
};

export default EnergyHeading;
