import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import "./Orders.scss";

const Orders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newRequest.get("/orders");
        setOrders(res.data);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const conversationId = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${conversationId}`);
      navigate(`/message/${res.data.id}`);
    } catch {
      try {
        const res = await newRequest.post(`/conversations`, {
          to: currentUser.isSeller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      } catch (err) {
        showToast(err.message || "Failed to start conversation", "error");
      }
    }
  };

  if (!currentUser) return null;

  return (
    <div className="orders">
      <div className="container">
        <div className="title">
          <h1>{currentUser.isSeller ? "Seller Orders" : "My Purchases"}</h1>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Loading orders...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <h3>No orders yet</h3>
            <p>{currentUser.isSeller ? "You haven't received any orders yet." : "You haven't purchased any services yet."}</p>
            {!currentUser.isSeller && (
              <Link to="/gigs" className="btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
                Explore Services
              </Link>
            )}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img
                      className="image"
                      src={order.img || "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"}
                      alt={order.title}
                    />
                  </td>
                  <td>{order.title}</td>
                  <td>$ {order.price}</td>
                  <td>{currentUser.isSeller ? order.buyerId : order.sellerId}</td>
                  <td>
                    <img
                      className="message"
                      src="/img/message.png"
                      alt="Contact"
                      onClick={() => handleContact(order)}
                      style={{ cursor: "pointer", width: "24px" }}
                      title="Send Message"
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
};

export default Orders;
