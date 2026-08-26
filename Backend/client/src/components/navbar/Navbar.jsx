import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">craftly</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <div className="links">
          <Link className="link navLink" to="/gigs">Explore work</Link>
          {!currentUser?.isSeller && <Link className="link creatorLink" to="/register">Become a creator</Link>}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        My gigs
                      </Link>
                      <Link className="link" to="/add">
                        Publish a gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link signin">Sign in</Link>
              <Link className="link" to="/register">
                <button>Join Craftly</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/gigs?search=design">
              Design
            </Link>
            <Link className="link menuLink" to="/gigs?search=motion">
              Motion
            </Link>
            <Link className="link menuLink" to="/gigs?search=writing">
              Writing
            </Link>
            <Link className="link menuLink" to="/gigs?search=AI">
              AI & data
            </Link>
            <Link className="link menuLink" to="/gigs?search=growth">
              Growth
            </Link>
            <Link className="link menuLink" to="/gigs?search=audio">
              Audio
            </Link>
            <Link className="link menuLink" to="/gigs?search=technology">
              Technology
            </Link>
            <Link className="link menuLink" to="/gigs?search=strategy">
              Strategy
            </Link>
            <Link className="link menuLink" to="/gigs?search=lifestyle">
              Lifestyle
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
