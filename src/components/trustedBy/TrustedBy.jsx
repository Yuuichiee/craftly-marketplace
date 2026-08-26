import React from "react";
import "./TrustedBy.scss";

// Clean SVG Parody Brand Logos (Zoogle, Fakebook, Getflix, Paygrl)
const ZoogleLogo = () => (
  <svg width="90" height="30" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="24" fontFamily="'Space Grotesk', sans-serif" fontSize="24" fontWeight="700" fill="#a0a0bf" letterSpacing="-0.5">
      Z<tspan fill="#ea4335">o</tspan><tspan fill="#fbbc05">o</tspan><tspan fill="#a0a0bf">g</tspan><tspan fill="#34a853">l</tspan><tspan fill="#ea4335">e</tspan>
    </text>
  </svg>
);

const FakebookLogo = () => (
  <svg width="110" height="30" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="24" fontFamily="'Inter', sans-serif" fontSize="22" fontWeight="800" fill="#a0a0bf" letterSpacing="-0.5">
      fakebook
    </text>
  </svg>
);

const GetflixLogo = () => (
  <svg width="100" height="30" viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="24" fontFamily="'Space Grotesk', sans-serif" fontSize="22" fontWeight="900" fill="#e50914" letterSpacing="1">
      GETFLIX
    </text>
  </svg>
);

const PaygrlLogo = () => (
  <svg width="90" height="30" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="24" fontFamily="'Inter', sans-serif" fontSize="22" fontWeight="800" fontStyle="italic" fill="#003087" letterSpacing="-0.5">
      Pay<tspan fill="#0079C1">grl</tspan>
    </text>
  </svg>
);

const TrustedBy = () => {
  return (
    <div className="trustedBy">
      <div className="container">
        <span>Trusted by:</span>
        <div className="brand-logos-row">
          <div className="brand-logo"><ZoogleLogo /></div>
          <div className="brand-logo"><FakebookLogo /></div>
          <div className="brand-logo"><GetflixLogo /></div>
          <div className="brand-logo"><PaygrlLogo /></div>
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;
