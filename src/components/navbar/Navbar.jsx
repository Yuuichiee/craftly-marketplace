import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import newRequest from "../../utils/newRequest";
import { showToast } from "../../utils/toast";
import "./Navbar.scss";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentUser, dispatch } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      dispatch({ type: "LOGOUT" });
      setOpen(false);
      showToast("Logged out successfully", "info");
      navigate("/");
    } catch {
      dispatch({ type: "LOGOUT" });
      setOpen(false);
      navigate("/");
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Explore Services", path: "/gigs" },
  ];

  const categoryPills = [
    { label: "✨ AI Artists", cat: "ai-artists" },
    { label: "🎨 Logo Design", cat: "logo-design" },
    { label: "⚡ WordPress", cat: "wordpress" },
    { label: "🎙️ Voice Over", cat: "voice-over" },
    { label: "🎬 Video Explainer", cat: "video-explainer" },
    { label: "📈 SEO", cat: "seo" },
    { label: "🖌️ Illustration", cat: "illustration" },
  ];

  return (
    <header className={`floating-navbar-wrap ${scrolled ? "scrolled" : ""}`}>
      {/* ── MAIN FLOATING CAPSULE DOCK ── */}
      <nav className="floating-dock">
        {/* LOGO */}
        <Link to="/" className="dock-logo">
          <div className="logo-spark-wrap">
            <span className="spark-icon">✦</span>
          </div>
          <span className="logo-text">LIVERR</span>
        </Link>

        {/* NAV LINKS */}
        <div className="dock-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`dock-link ${pathname === link.path ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ACTIONS & USER PROFILE */}
        <div className="dock-actions">
          {currentUser ? (
            <div className="user-profile-menu" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="User menu"
              >
                <img
                  src={
                    currentUser.img ||
                    "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  }
                  alt={currentUser.username}
                />
                <span className="user-name">{currentUser.username}</span>
                <span className="online-indicator" />
              </button>

              {open && (
                <div className="dock-dropdown-menu">
                  <div className="dropdown-header">
                    <span className="user-role-badge">
                      {currentUser.isSeller ? "✦ Seller Account" : "👤 Buyer Account"}
                    </span>
                    <span className="user-handle">@{currentUser.username}</span>
                  </div>

                  <div className="dropdown-divider" />

                  {currentUser.isSeller && (
                    <>
                      <Link to="/myGigs" className="dropdown-item" onClick={() => setOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        My Services
                      </Link>
                      <Link to="/add" className="dropdown-item" onClick={() => setOpen(false)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        Add New Gig
                      </Link>
                    </>
                  )}

                  <Link to="/orders" className="dropdown-item" onClick={() => setOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10l-1 8H4L3 4z" stroke="currentColor" strokeWidth="1.5"/><path d="M6 4V3a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.5"/></svg>
                    Orders & Purchases
                  </Link>

                  <Link to="/messages" className="dropdown-item" onClick={() => setOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3h12v8H4l-2 2V3z" stroke="currentColor" strokeWidth="1.5"/></svg>
                    Messages & Inbox
                  </Link>

                  <div className="dropdown-divider" />

                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="guest-actions">
              <Link to="/login" className="login-link">
                Sign in
              </Link>
              <Link to="/register" className="join-btn-beam">
                <span>Join Liverr</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ── FLOATING CATEGORY QUICK-BAR ── */}
      <div className="category-quick-bar">
        <div className="quick-bar-scroll">
          {categoryPills.map((pill) => (
            <Link
              key={pill.cat}
              to={`/gigs?cat=${pill.cat}`}
              className="cat-pill"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
