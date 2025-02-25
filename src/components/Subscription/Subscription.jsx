import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Header/Header.jsx"; // ✅ Import Auth Context

const SubscriptionForm = () => {
  const { user } = useAuth(); // ✅ Get userId from context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subscribed_category: "",
    PhoneNumber: "",
    Amount: "",
    start_date: "",
    end_date: "",
    user_id: user ? user.id : "", // ✅ Use user_id from context
  });

  useEffect(() => {
    if (user) {
      console.log("User ID from context:", user.id); // ✅ Log user ID
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30);

      setFormData((prevData) => ({
        ...prevData,
        user_id: user.id, // ✅ Dynamically update user_id
        start_date: today.toISOString().split("T")[0],
        end_date: futureDate.toISOString().split("T")[0],
      }));
    }
  }, [user]);

  const categories = [
    "PP1", "PP2", "GRADE 1", "GRADE 2", "GRADE 3", "GRADE 4", "GRADE 5",
    "GRADE 6", "GRADE 7", "GRADE 8", "GRADE 9", "FORM 2", "FORM 3", "FORM 4",
    "STEM", "ARTS AND SPORTS", "SOCIAL SCIENCES"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9000/subscriptions/stk/push", formData, { withCredentials: true });
      alert("Subscription request sent successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to process subscription.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h3 className="text-center mb-4">Subscribe Now</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Subscription Category</label>
                <select
                  className="form-select"
                  name="subscribed_category"
                  value={formData.subscribed_category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((category, index) => (
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
                  placeholder="Enter your phone number"
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

              <input type="hidden" name="user_id" value={formData.user_id} />
              <input type="hidden" name="start_date" value={formData.start_date} />
              <input type="hidden" name="end_date" value={formData.end_date} />

              <button type="submit" className="btn btn-primary w-100">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
