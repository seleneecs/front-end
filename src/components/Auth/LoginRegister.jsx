import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { setUserId, setToken, setRole } = useContext(UserContext);

  // Form state for login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form state for signup
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Phone: "",
    Email: "",
    Password: "",
    security_question: "",
    security_answer: "",
    Role: "ordinary_user",
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const baseURL = import.meta.env.VITE_API_URL;

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${baseURL}/api/auth/login`,
        { Email: email, Password: password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      console.log("Login Response:", response.data);

      if (response.data.user?.id) {
        setUserId(response.data.user.id);
        setToken(response.data.token);
        setRole(response.data.user.role || "ordinary_user");

        console.log("Navigating to home...");
        navigate("/");
      } else {
        setError("No user ID in response");
      }
    } catch (error) {
      setError(
        error.response?.status === 429
          ? "Too many failed login attempts. Try again later."
          : error.response?.data?.errorMessage || "No Network"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${baseURL}/api/signup`, formData);

      console.log("Signup Response:", response.data);

      // Show success message
      setSuccess(response.data.message || "Signup successful! Redirecting...");

      // Clear form data
      setFormData({
        First_Name: "",
        Last_Name: "",
        Phone: "",
        Email: "",
        Password: "",
        security_question: "",
        security_answer: "",
        Role: "ordinary_user",
      });

      // Refresh the page after 2 seconds
      setTimeout(() => {
        console.log("Refreshing page...");
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.errorMessage || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 shadow-lg rounded p-3">
        {/* Left Side */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light p-3 rounded">
          <h2 className="text-center">Welcome to SeleneECS</h2>
        </div>

        {/* Right Side (Forms) */}
        <div className="col-md-6 p-2">
          <h2 className="text-center mb-2">{isLogin ? "Login" : "Sign Up"}</h2>

          {error && <p className="alert alert-danger">{error}</p>}
          {success && <p className="alert alert-success">{success}</p>}

          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between mb-3">
                <a href="#" className="text-decoration-none">
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="mb-2">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="First_Name"
                  className="form-control"
                  value={formData.First_Name}
                  onChange={(e) => setFormData({ ...formData, First_Name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="Last_Name"
                  className="form-control"
                  value={formData.Last_Name}
                  onChange={(e) => setFormData({ ...formData, Last_Name: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="Phone"
                  className="form-control"
                  value={formData.Phone}
                  onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="Email"
                  className="form-control"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="Password"
                  className="form-control"
                  value={formData.Password}
                  onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                  required
                />
                <small className="text-muted">
                  Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.
                </small>
              </div>

              {/* Security Question Fields */}
              <div className="mb-2">
                <label className="form-label">Security Question</label>
                <input
                  type="text"
                  name="security_question"
                  className="form-control"
                  value={formData.security_question}
                  onChange={(e) => setFormData({ ...formData, security_question: e.target.value })}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Security Answer</label>
                <input
                  type="text"
                  name="security_answer"
                  className="form-control"
                  value={formData.security_answer}
                  onChange={(e) => setFormData({ ...formData, security_answer: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          )}

          <p className="mt-2 text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button className="btn btn-link" onClick={toggleForm}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
