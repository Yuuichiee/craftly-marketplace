import React from "react";
import "./TrustedBy.scss";

const COMPANIES = [
  "Zoogle",
  "Fakebook",
  "Getflix",
  "Paygrl",
  "Microsoft",
  "Airbnb",
  "Spotify",
  "Linear",
  "Figma",
];

const TrustedBy = () => {
  return (
    <section className="trustedBy">
      <div className="container text-center">
        <span className="label">✦ TRUSTED BY LEADING GLOBAL BRANDS ✦</span>

        {/* CENTERED INFINITE MARQUEE */}
        <div className="marquee-wrapper">
          <div className="marquee">
            {COMPANIES.concat(COMPANIES).map((company, index) => (
              <div key={index} className="company-pill glass-card">
                <span>{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
