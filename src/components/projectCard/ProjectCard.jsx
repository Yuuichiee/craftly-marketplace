import React from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.scss";

function ProjectCard({ card }) {
  const catSlug = card.cat
    ? card.cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
    : '';

  return (
    <Link to={`/gigs?search=${encodeURIComponent(card.cat)}`} className="link">
      <div className="projectCard">
        <img src={card.img} alt={card.cat} />
        <div className="info">
          <img src={card.pp} alt={card.username} />
          <div className="texts">
            <h2>{card.cat}</h2>
            <span>{card.username}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;

/**
 * ProjectCard.jsx — Creator Portfolio Showcase Card Component
 * 
 * Where it is used:
 *   - Homepage ("Inspiration from our creators" slider)
 * 
 * What it displays:
 *   - Full project screenshot image
 *   - Creator avatar, username, and portfolio category name
 */


// Inspiration
//Real work from real Liverr freelancers