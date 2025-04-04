import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const SubscriptionForm = () => {

  const { userId, setUserId } = useContext(UserContext);  // ✅ Include setUserId

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subscribed_category: "",
    PhoneNumber: "",
    Amount: "",
    start_date: "",
    end_date: "",
    user_id: "", // ✅ Initially empty, updated when userId is available
  });

  useEffect(() => {
    console.log("🔍 Updating user_id in formData:", userId);
  
    if (userId) {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30);
  
      setFormData((prevData) => ({
        ...prevData,
        user_id: userId, // ✅ Ensure user_id is updated
        start_date: today.toISOString().split("T")[0],
        end_date: futureDate.toISOString().split("T")[0],
      }));
    }
  }, [userId]); // ✅ Runs when userId changes
  
  

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData); // ✅ Log formData before sending

    if (!formData.user_id) {
        console.error("❌ user_id is missing!");
        alert("User ID is missing. Please refresh and try again.");
        return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/subscriptions/stk/push`, formData, {
        withCredentials: true,
    });
    

        console.log("Subscription response:", response.data);
        alert("Subscription request sent successfully!");
        navigate("/");
    } catch (error) {
        console.error("Subscription error:", error.response ? error.response.data : error.message);
        alert("Failed to process subscription.");
    }
};


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="row justify-content-center">
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
