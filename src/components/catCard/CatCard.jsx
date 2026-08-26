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
