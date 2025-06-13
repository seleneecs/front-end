import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import "./Subscription.css";
import { UserContext } from "../../context/UserContext";
import Layout from "../Layout/Layout";
import usePaymentSocket from "../../hooks/usePaymentSocket";

const categoryOptions = [
  { value: 'PP1', label: 'PP1', color: '#FF00FF' },
  { value: 'PP2', label: 'PP2', color: '#FF00FF' },
  { value: 'GRADE 1', label: 'GRADE 1' },
  { value: 'GRADE 2', label: 'GRADE 2' },
  { value: 'GRADE 3', label: 'GRADE 3' },
  { value: 'GRADE 4', label: 'GRADE 4' },
  { value: 'GRADE 5', label: 'GRADE 5' },
  { value: 'GRADE 6', label: 'GRADE 6' },
  { value: 'GRADE 7', label: 'GRADE 7' },
  { value: 'GRADE 8', label: 'GRADE 8' },
  { value: 'GRADE 9', label: 'GRADE 9' },
  { value: 'FORM 2', label: 'FORM 2' },
  { value: 'FORM 3', label: 'FORM 3' },
  { value: 'FORM 4', label: 'FORM 4' },
  { value: 'STEM', label: 'STEM', color: '#0000FF' },
  { value: 'ARTS & SPORTS', label: 'ARTS & SPORTS', color: '#0000FF' },
  { value: 'SOCIAL SCIENCES', label: 'SOCIAL SCIENCES', color: '#0000FF' },
  { value: 'OTHERS RESOURCES', label: 'OTHER RESOURCES', color: '#0000FF' },
  
];

const customSelectStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.data.color || 'black',
    backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
    padding: 10,
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.data.color || 'black',
  }),
};

const SubscriptionForm = () => {
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Validate User ID
  if (!formData.user_id) {
    alert("User ID is missing. Please refresh and try again.");
    return;
  }

  // ✅ Validate Amount
  const numericAmount = Number(formData.Amount);
  if (!formData.Amount || isNaN(numericAmount) || numericAmount < 20) {
    alert("Amount must be at least 20 Ksh.");
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
          <div className="col-md-6 hero-left">
            <h1>seleneECS</h1>
           <div className="d-none bg-light p-4 rounded mb-4">
  <h2 className="mb-3">📚 Curriculum-Based Education Subscriptions</h2>
  <p className="mb-4">
    Access quality <strong>curriculum-based education</strong> resources tailored for every learner level:
  </p>
  
  <ul className="list-group mb-4">
    <li className="list-group-item">🧒 PP1</li>
    <li className="list-group-item">🧒 PP2</li>
    <li className="list-group-item">📘 GRADE 1</li>
    <li className="list-group-item">📘 GRADE 2</li>
    <li className="list-group-item">📘 GRADE 3</li>
    <li className="list-group-item">📘 GRADE 4</li>
    <li className="list-group-item">📘 GRADE 5</li>
    <li className="list-group-item">📘 GRADE 6</li>
    <li className="list-group-item">📘 GRADE 7</li>
    <li className="list-group-item">📘 GRADE 8</li>
    <li className="list-group-item">🧠 GRADE 9</li>
    <li className="list-group-item">🧠 FORM 2</li>
    <li className="list-group-item">🧠 FORM 3</li>
    <li className="list-group-item">🧠 FORM 4</li>
    <li className="list-group-item">🔬 STEM</li>
    <li className="list-group-item">🎨 ARTS & SPORTS</li>
    <li className="list-group-item">🌍 SOCIAL SCIENCES</li>
    <li className="list-group-item">📦 OTHER RESOURCES (worksheets, lesson plans, videos)</li>
  </ul>
  
  <p>
    All materials are carefully designed to support <strong>curriculum-based education</strong>, ensuring consistent, reliable learning for students and educators.
  </p>
</div>

          </div>

          <div className="col-md-6 hero-right">
            <h2>Subscribe Now</h2>
            <form onSubmit={handleSubmit}>
              {/* Category Selection */}
              <div className="mb-3">
                <label className="form-label">Subscription Category</label>
                <Select
                  name="subscribed_category"
                  options={categoryOptions}
                  styles={customSelectStyles}
                  value={categoryOptions.find(
                    (option) => option.value === formData.subscribed_category
                  )}
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      subscribed_category: selected.value,
                    }))
                  }
                  isDisabled={loading}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="PhoneNumber"
                  placeholder="07XXXXXXXX"
                  pattern="^07\d{8}$"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Amount */}
              <div className="mb-3">
                <label className="form-label">Amount (Ksh)</label>
                <input
                  type="number"
                  className="form-control"
                  name="Amount"
                  placeholder="Enter amount"
                  value={formData.Amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Submit Button */}
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
