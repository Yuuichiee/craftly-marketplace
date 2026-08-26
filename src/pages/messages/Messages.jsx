import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import "./Messages.scss";

const Messages = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newRequest.get("/conversations");
        setConversations(res.data);
      } catch (err) {
        setError(err.message || "Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser, navigate]);

  const handleMarkAsRead = async (id) => {
    try {
      await newRequest.put(`/conversations/${id}`);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            return currentUser.isSeller
              ? { ...c, readBySeller: true }
              : { ...c, readByBuyer: true };
          }
          return c;
        })
      );
      showToast("Marked as read", "success");
    } catch (err) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="messages">
      <div className="container">
        <div className="title">
          <h1>Inbox</h1>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Loading conversations...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
            {error}
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <h3>No messages yet</h3>
            <p>Conversations with sellers or buyers will appear here.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((c) => {
                const isUnread = currentUser.isSeller
                  ? !c.readBySeller
                  : !c.readByBuyer;

                return (
                  <tr className={isUnread ? "active" : ""} key={c.id}>
                    <td>{currentUser.isSeller ? c.buyerId : c.sellerId}</td>
                    <td>
                      <Link to={`/message/${c.id}`} className="link" style={{ color: "var(--text-primary)" }}>
                        {c.lastMessage ? c.lastMessage.substring(0, 80) + "..." : "No messages yet"}
                      </Link>
                    </td>
                    <td>{new Date(c.updatedAt).toLocaleDateString()}</td>
                    <td>
                      {isUnread && (
                        <button onClick={() => handleMarkAsRead(c.id)} className="btn-outline" style={{ padding: "6px 12px", fontSize: "12px" }}>
                          Mark as Read
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Messages;
