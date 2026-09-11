import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Featured.scss";

function Featured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (input.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(input.trim())}`);
    } else {
      navigate("/gigs");
    }
  };

  const handlePopularClick = (query) => {
    navigate(`/gigs?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span className="gradient-text">freelance</span> services for your business
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="/img/search.png" alt="Search" />
              <input
                type="text"
                placeholder='Try "building mobile app", "logo", "SEO"...'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className="btn-primary" onClick={handleSearch}>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <button type="button" onClick={() => handlePopularClick("Web Design")}>Web Design</button>
            <button type="button" onClick={() => handlePopularClick("WordPress")}>WordPress</button>
            <button type="button" onClick={() => handlePopularClick("Logo Design")}>Logo Design</button>
            <button type="button" onClick={() => handlePopularClick("AI Services")}>AI Services</button>
          </div>
        </div>
        <div className="right">
          <img src="/img/man.png" alt="Featured Freelancer" onError={(e) => e.target.style.display = "none"} />
        </div>
      </div>
    </div>
  );
}

export default Featured;
// Not using it rn