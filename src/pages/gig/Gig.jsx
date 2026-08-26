import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import "./Gig.scss";

function Gig() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewDesc, setReviewDesc] = useState("");
  const [reviewStar, setReviewStar] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    const fetchGigData = async () => {
      setLoading(true);
      setError(null);
      try {
        const gigRes = await newRequest.get(`/gigs/single/${id}`);
        setGig(gigRes.data);

        if (gigRes.data.userId) {
          try {
            const sellerRes = await newRequest.get(`/users/${gigRes.data.userId}`);
            setSeller(sellerRes.data);
          } catch {
            // Seller user data optional fallback
          }
        }

        const reviewsRes = await newRequest.get(`/reviews/${id}`);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError(err.message || "Failed to load gig details");
      } finally {
        setLoading(false);
      }
    };
    fetchGigData();
  }, [id]);

  const handleOrder = async () => {
    if (!currentUser) {
      showToast("Please log in to place an order", "error");
      navigate("/login");
      return;
    }
    if (currentUser.isSeller) {
      showToast("Sellers cannot order gigs", "error");
      return;
    }

    setOrderLoading(true);
    try {
      await newRequest.post(`/orders/${id}`);
      showToast("Order placed successfully!", "success");
      navigate("/orders");
    } catch (err) {
      showToast(err.message || "Order placement failed", "error");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleContact = async () => {
    if (!currentUser) {
      showToast("Please log in to message seller", "error");
      navigate("/login");
      return;
    }
    if (!seller) return;

    try {
      const sellerId = seller._id;
      const buyerId = currentUser._id;
      const conversationId = currentUser.isSeller ? buyerId + sellerId : sellerId + buyerId;

      try {
        const res = await newRequest.get(`/conversations/single/${conversationId}`);
        navigate(`/message/${res.data.id}`);
      } catch {
        const res = await newRequest.post(`/conversations`, {
          to: seller._id,
        });
        navigate(`/message/${res.data.id}`);
      }
    } catch (err) {
      showToast(err.message || "Could not open conversation", "error");
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please log in to write a review", "error");
      navigate("/login");
      return;
    }
    if (!reviewDesc.trim()) {
      showToast("Please enter review description", "error");
      return;
    }

    setReviewLoading(true);
    try {
      const res = await newRequest.post("/reviews", {
        gigId: id,
        desc: reviewDesc.trim(),
        star: Number(reviewStar),
      });
      setReviews((prev) => [res.data, ...prev]);
      setReviewDesc("");
      showToast("Review submitted!", "success");
    } catch (err) {
      showToast(err.message || "Failed to add review", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="gig" style={{ textAlign: "center", padding: "100px 0", color: "var(--text-secondary)" }}>
        Loading service details...
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="gig" style={{ textAlign: "center", padding: "100px 0", color: "#ef4444" }}>
        <h3>{error || "Gig not found"}</h3>
        <Link to="/gigs" className="btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
          Browse Services
        </Link>
      </div>
    );
  }

  const starRating = gig.starNumber > 0 ? (gig.totalStars / gig.starNumber).toFixed(1) : "New";

  return (
    <div className="gig">
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">Liverr &gt; {gig.cat} &gt;</span>
          <h1>{gig.title}</h1>
          <div className="user">
            <img
              className="pp"
              src={seller?.img || "https://images.pexels.com/photos/720327/pexels-photo-720327.jpeg?auto=compress&cs=tinysrgb&w=1600"}
              alt={seller?.username || "Seller"}
            />
            <span>{seller?.username || "Freelancer"}</span>
            <div className="stars">
              <span style={{ color: "#f59e0b", fontWeight: "bold" }}>★ {starRating}</span>
              <span>({gig.starNumber || 0})</span>
            </div>
          </div>

          <div className="slider" style={{ marginBottom: "30px" }}>
            <img
              src={gig.cover}
              alt={gig.title}
              style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "12px" }}
            />
          </div>

          <h2>About This Gig</h2>
          <p>{gig.desc}</p>

          <div className="seller">
            <h2>About The Seller</h2>
            <div className="user">
              <img
                src={seller?.img || "https://images.pexels.com/photos/720327/pexels-photo-720327.jpeg?auto=compress&cs=tinysrgb&w=1600"}
                alt={seller?.username || "Seller"}
              />
              <div className="info">
                <span>{seller?.username || "Freelancer"}</span>
                <div className="stars">
                  <span style={{ color: "#f59e0b", fontWeight: "bold" }}>★ {starRating}</span>
                </div>
                <button onClick={handleContact}>Contact Me</button>
              </div>
            </div>

            <div className="box">
              <div className="items">
                <div className="item">
                  <span className="title">From</span>
                  <span className="desc">{seller?.country || "Global"}</span>
                </div>
                <div className="item">
                  <span className="title">Member since</span>
                  <span className="desc">2024</span>
                </div>
              </div>
              <hr />
              <p>{seller?.desc || "Professional freelancer dedicated to delivering top-tier work."}</p>
            </div>
          </div>

          <div className="reviews">
            <h2>Reviews</h2>
            {currentUser && !currentUser.isSeller && (
              <form onSubmit={handleAddReview} style={{ marginBottom: "30px", background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>
                <h4 style={{ marginBottom: "12px" }}>Add a Review</h4>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                  <label>Rating:</label>
                  <select value={reviewStar} onChange={(e) => setReviewStar(e.target.value)} style={{ padding: "6px 12px", borderRadius: "6px", background: "var(--bg-surface-2)", color: "white", border: "1px solid var(--border)" }}>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <textarea
                  rows="3"
                  placeholder="Share your experience..."
                  value={reviewDesc}
                  onChange={(e) => setReviewDesc(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "white", marginBottom: "12px", outline: "none" }}
                />
                <button type="submit" className="btn-primary" disabled={reviewLoading}>
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}

            {reviews.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No reviews yet for this service.</p>
            ) : (
              reviews.map((r) => (
                <div className="item" key={r._id}>
                  <div className="user">
                    <div className="pp" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--violet)", display: "flex", alignItems: "center", justifyCenter: "center", fontWeight: "bold", color: "white" }}>
                      {r.userId ? r.userId.slice(0, 2).toUpperCase() : "U"}
                    </div>
                    <div className="info">
                      <span>User</span>
                    </div>
                  </div>
                  <div className="stars">
                    <span style={{ color: "#f59e0b" }}>{"★".repeat(r.star)}</span>
                    <span style={{ marginLeft: "6px" }}>{r.star}</span>
                  </div>
                  <p>{r.desc}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="right">
          <div className="price">
            <h3>{gig.shortTitle || gig.title}</h3>
            <h2>$ {gig.price}</h2>
          </div>
          <p>{gig.shortDesc || gig.desc}</p>
          <div className="details">
            <div className="item">
              <img src="/img/clock.png" alt="" />
              <span>{gig.deliveryTime || 3} Days Delivery</span>
            </div>
            <div className="item">
              <img src="/img/recycle.png" alt="" />
              <span>{gig.revisionNumber || 1} Revisions</span>
            </div>
          </div>
          {gig.features && gig.features.length > 0 && (
            <div className="features">
              {gig.features.map((feat, i) => (
                <div className="item" key={i}>
                  <img src="/img/greencheck.png" alt="" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}
          <button className="btn-primary" style={{ width: "100%", marginTop: "20px" }} onClick={handleOrder} disabled={orderLoading}>
            {orderLoading ? "Processing Order..." : `Order Now ($${gig.price})`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Gig;
