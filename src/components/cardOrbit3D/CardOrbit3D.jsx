import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cards } from "../../data";
import "./CardOrbit3D.scss";

const CardOrbit3D = () => {
  const ringRef = useRef(null);
  const rotationRef = useRef(0);
  const isPausedRef = useRef(false);
  const animRef = useRef(null);
  const navigate = useNavigate();

  const [selectedCard, setSelectedCard] = useState(null);

  // Buttery 120 FPS GPU-accelerated rotation loop without React re-renders
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isPausedRef.current && ringRef.current) {
        rotationRef.current = (rotationRef.current + delta * 18) % 360;
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
    rotationRef.current = targetAngle;
    if (ringRef.current) {
      ringRef.current.style.transform = `rotateY(${targetAngle}deg)`;
    }
  };

  const handleExplore = (cat) => {
    navigate(`/gigs?cat=${cat}`);
  };

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
          onMouseLeave={() => (isPausedRef.current = false)}
        >
          <div className="orbit-ring" ref={ringRef}>
            {cards.map((card, index) => {
              const angle = (index * 360) / totalCards;
              const isSelected = selectedCard?.id === card.id;

              return (
                <div
                  key={card.id}
                  className={`orbit-card-item ${isSelected ? "selected" : ""}`}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
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

        {/* SELECTED CARD PREVIEW MODAL */}
        {selectedCard && (
          <div className="selected-card-panel fade-in-up">
            <div className="panel-inner glass-card">
              <img src={selectedCard.img} alt={selectedCard.title} className="panel-thumb" />
              <div className="panel-content">
                <span className="section-label">Selected Category</span>
                <h3>{selectedCard.title}</h3>
                <p>{selectedCard.desc}</p>
                <div className="panel-actions">
                  <button className="btn-primary" onClick={() => handleExplore(selectedCard.cat)}>
                    Browse {selectedCard.title} Services
                  </button>
                  <button className="btn-outline" onClick={() => setSelectedCard(null)}>
                    Close Preview
                  </button>
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
