import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the right <span>creative spark</span> for your next big move
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input
                type="text"
                placeholder='Try "brand identity for a coffee shop"'
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
              <button onClick={() => navigate("/gigs?search=web%20design")}>Web design</button>
              <button onClick={() => navigate("/gigs?search=wordpress")}>WordPress</button>
              <button onClick={() => navigate("/gigs?search=logo%20design")}>Logo design</button>
              <button onClick={() => navigate("/gigs?search=AI")}>AI services</button>
          </div>
        </div>
        <div className="right">
          <div className="heroNote">CRAFTLY / 01</div>
          <div className="heroCard heroCardMain">
            <img src="./img/man.png" alt="Creative professional" />
            <span>Make something<br /><strong>worth sharing.</strong></span>
          </div>
          <div className="heroCard heroCardMini"><b>24k+</b><small>creators ready<br />to collaborate</small></div>
        </div>
      </div>
    </div>
  );
}

export default Featured;
