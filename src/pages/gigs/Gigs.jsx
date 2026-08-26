import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import GigCard from "../../components/gigCard/GigCard";
import "./Gigs.scss";

function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("createdAt");
  const [open, setOpen] = useState(false);
  
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(search);
        const cat = params.get("cat") || "";
        const searchQ = params.get("search") || "";
        const minVal = minRef.current?.value || "";
        const maxVal = maxRef.current?.value || "";

        let queryStr = `/gigs?sort=${sort}`;
        if (cat) queryStr += `&cat=${encodeURIComponent(cat)}`;
        if (searchQ) queryStr += `&search=${encodeURIComponent(searchQ)}`;
        if (minVal) queryStr += `&min=${minVal}`;
        if (maxVal) queryStr += `&max=${maxVal}`;

        const res = await newRequest.get(queryStr);
        setGigs(res.data);
      } catch (err) {
        setError(err.message || "Failed to load gigs");
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [search, sort]);

  const apply = () => {
    const params = new URLSearchParams(search);
    const cat = params.get("cat") || "";
    const searchQ = params.get("search") || "";
    const minVal = minRef.current?.value || "";
    const maxVal = maxRef.current?.value || "";

    setLoading(true);
    let queryStr = `/gigs?sort=${sort}`;
    if (cat) queryStr += `&cat=${encodeURIComponent(cat)}`;
    if (searchQ) queryStr += `&search=${encodeURIComponent(searchQ)}`;
    if (minVal) queryStr += `&min=${minVal}`;
    if (maxVal) queryStr += `&max=${maxVal}`;

    newRequest.get(queryStr)
      .then((res) => setGigs(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const params = new URLSearchParams(search);
  const catParam = params.get("cat");
  const searchParam = params.get("search");

  return (
    <div className="gigs">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/" className="link">Home</Link> &gt; {catParam || searchParam || "Explore Services"} &gt;
        </div>
        <h1>{catParam ? catParam.replace(/-/g, ' ').toUpperCase() : searchParam ? `Results for "${searchParam}"` : "All Services"}</h1>
        <p>Explore top freelance talent and services on Liverr</p>

        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : sort === "createdAt" ? "Newest" : "Price"}
            </span>
            <img src="/img/down.png" alt="sort" onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }} />
            {open && (
              <div className="rightMenu">
                <span onClick={() => reSort("createdAt")}>Newest</span>
                <span onClick={() => reSort("sales")}>Best Selling</span>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading" style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Loading services...
          </div>
        ) : error ? (
          <div className="error" style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
            {error}
          </div>
        ) : gigs.length === 0 ? (
          <div className="empty" style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <h3>No services found</h3>
            <p>Try adjusting your search filters or check back later.</p>
          </div>
        ) : (
          <div className="cards">
            {gigs.map((gig) => (
              <GigCard key={gig._id || gig.id} item={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gigs;
