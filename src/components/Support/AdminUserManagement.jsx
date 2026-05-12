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

  const { role } = useContext(UserContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  // Base URL
  const baseURL =
    import.meta.env.VITE_API_URL || "http://localhost:9000";

  // Fetch users
  const fetchUsers = async (page = 1) => {
    setLoading(true);

    try {
      const token = Cookies.get("auth_token");

      const response = await axios.get(
        `${baseURL}/api/users`,
        {
          params: {
            page,
            limit: usersPerPage,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },

          withCredentials: true,
        }
      );

      if (
        response.data &&
        Array.isArray(response.data.users)
      ) {
        const normalized = response.data.users.map(
          (u) => ({
            id: u.id,
            Name: u.Name ?? "",
            Phone: u.Phone ?? "",
            Role: u.Role ?? "ordinary_user",
            Password: "",
          })
        );

        setUsers(normalized);

        setTotalUsers(
          response.data.total ?? normalized.length
        );
      } else {
        console.error(
          "Unexpected API response:",
          response.data
        );

        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error
      );

      setUsers([]);
      setTotalUsers(0);
    }

    setLoading(false);
  };

  // Load users
  useEffect(() => {
    if (role === "admin") {
      fetchUsers(currentPage);
    }
  }, [currentPage, role]);

  // Search filter
  const filteredUsers = users.filter((user) =>
    (user.Name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Edit user
  const handleEditClick = (user) => {
    setEditMode(user.id);

    setEditedUser({
      ...user,
      Password: "",
    });
  };

  // Input changes
  const handleInputChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  // Save user
  const handleSave = async (id) => {
    try {
      const token = Cookies.get("auth_token");

      const payload = {
        Name: editedUser.Name,
        Phone: editedUser.Phone,
        Role: editedUser.Role,
      };

      // Only send password if entered
      if (
        editedUser.Password &&
        editedUser.Password.trim() !== ""
      ) {
        payload.Password = editedUser.Password;
      }

      await axios.put(
        `${baseURL}/api/users/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          withCredentials: true,
        }
      );

      setEditMode(null);

      setSuccessMessage(
        "User updated successfully!"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      fetchUsers(currentPage);

    } catch (error) {

      console.error(
        "Error updating user:",
        error.response?.data || error
      );

      setErrorMessage(
        error.response?.data?.errorMessage ||
          "Error updating user"
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  // Access denied
  if (role !== "admin") {
    return (
      <div className="container mt-4 text-center">
        <h3 className="text-danger">
          Access Denied
        </h3>

        <p>
          You are not authorized to view this
          page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <h2 className="mb-3 text-center">
        User Management
      </h2>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success text-center">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger text-center">
          {errorMessage}
        </div>
      )}

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center">
          Loading...
        </p>
      ) : (
        <div className="table-responsive">

          <table className="table table-bordered table-striped table-hover w-100">

            <thead className="table-dark text-nowrap">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => (

                  <tr key={user.id}>

                    {/* ID */}
                    <td>{user.id}</td>

                    {/* Name */}
                    <td>
                      {editMode === user.id ? (
                        <input
                          type="text"
                          name="Name"
                          value={editedUser.Name}
                          onChange={
                            handleInputChange
                          }
                          className="form-control"
                        />
                      ) : (
                        user.Name
                      )}
                    </td>

                    {/* Phone */}
                    <td>
                      {editMode === user.id ? (
                        <input
                          type="text"
                          name="Phone"
                          value={editedUser.Phone}
                          onChange={
                            handleInputChange
                          }
                          className="form-control"
                        />
                      ) : (
                        user.Phone
                      )}
                    </td>

                    {/* Role */}
                    <td>
                      {editMode === user.id ? (
                        <select
                          name="Role"
                          value={editedUser.Role}
                          onChange={
                            handleInputChange
                          }
                          className="form-select"
                        >
                          <option value="ordinary_user">
                            Ordinary User
                          </option>

                          <option value="staff">
                            Staff
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>
                      ) : (
                        user.Role
                      )}
                    </td>

                    {/* Password */}
                    <td>
                      {editMode === user.id ? (
                        <input
                          type="password"
                          name="Password"
                          value={
                            editedUser.Password ||
                            ""
                          }
                          onChange={
                            handleInputChange
                          }
                          className="form-control"
                          placeholder="New password"
                        />
                      ) : (
                        "••••••••"
                      )}
                    </td>

                    {/* Actions */}
                    <td>

                      {editMode === user.id ? (
                        <>

                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              handleSave(user.id)
                            }
                          >
                            Save
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setEditMode(null)
                            }
                          >
                            Cancel
                          </button>

                        </>
                      ) : (

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            handleEditClick(user)
                          }
                        >
                          Edit
                        </button>

                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="6"
                    className="text-center"
                  >
                    No users found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">

        <button
          className="btn btn-outline-primary me-2"
          onClick={() =>
            setCurrentPage((prev) =>
              Math.max(prev - 1, 1)
            )
          }
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="align-self-center">

          Page {currentPage} of{" "}

          {Math.max(
            1,
            Math.ceil(
              totalUsers / usersPerPage
            )
          )}

        </span>

        <button
          className="btn btn-outline-primary ms-2"
          onClick={() =>
            setCurrentPage((prev) => prev + 1)
          }
          disabled={
            currentPage * usersPerPage >=
            totalUsers
          }
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default AdminUserManagement;