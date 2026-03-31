import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import Cookies from "js-cookie";
import "./Support.css";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { role, userId } = useContext(UserContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:9000/api";

  // Fetch users
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/users`, {
        params: { page, limit: usersPerPage },
      });

      if (response.data && Array.isArray(response.data.users)) {
        // Normalize fields
        const normalized = response.data.users.map((u) => ({
          id: u.id,
          First_Name: u.First_Name ?? u.firstName ?? "",
          Last_Name: u.Last_Name ?? u.lastName ?? "",
          Phone: u.Phone ?? u.phone ?? "",
          Email: u.Email ?? u.email ?? "",
          Role: u.Role ?? u.role ?? "ordinary_user",
        }));

        setUsers(normalized);
        setTotalUsers(response.data.total ?? normalized.length);
      } else {
        console.error("Unexpected API response format:", response.data);
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error);
      setUsers([]);
      setTotalUsers(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (role === "admin") {
      fetchUsers(currentPage);
    }
  }, [currentPage, role]);

  // Search/filter
  const filteredUsers = users.filter(
    (user) =>
      (user.Email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.First_Name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.Last_Name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleEditClick = (user) => {
    setEditMode(user.id);
    setEditedUser({ ...user });
  };

  const handleInputChange = (e) =>
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });

  const handleSave = async (id) => {
    try {
      const token = Cookies.get("auth_token");
      await axios.put(`${baseURL}/api/users/${id}`, editedUser, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setEditMode(null);
      setSuccessMessage("User updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      fetchUsers(currentPage); // refresh
    } catch (error) {
      setErrorMessage("Error updating user. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Error updating user:", error.response?.data || error);
    }
  };

  if (role !== "admin") {
    return (
      <div className="container mt-4 text-center">
        <h3 className="text-danger">Access Denied</h3>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">User List</h2>

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
          placeholder="Search by name or email..."
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      {editMode === user.id ? (
                        <input
                          type="text"
                          name="First_Name"
                          value={editedUser.First_Name}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      ) : (
                        user.First_Name
                      )}
                    </td>
                    <td>
                      {editMode === user.id ? (
                        <input
                          type="text"
                          name="Last_Name"
                          value={editedUser.Last_Name}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      ) : (
                        user.Last_Name
                      )}
                    </td>
                    <td>
                      {editMode === user.id ? (
                        <input
                          type="text"
                          name="Phone"
                          value={editedUser.Phone}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      ) : (
                        user.Phone
                      )}
                    </td>
                    <td>{user.Email}</td>
                    <td>
                      {editMode === user.id ? (
                        <select
                          name="Role"
                          value={editedUser.Role}
                          onChange={handleInputChange}
                          className="form-select"
                        >
                          <option value="ordinary_user">Ordinary User</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        user.Role
                      )}
                    </td>
                    <td>
                      {editMode === user.id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleSave(user.id)}
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
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
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
          Page {currentPage} of {Math.max(1, Math.ceil(totalUsers / usersPerPage))}
        </span>
        <button
          className="btn btn-outline-primary ms-2"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage * usersPerPage >= totalUsers}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUserManagement;