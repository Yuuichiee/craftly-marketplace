import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import "./Message.scss";

const Message = () => {
  const { id } = useParams(); // conversation ID
  const { currentUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await newRequest.get(`/messages/${id}`);
        setMessages(res.data);
      } catch (err) {
        setError(err.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return;

    setSending(true);
    try {
      const res = await newRequest.post("/messages", {
        conversationId: id,
        desc: desc.trim(),
      });
      setMessages((prev) => [...prev, res.data]);
      setDesc("");
    } catch (err) {
      showToast(err.message || "Failed to send message", "error");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages" className="link">Messages</Link> &gt; Chat Room &gt;
        </span>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            Loading conversation history...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
            {error}
          </div>
        ) : (
          <>
            <div className="messages">
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontStyle: "italic" }}>
                  No messages in this conversation yet. Send a greeting to start chatting!
                </div>
              ) : (
                messages.map((m) => {
                  const isOwner = m.userId === currentUser?._id;
                  return (
                    <div className={`item ${isOwner ? "owner" : ""}`} key={m._id}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: isOwner ? "var(--violet)" : "var(--cyan)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          color: "white",
                          flexShrink: 0,
                        }}
                      >
                        {m.userId ? m.userId.slice(0, 2).toUpperCase() : "U"}
                      </div>
                      <p style={{ background: isOwner ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px 16px", color: "var(--text-primary)" }}>
                        {m.desc}
                      </p>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <hr />

            <form onSubmit={handleSubmit} className="write">
              <textarea
                placeholder="Write a message... (Press Enter to send)"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                onKeyDown={handleKeyDown}
                rows="2"
              />
              <button type="submit" className="btn-primary" disabled={sending || !desc.trim()}>
                {sending ? "Sending..." : "Send"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
