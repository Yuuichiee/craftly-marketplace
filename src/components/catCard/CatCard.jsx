import React from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({ card }) {
  const catSlug = card.cat || card.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  return (
    <Link to={`/gigs?cat=${catSlug}`} className="link">
      <div className="catCard">
        <img src={card.img} alt={card.title} />
        <span className="desc">{card.desc}</span>
        <span className="title">{card.title}</span>
      </div>
    </Link>
  );
}

export default CatCard;

/**
 * CatCard.jsx — Category Card Component
 * 
 * Where it is used:
 *   - Homepage ("Browse / Explore by category" section)
 * 
 * What it displays:
 *   - Full background category image
 *   - Category title & subtitle (e.g. AI Artists, Logo Design, WordPress, SEO)
 *   - Clicking opens /gigs?cat=category-slug
 */