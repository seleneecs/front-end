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
  { value: 'OTHERS RESOURCES', label: 'MORE RESOURCES', color: '#0000FF' },
  
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
  <h2 className="mb-3">📚 Curriculum-Based Education Subscriptions</h2> 
<div className="bg-white p-4 rounded shadow-sm subscription-card">
  <h4 className="text-primary fw-semibold mb-3">Subscription Pricing</h4>
  <table className="table table-hover text-center subscription-table">
    <thead className="table-primary">
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Daily<br /><small>(KES 20)</small></th>
        <th scope="col">Monthly<br /><small>(KES 300)</small></th>
        <th scope="col">Yearly<br /><small>(KES 1800)</small></th>
      </tr>
    </thead>
    <tbody>
      {[
        ["🧒 PP1", "20", "300", "1800"],
        ["🧒 PP2", "20", "300", "1800"],
        ["📘 GRADE 1", "20", "300", "1800"],
        ["📘 GRADE 2", "20", "300", "1800"],
        ["📘 GRADE 3", "20", "300", "1800"],
        ["📘 GRADE 4", "20", "300", "1800"],
        ["📘 GRADE 5", "20", "300", "1800"],
        ["📘 GRADE 6", "20", "300", "1800"],
        ["📘 GRADE 7", "20", "300", "1800"],
        ["📘 GRADE 8", "20", "300", "1800"],
        ["🧠 GRADE 9", "20", "300", "1800"],
        ["🧠 FORM 2", "20", "300", "1800"],
        ["🧠 FORM 3", "20", "300", "1800"],
        ["🧠 FORM 4", "20", "300", "1800"],
        ["🔬 STEM", "20", "300", "1800"],
        ["🎨 ARTS & SPORTS", "20", "300", "1800"],
        ["🌍 SOCIAL SCIENCES", "20", "300", "1800"],
        ["📦 MORE RESOURCES (worksheets, lesson plans, videos)", "20", "300", "1800"],
      ].map(([label, d, m, y], i) => (
        <tr key={i}>
          <td className="text-start">{label}</td>
          <td>{d}</td>
          <td>{m}</td>
          <td>{y}</td>
        </tr>
      ))}
    </tbody>
  </table>
  <p className="text-muted text-center small mt-2">
    Gain full access to educational resources aligned with Kenya’s curriculum.
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
                  placeholder="07/1XXXXXXXX"
                  pattern="^(07|01)\d{8}$"
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
                  onInvalid={(e) => {
                    if (!e.target.value) {
                      e.target.setCustomValidity("Please enter the amount.");
                    } else if (e.target.validity.rangeUnderflow) {
                      e.target.setCustomValidity("Amount must be at least 20 Ksh.");
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity("")}
                  required
                  min="20"
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
