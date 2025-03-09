import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import Cookies from "js-cookie";
import "./Support.css";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editedUser, setEditedUser] = useState({});
  const { userId, role } = useContext(UserContext);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:9000/api";

  const fetchUsers = async (page = 1) => {
    try {
      const response = await axios.get(`${baseURL}/api/users`, {
        params: { page, limit: usersPerPage },
      });

      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        setTotalUsers(response.data.total || 0);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Derived filteredUsers state
  const filteredUsers = users.filter((user) =>
    user.Email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (user) => {
    setEditMode(user.id);
    setEditedUser({ ...user });
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      const token = Cookies.get("auth_token");

      await axios.put(
        `${baseURL}/users/${id}`,
        editedUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setEditMode(null);
      setSuccessMessage("User updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Refetch updated user list
      fetchUsers(currentPage);
    } catch (error) {
      setErrorMessage("Error updating user. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error("Error updating user:", error.response?.data || error);
    }
  };

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
          placeholder="Search by email..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

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
            {filteredUsers.map((user) => (
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
                  {editMode === user.id && role === "admin" ? (
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
                  ) : role === "admin" || user.id === userId ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditClick(user)}
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
          Page {currentPage} of {Math.ceil(totalUsers / usersPerPage)}
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
