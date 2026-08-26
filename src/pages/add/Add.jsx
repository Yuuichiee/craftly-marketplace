import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import "./Add.scss";

const Add = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [singleFile, setSingleFile] = useState("");
  const [files, setFiles] = useState([]);
  const [feature, setFeature] = useState("");
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    title: "",
    cat: "design",
    cover: "",
    images: [],
    desc: "",
    shortTitle: "",
    shortDesc: "",
    deliveryTime: 3,
    revisionNumber: 1,
    price: 50,
  });

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    if (!feature.trim()) return;
    setFeatures((prev) => [...prev, feature.trim()]);
    setFeature("");
  };

  const removeFeature = (index) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please log in to add a gig", "error");
      navigate("/login");
      return;
    }
    if (!currentUser.isSeller) {
      showToast("Only sellers can list services", "error");
      return;
    }
    if (!inputs.title || !inputs.desc || !inputs.shortTitle || !inputs.shortDesc || !inputs.price) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      await newRequest.post("/gigs", {
        ...inputs,
        cover: singleFile || "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600",
        images: files.length > 0 ? files : ["https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"],
        features: features,
        price: Number(inputs.price),
        deliveryTime: Number(inputs.deliveryTime),
        revisionNumber: Number(inputs.revisionNumber),
      });
      showToast("Gig created successfully!", "success");
      navigate("/myGigs");
    } catch (err) {
      showToast(err.message || "Failed to create gig", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Service</h1>
        <form onSubmit={handleSubmit} className="sections">
          <div className="info">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="e.g. I will design a modern logo for your business"
              onChange={handleChange}
              required
            />

            <label htmlFor="cat">Category *</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music & Audio</option>
              <option value="ai-artists">AI Artists</option>
            </select>

            <label htmlFor="cover">Cover Image URL *</label>
            <input
              type="text"
              name="cover"
              id="cover"
              placeholder="Paste image URL (https://...)"
              value={singleFile}
              onChange={(e) => setSingleFile(e.target.value)}
            />

            <label htmlFor="desc">Full Description *</label>
            <textarea
              name="desc"
              id="desc"
              placeholder="Detailed description of your service..."
              cols="0"
              rows="12"
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "20px" }}>
              {loading ? "Creating Service..." : "Publish Service"}
            </button>
          </div>

          <div className="details">
            <label htmlFor="shortTitle">Package Title *</label>
            <input
              type="text"
              name="shortTitle"
              id="shortTitle"
              placeholder="e.g. Starter Logo Package"
              onChange={handleChange}
              required
            />

            <label htmlFor="shortDesc">Short Description *</label>
            <textarea
              name="shortDesc"
              id="shortDesc"
              placeholder="Short summary of what is included"
              cols="30"
              rows="6"
              onChange={handleChange}
              required
            ></textarea>

            <label htmlFor="deliveryTime">Delivery Time (days) *</label>
            <input
              type="number"
              name="deliveryTime"
              id="deliveryTime"
              min="1"
              defaultValue="3"
              onChange={handleChange}
            />

            <label htmlFor="revisionNumber">Revisions *</label>
            <input
              type="number"
              name="revisionNumber"
              id="revisionNumber"
              min="0"
              defaultValue="1"
              onChange={handleChange}
            />

            <label htmlFor="feature">Add Features</label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                id="feature"
                placeholder="e.g. Source file included"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
              />
              <button type="button" onClick={handleFeature} className="btn-outline" style={{ whiteSpace: "nowrap" }}>
                Add
              </button>
            </div>

            <div className="addedFeatures" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {features.map((f, i) => (
                <span
                  key={i}
                  onClick={() => removeFeature(i)}
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    color: "var(--violet-light)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                  title="Click to remove"
                >
                  {f} ✕
                </span>
              ))}
            </div>

            <label htmlFor="price">Price (USD) *</label>
            <input
              type="number"
              name="price"
              id="price"
              min="1"
              placeholder="50"
              onChange={handleChange}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
