import React, { useState } from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";

const GigCard = ({ item }) => {
  const [isLiked, setIsLiked] = useState(false);

  const gigId = item._id || item.id;
  const coverImg = item.cover || item.img || "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const userImg = item.pp || "https://images.pexels.com/photos/720327/pexels-photo-720327.jpeg?auto=compress&cs=tinysrgb&w=1600";
  const username = item.username || "Freelancer";
  const description = item.title || item.desc || "Professional service";
  const rating = item.starNumber > 0 ? (item.totalStars / item.starNumber).toFixed(1) : item.star || "5.0";

  return (
    <Link to={`/gig/${gigId}`} className="link">
      <div className="gigCard">
        <img src={coverImg} alt={description} />
        <div className="info">
          <div className="user">
            <img src={userImg} alt={username} />
            <span>{username}</span>
          </div>
          <p>{description}</p>
          <div className="star">
            <span style={{ color: "#f59e0b", fontWeight: "bold" }}>★</span>
            <span>{rating}</span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            style={{ fontSize: "18px", cursor: "pointer", color: isLiked ? "#ef4444" : "var(--text-muted)" }}
            title={isLiked ? "Remove favorite" : "Save favorite"}
          >
            {isLiked ? "♥" : "♡"}
          </span>
          <div className="price">
            <span>STARTING AT</span>
            <h2>$ {item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
