import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Subscription.css";
import { UserContext } from "../../context/UserContext";
import Layout from "../Layout/Layout";
import usePaymentSocket from "../../hooks/usePaymentSocket";

const SubscriptionForm = () => {
  const [pricingType, setPricingType] = useState("Monthly");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [view, setView] = useState("table"); // 'table' or 'form'
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
  const formRef = useRef(null); // 👈 scroll target

  const socketRef = usePaymentSocket((data) => {
    if (data?.mpesaReceipt) {
      alert("🎉 Payment confirmed successfully!");
      navigate("/");
    } else {
      alert("❌ Payment failed. Please try again.");
    }
  });

  const [formData, setFormData] = useState({
    subscribed_category: "",
    PhoneNumber: "",
    Amount: "",
    user_id: "",
  });

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        user_id: userId,
      }));
    }
  }, [userId]);

  // Scroll to form when view switches
  useEffect(() => {
    if (view === "form") {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [view]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryClick = (category) => {
    const cleanCategory = category.replace(/[^A-Z0-9 &]/gi, "").toUpperCase();
    const pricingMap = {
      Daily: "20",
      Monthly: "300",
      Yearly: "1800",
    };

    setSelectedCategory(category);
    setFormData((prev) => ({
      ...prev,
      subscribed_category: cleanCategory,
      Amount: pricingMap[pricingType],
    }));
    setView("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/subscriptions/stk/push`,
        formData,
        { withCredentials: true }
      );

      const checkoutId = res.data.CheckoutRequestID?.toString();
      setCheckoutRequestID(checkoutId);

      if (checkoutId && socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ checkoutRequestID: checkoutId }));
        console.log("✅ Sent checkoutRequestID to WebSocket");
      } else {
        console.warn("⚠️ WebSocket not ready to send checkoutRequestID");
      }

      alert("Subscription request sent! Waiting for confirmation...");
    } catch (error) {
      console.error("Subscription error:", error.response?.data || error.message);
      alert("Failed to process subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="hero-section container">
        <div className="row align-items-start">
          {/* Pricing Table View */}
          {view === "table" && (
            <div className="col-md-12">
              <h2 className="mb-3">📚 Curriculum-Based Education Subscriptions</h2>
              <div className="bg-white p-4 rounded shadow-sm subscription-card">
                <h4 className="text-primary fw-semibold mb-3">Subscription Pricing</h4>
                <table className="table table-hover text-center subscription-table">
                  <thead className="table-primary">
                    <tr>
                      <th>Category</th>
                      <th>Daily<br /><small>(KES 20)</small></th>
                      <th>Monthly<br /><small>(KES 300)</small></th>
                      <th>Yearly<br /><small>(KES 1800)</small></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "🧒 PP1",
                      "🧒 PP2",
                      "📘 GRADE 1",
                      "📘 GRADE 2",
                      "📘 GRADE 3",
                      "📘 GRADE 4",
                      "📘 GRADE 5",
                      "📘 GRADE 6",
                      "📘 GRADE 7",
                      "📘 GRADE 8",
                      "🧠 GRADE 9",
                      "🧠 FORM 2",
                      "🧠 FORM 3",
                      "🧠 FORM 4",
                      "🔬 STEM",
                      "🎨 ARTS & SPORTS",
                      "🌍 SOCIAL SCIENCES",
                      "📦 MORE RESOURCES ",
                    ].map((label, i) => (
                      <tr
                        key={i}
                        className="clickable-row"
                        onClick={() => handleCategoryClick(label)}
                        role="button"
                      >
                        <td className="text-start">{label}</td>
                        <td>20</td>
                        <td>300</td>
                        <td>1800</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-muted text-center small mt-2">
                  Click a category to subscribe and gain access to curriculum-aligned resources.
                </p>
              </div>
            </div>
          )}

          {/* Subscription Form View */}
          {view === "form" && (
            <div className="col-md-6 offset-md-3 hero-right" ref={formRef}>
              <h2>Subscribe Now</h2>
              <button
                className="btn btn-link mb-3"
                type="button"
                onClick={() => setView("table")}
              >
                ← Back to Pricing Table
              </button>

              <form onSubmit={handleSubmit}>
                {formData.subscribed_category && (
                  <div className="alert alert-info p-2 text-center">
                    Selected Category: <strong>{formData.subscribed_category}</strong>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Subscription Type</label>
                  <select
                    className="form-select"
                    value={pricingType}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setPricingType(selected);
                      const pricingMap = {
                        Daily: "20",
                        Monthly: "300",
                        Yearly: "1800",
                      };
                      setFormData((prev) => ({
                        ...prev,
                        Amount: pricingMap[selected],
                      }));
                    }}
                  >
                    <option value="Daily">Daily - KES 20</option>
                    <option value="Monthly">Monthly - KES 300</option>
                    <option value="Yearly">Yearly - KES 1800</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="PhoneNumber"
                    placeholder="07XXXXXXXX or 01XXXXXXXX"
                    
                    value={formData.PhoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Amount (Ksh)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="Amount"
                    value={formData.Amount}
                    readOnly
                    required
                    min="20"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionForm;
