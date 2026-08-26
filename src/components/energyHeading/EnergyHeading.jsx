import React from "react";
import MarvelPlasmaBeam from "../marvelVfx/MarvelPlasmaBeam";
import "./EnergyHeading.scss";

const EnergyHeading = ({ text, highlightText }) => {
  return (
    <div className="marvel-energy-heading-wrap">
      {/* MARVEL COSMIC PLASMA BEAM CANVAS */}
      <MarvelPlasmaBeam />

      {/* MARVEL FUTURISTIC ENERGY AURA HEADING */}
      <h1 className="marvel-title">
        <span className="text-white">{text}</span> <br />
        <span className="marvel-plasma-text">{highlightText}</span>
      </h1>
    </div>
  );
};

export default EnergyHeading;
