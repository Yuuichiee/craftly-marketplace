import React from "react";
import "./EnergyHeading.scss";

const EnergyHeading = ({ text, highlightText }) => {
  return (
    <div className="clean-hero-heading">
      <h1 className="hero-title-main">
        {text} <br />
        <span className="title-highlight">{highlightText}</span>
      </h1>
    </div>
  );
};

export default EnergyHeading;
// used in The Future of Freelancing Hire expert freelancers for any project