import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import "./MyGigs.scss";

function MyGigs() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchMyGigs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newRequest.get(`/gigs?userId=${currentUser._id}`);
        setGigs(res.data);
      } catch (err) {
        setError(err.message || "Failed to load your gigs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyGigs();
  }, [currentUser, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gig?")) return;

    try {
      await newRequest.delete(`/gigs/${id}`);
      setGigs((prev) => prev.filter((g) => g._id !== id));
      showToast("Gig deleted successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete gig", "error");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>{currentUser.isSeller ? "My Listed Gigs" : "My Orders"}</h1>
          {currentUser.isSeller && (
            <Link to="/add">
              <button className="btn-primary">Add New Gig</button>
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Loading your services...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
            {error}
          </div>
        ) : gigs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <h3>No gigs created yet</h3>
            <p>Share your skills with the world by listing your first service.</p>
            <Link to="/add" className="btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
              Create a Gig
            </Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Sales</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gigs.map((gig) => (
                <tr key={gig._id}>
                  <td>
                    <img
                      className="image"
                      src={gig.cover || "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"}
                      alt={gig.title}
                    />
                  </td>
                  <td>
                    <Link to={`/gig/${gig._id}`} className="link" style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                      {gig.title}
                    </Link>
                  </td>
                  <td>$ {gig.price}</td>
                  <td>{gig.sales || 0}</td>
                  <td>
                    <img
                      className="delete"
                      src="/img/delete.png"
                      alt="Delete"
                      onClick={() => handleDelete(gig._id)}
                      style={{ cursor: "pointer", width: "20px" }}
                      title="Delete Gig"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyGigs;
