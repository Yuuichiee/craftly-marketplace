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
      <div className="gig-state-box container">
        <p>Loading service details...</p>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="gig-state-box container">
        <h2>Service Not Found</h2>
        <p>{error || "The service you are looking for does not exist."}</p>
        <Link to="/gigs" className="btn-primary" style={{ marginTop: "16px" }}>
          Browse All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="gig">
      <div className="container">
        {/* LEFT MAIN CONTENT */}
        <div className="left">
          <div className="breadcrumbs">
            <Link to="/" className="link">Home</Link> <span>/</span> <Link to="/gigs" className="link">Services</Link> <span>/</span> <span>{gig.cat}</span>
          </div>

          <h1>{gig.title}</h1>

          {/* SELLER BAR */}
          <div className="seller-head-info">
            <img
              className="avatar-img"
              src={
                seller?.img ||
                gig.cover ||
                "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600"
              }
              alt={seller?.username || "Seller"}
            />
            <div className="seller-details">
              <span className="seller-name">{seller?.username || "Verified Professional"}</span>
              <div className="star-rating">
                <span className="star-icon">★</span>
                <span className="star-score">
                  {gig.starNumber > 0 ? (gig.totalStars / gig.starNumber).toFixed(1) : "New"}
                </span>
                <span className="star-count">({gig.starNumber || 0})</span>
              </div>
            </div>
          </div>

          {/* MAIN COVER IMAGE */}
          <div className="gig-cover-frame glass-card">
            <img src={gig.cover} alt={gig.title} className="cover-main-img" />
          </div>

          {/* ABOUT THIS SERVICE */}
          <div className="gig-section-block">
            <h2>About This Service</h2>
            <p className="gig-description-text">{gig.desc}</p>
          </div>

          {/* ABOUT THE SELLER */}
          <div className="gig-section-block seller-profile-card glass-card">
            <h2>About The Seller</h2>
            <div className="seller-profile-body">
              <img
                src={
                  seller?.img ||
                  gig.cover ||
                  "https://images.pexels.com/photos/1115697/pexels-photo-1115697.jpeg?auto=compress&cs=tinysrgb&w=1600"
                }
                alt=""
                className="seller-big-avatar"
              />
              <div className="seller-bio-info">
                <h3>{seller?.username || "Verified Seller"}</h3>
                <p className="seller-country">📍 {seller?.country || "Global"}</p>
                <button className="btn-outline contact-btn" onClick={handleContact}>
                  Contact Seller
                </button>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="gig-section-block reviews-section">
            <h2>Client Reviews ({reviews.length})</h2>

            {currentUser && !currentUser.isSeller && (
              <form onSubmit={handleAddReview} className="add-review-form glass-card">
                <h4>Leave a Review</h4>
                <div className="rating-picker">
                  <label>Rating:</label>
                  <select value={reviewStar} onChange={(e) => setReviewStar(e.target.value)}>
                    <option value="5">5 Stars — Excellent</option>
                    <option value="4">4 Stars — Very Good</option>
                    <option value="3">3 Stars — Average</option>
                    <option value="2">2 Stars — Poor</option>
                    <option value="1">1 Star — Very Bad</option>
                  </select>
                </div>
                <textarea
                  rows="3"
                  placeholder="Share your experience working with this seller..."
                  value={reviewDesc}
                  onChange={(e) => setReviewDesc(e.target.value)}
                  className="input-field"
                />
                <button type="submit" className="btn-primary" disabled={reviewLoading}>
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}

            {reviews.length === 0 ? (
              <p className="empty-reviews-text">No reviews yet. Be the first to order and review!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((r) => (
                  <div className="review-card glass-card" key={r._id}>
                    <div className="review-header">
                      <div className="review-avatar">
                        {r.userId ? r.userId.slice(0, 2).toUpperCase() : "U"}
                      </div>
                      <div className="review-meta">
                        <span className="reviewer-name">Verified Buyer</span>
                        <div className="review-stars">
                          {"★".repeat(r.star)} <span className="star-num">{r.star}</span>
                        </div>
                      </div>
                    </div>
                    <p className="review-desc">{r.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CHECKOUT BOX (STICKY BELOW NAVBAR) */}
        <div className="right sticky-checkout-box glass-card">
          <div className="checkout-price-header">
            <h3>{gig.shortTitle || gig.title}</h3>
            <h2 className="price-tag">$ {gig.price}</h2>
          </div>
          <p className="checkout-desc">{gig.shortDesc || gig.desc}</p>

          <div className="checkout-details-grid">
            <div className="detail-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{gig.deliveryTime || 3} Days Delivery</span>
            </div>
            <div className="detail-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--violet-light)" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>{gig.revisionNumber || 1} Revisions</span>
            </div>
          </div>

          {gig.features && gig.features.length > 0 && (
            <div className="checkout-features-list">
              {gig.features.map((feat, i) => (
                <div className="feature-item" key={i}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          <button className="btn-primary checkout-btn" onClick={handleOrder} disabled={orderLoading}>
            {orderLoading ? "Processing Order..." : `Order Now ($${gig.price})`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Gig;
