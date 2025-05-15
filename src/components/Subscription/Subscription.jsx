import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Subscription.css";
import { UserContext } from "../../context/UserContext";
import Layout from "../Layout/Layout";
import usePaymentSocket from "../../hooks/usePaymentSocket";

const SubscriptionForm = () => {
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);

  // ✅ Custom hook gives access to WebSocket and accepts callback for payment status
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
      setFormData((prevData) => ({
        ...prevData,
        user_id: userId,
      }));
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_id) {
      alert("User ID is missing. Please refresh and try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/subscriptions/stk/push`,
        formData,
        { withCredentials: true }
      );

      const checkoutId = res.data.CheckoutRequestID?.toString();
      setCheckoutRequestID(checkoutId); // ✅ Triggers WebSocket hook logic

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
          <div className="col-md-6 hero-left">
            <h1>seleneECS</h1>
            <p>Empowering Education Through Seamless Subscriptions</p>
          </div>

          <div className="col-md-6 hero-right">
            <h2>Subscribe Now</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Subscription Category</label>
                <select
                  className="form-select"
                  name="subscribed_category"
                  value={formData.subscribed_category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select a Category</option>
                  {[
                    "PP1", "PP2", "GRADE 1", "GRADE 2", "GRADE 3", "GRADE 4", "GRADE 5",
                    "GRADE 6", "GRADE 7", "GRADE 8", "GRADE 9", "FORM 2", "FORM 3", "FORM 4",
                    "STEM", "Arts and Sport", "SOCIAL SCIENCES"
                  ].map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="PhoneNumber"
                  placeholder="07XXXXXXXX"
                  pattern="^07\d{8}$"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Amount (Ksh)</label>
                <input
                  type="number"
                  className="form-control"
                  name="Amount"
                  placeholder="Enter amount"
                  value={formData.Amount}
                  onChange={handleChange}
                  required
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
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionForm;
