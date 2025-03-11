import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import Cookies from "js-cookie";
import "./Support.css";

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editedSubscription, setEditedSubscription] = useState({});
  const { role } = useContext(UserContext);
console.log("edited subscription",editedSubscription)
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const subscriptionsPerPage = 10;
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:9000/api";

  const fetchSubscriptions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/subscriptions`, {
        params: { page, limit: subscriptionsPerPage },
      });

      if (response.data && Array.isArray(response.data.subscriptions)) {
        setSubscriptions(response.data.subscriptions);
        setTotalSubscriptions(response.data.total || 0);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error.response?.data || error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions(currentPage);
  }, [currentPage]);

  // Filter subscriptions based on MpesaReceiptNumber
  const filteredSubscriptions = subscriptions.filter((sub) =>
    (sub.MpesaReceiptNumber || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (subscription) => {
    setEditMode(subscription.id);
    setEditedSubscription({ ...subscription });
  };

  const handleInputChange = (e) => {
    setEditedSubscription({ ...editedSubscription, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const token = Cookies.get("auth_token");
  
      // Ensure correct data types before sending
      const updatedFields = {
        Amount: editedSubscription.Amount, // Keep as string if DB expects string, else convert to Number(editedSubscription.Amount)
        subscribed_category: editedSubscription.subscribed_category, // Ensure category is included
        end_date: editedSubscription.end_date
          ? new Date(editedSubscription.end_date).toISOString().split("T")[0] // Format as YYYY-MM-DD
          : null,
      };
  
      console.log("Sending updated data:", updatedFields);
  
      const editURL = `${baseURL}/api/subscription/${id}`;
      console.log("editURL:", editURL)
      await axios.put(editURL, updatedFields, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
  
      setEditMode(null);
      setSuccessMessage("Subscription updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
  
      // Refetch subscriptions
      fetchSubscriptions(currentPage);
    } catch (error) {
      setErrorMessage("Error updating subscription. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Error updating subscription:", error.response?.data || error);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Subscription List</h2>

      {successMessage && (
        <div className="alert alert-success text-center">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Mpesa Receipt Number..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover w-100">
            <thead className="table-dark text-nowrap">
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Amount</th>
                <th>Mpesa Receipt</th>
                <th>Transaction Date</th>
                <th>Phone Number</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {filteredSubscriptions.map((sub) => (
    <tr key={sub.id}>
      <td>{sub.id}</td>
      <td>{sub.user_id}</td>
      <td>
        {editMode === sub.id ? (
          <input
            type="text"
            name="Amount"
            value={editedSubscription.Amount}
            onChange={handleInputChange}
            className="form-control"
          />
        ) : (
          sub.Amount
        )}
      </td>
      <td>{sub.MpesaReceiptNumber}</td>
      <td>{new Date(sub.TransactionDate).toLocaleString()}</td>
      <td>{sub.PhoneNumber}</td>
      <td>{new Date(sub.start_date).toLocaleDateString()}</td>
      <td>
        {editMode === sub.id ? (
          <input
            type="date"
            name="end_date"
            value={
              editedSubscription.end_date
                ? new Date(editedSubscription.end_date).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            className="form-control"
          />
        ) : (
          new Date(sub.end_date).toLocaleDateString()
        )}
      </td>
      <td>
        {editMode === sub.id ? (
          <input
            type="text"
            name="subscribed_category"
            value={editedSubscription.subscribed_category}
            onChange={handleInputChange}
            className="form-control"
          />
        ) : (
          sub.subscribed_category
        )}
      </td>
      <td>
        {editMode === sub.id ? (
          <>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => handleSave(sub.id)}
            >
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setEditMode(null)}
            >
              Cancel
            </button>
          </>
        ) : role === "admin" ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleEditClick(sub)}
          >
            Edit
          </button>
        ) : (
          "-"
        )}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.max(1, Math.ceil(totalSubscriptions / subscriptionsPerPage))}
        </span>
        <button
          className="btn btn-outline-primary ms-2"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage * subscriptionsPerPage >= totalSubscriptions}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
