import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cards } from "../../data";
import "./CardOrbit3D.scss";

const CardOrbit3D = () => {
  const ringRef = useRef(null);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(null);
  const isPausedRef = useRef(false);
  const animRef = useRef(null);
  const navigate = useNavigate();

  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Smooth lerp 3D rotation loop (No jump / gap on click)
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (ringRef.current) {
        if (targetRotationRef.current !== null) {
          // Smooth lerp to clicked target angle
          const diff = targetRotationRef.current - rotationRef.current;
          rotationRef.current += diff * 0.1;

          if (Math.abs(diff) < 0.1) {
            rotationRef.current = targetRotationRef.current;
            targetRotationRef.current = null;
          }
        } else if (!isPausedRef.current) {
          // Continuous smooth orbit
          rotationRef.current = (rotationRef.current + delta * 15) % 360;
        }

        ringRef.current.style.transform = `rotateY(${rotationRef.current}deg)`;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const totalCards = cards.length;
  const radius = 420; // 3D orbit radius

  const handleCardClick = (card, index) => {
    setSelectedCard(card);
    const targetAngle = -((index * 360) / totalCards);
    targetRotationRef.current = targetAngle;
  };

  const handleExplore = (cat) => {
    navigate(`/gigs?cat=${cat}`);
  };

  const activeCard = hoveredCard || selectedCard;

  return (
    <section className="orbit-3d-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-label">✦ 360° Interactive Studio</span>
          <h2>Explore Services in 3D Orbit</h2>
          <p>Hover or click any card to lock into detail view</p>
        </div>

        {/* 3D SCENE STAGE */}
        <div
          className="orbit-stage"
          onMouseEnter={() => (isPausedRef.current = true)}
          onMouseLeave={() => {
            isPausedRef.current = false;
            setHoveredCard(null);
          }}
        >
          <div className="orbit-ring" ref={ringRef}>
            {cards.map((card, index) => {
              const angle = (index * 360) / totalCards;
              const isSelected = activeCard?.id === card.id;

              return (
                <div
                  key={card.id}
                  className={`orbit-card-item ${isSelected ? "selected" : ""}`}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
                  onMouseEnter={() => setHoveredCard(card)}
                  onClick={() => handleCardClick(card, index)}
                >
                  <div className="orbit-card-inner glass-card">
                    <img src={card.img} alt={card.title} className="card-bg-img" />
                    <div className="card-overlay" />
                    <div className="card-badge">✦ Category</div>
                    <div className="card-info">
                      <h3>{card.title}</h3>
                      <p>{card.desc}</p>
                      <button
                        className="card-select-btn btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExplore(card.cat);
                        }}
                      >
                        Explore Service →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HOVER / SELECTED QUICK PREVIEW POPUP MODAL */}
        {activeCard && (
          <div className="selected-card-panel fade-in-up">
            <div className="panel-inner glass-card">
              <img src={activeCard.img} alt={activeCard.title} className="panel-thumb" />
              <div className="panel-content">
                <span className="section-label">✦ {hoveredCard ? "Hovered Preview" : "Selected Category"}</span>
                <h3>{activeCard.title}</h3>
                <p>{activeCard.desc}</p>
                <div className="panel-actions">
                  <button className="btn-primary" onClick={() => handleExplore(activeCard.cat)}>
                    Browse {activeCard.title} Services →
                  </button>
                  {selectedCard && (
                    <button className="btn-outline" onClick={() => setSelectedCard(null)}>
                      Close Preview
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CardOrbit3D;
