import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import newRequest from "../../utils/newRequest";
import { showToast } from "../../utils/toast";
import "./Navbar.scss";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [starState, setStarState] = useState({ active: false, position: "top" });
  const [open, setOpen] = useState(false);

  const lastScrollY = useRef(0);
  const dropdownRef = useRef();
  const { currentUser, dispatch } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Alternating loop:
  // 1. Star 1 sweeps across TOP border (Left -> Right)
  // 2. As soon as Star 1 exits top-right, Star 2 enters from BOTTOM-RIGHT and sweeps across BOTTOM border (Right -> Left)
  useEffect(() => {
    let currentPosition = "top";

    const runCycle = () => {
      // 1. Fire Star at currentPosition (Top: Left->Right, or Bottom: Right->Left)
      setStarState({ active: true, position: currentPosition });

      // 2. After 1.2s when star finishes leaving, immediately switch edge & fire opposite star
      setTimeout(() => {
        setStarState({ active: false, position: currentPosition });
        const nextPosition = currentPosition === "top" ? "bottom" : "top";
        currentPosition = nextPosition;

        setTimeout(() => {
          setStarState({ active: true, position: nextPosition });
          setTimeout(() => {
            setStarState({ active: false, position: nextPosition });
            currentPosition = nextPosition === "top" ? "bottom" : "top";
          }, 1200);
        }, 150);
      }, 1250);
    };

    runCycle();
    const interval = setInterval(runCycle, 3800);

    return () => clearInterval(interval);
  }, []);

  // Hide navbar on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down -> hide navbar
        setVisible(false);
      } else {
        // Scrolling up or at top -> show navbar
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
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
    { label: "Explore", path: "/gigs" },
  ];

  return (
    <header className={`modern-navbar-header ${visible ? "visible" : "hidden"} ${scrolled ? "scrolled" : ""}`}>
      {/* ── SHOOTING STAR ON TOP BORDER (LEFT ➔ RIGHT) ── */}
      <div
        className={`navbar-star-top ${
          starState.active && starState.position === "top" ? "sweep-top" : ""
        }`}
      />

      {/* ── SHOOTING STAR ON BOTTOM BORDER (RIGHT ➔ LEFT) ── */}
      <div
        className={`navbar-star-bottom ${
          starState.active && starState.position === "bottom" ? "sweep-bottom" : ""
        }`}
      />

      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <span className="brand-title">LIVERR</span>
          <span className="brand-dot" />
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${pathname === link.path ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          {!currentUser && (
            <Link to="/register" className="nav-item">
              Become a Seller
            </Link>
          )}

          {/* USER PROFILE OR AUTH BUTTONS */}
          {currentUser ? (
            <div className="user-menu-wrap" ref={dropdownRef}>
              <button className="user-btn" onClick={() => setOpen((prev) => !prev)}>
                <img
                  src={
                    currentUser.img ||
                    "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  }
                  alt={currentUser.username}
                />
                <span>{currentUser.username}</span>
              </button>

              {open && (
                <div className="user-dropdown">
                  <div className="dropdown-user-info">
                    <span className="badge-role">{currentUser.isSeller ? "✦ Seller" : "👤 Buyer"}</span>
                    <span className="username">@{currentUser.username}</span>
                  </div>

                  <hr />

                  {currentUser.isSeller && (
                    <>
                      <Link to="/myGigs" className="menu-link" onClick={() => setOpen(false)}>
                        My Listed Gigs
                      </Link>
                      <Link to="/add" className="menu-link" onClick={() => setOpen(false)}>
                        Add New Gig
                      </Link>
                    </>
                  )}

                  <Link to="/orders" className="menu-link" onClick={() => setOpen(false)}>
                    Orders
                  </Link>
                  <Link to="/messages" className="menu-link" onClick={() => setOpen(false)}>
                    Messages
                  </Link>

                  <hr />

                  <button className="menu-link logout-btn" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-item signin-link">
                Sign in
              </Link>
              <Link to="/register" className="join-button">
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
