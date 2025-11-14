import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { devLog } from "../../utils/devLog";

// ✅ Axios global setup for cookies and base URL
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [requirePassword, setRequirePassword] = useState(false);

  const [formData, setFormData] = useState({
    Name: "",
    Phone: "",
    Password: "",
    Role: "ordinary_user",
  });

  const navigate = useNavigate();
  const { setUserId, setToken, setRole } = useContext(UserContext);
  const baseURL = import.meta.env.VITE_API_URL;

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!phone) {
      setError("Phone number is required.");
      setLoading(false);
      return;
    }

    try {
      if (!requirePassword) {
        // Phase 1: Role check
        const res = await axios.post(`${baseURL}/api/auth/check-role`, { Phone: phone });
        const role = res.data.role;

        if (role === "ordinary_user") {
          // Direct login without password
          const loginRes = await axios.post(`${baseURL}/api/auth/login`, { Phone: phone });
          const user = loginRes.data.user;

          setUserId(user.id);
          setToken(loginRes.data.token);
          setRole(user.role);

          // ✅ Attach token for future axios requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${loginRes.data.token}`;

          navigate("/");
          window.location.reload();
          return;
        } else {
          setRequirePassword(true);
          setError("Password required for staff or admin.");
          return;
        }
      }

      // Phase 2: Staff/admin login with password
      if (!password) {
        setError("Password is required.");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${baseURL}/api/auth/login`, { Phone: phone, Password: password });

      const user = response.data.user;
      setUserId(user.id);
      setToken(response.data.token);
      setRole(user.role);

      // ✅ Attach token for subsequent requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        setError(error.response.data?.errorMessage || "Login failed.");
      } else if (error.request) {
        setError("No response from server. Check your network or backend.");
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post(`${baseURL}/api/signup`, formData, {
        withCredentials: true,
      });

      // ✅ If backend returns token + user (as it does now)
      const { user, token, message } = res.data;

      if (user && token) {
        setSuccess(message || "Signup successful!");

        // Save to context
        setUserId(user.id);
        setToken(token);
        setRole(user.role);

        // ✅ Attach token for future axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // ✅ Navigate directly to home/dashboard
        navigate("/");
        window.location.reload();
      } else {
        setSuccess("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.errorMessage || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 shadow-lg rounded p-3">
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light p-3 rounded">
          <h2 className="text-center">Welcome to SeleneECS</h2>
        </div>

        <div className="col-md-6 p-2">
          <h2 className="text-center mb-2">{isLogin ? "Login" : "Sign Up"}</h2>

          {error && <p className="alert alert-danger">{error}</p>}
          {success && <p className="alert alert-success">{success}</p>}

          {isLogin ? (
            <LoginForm
              phone={phone}
              setPhone={setPhone}
              password={password}
              setPassword={setPassword}
              handleSubmit={handleLogin}
              loading={loading}
              requirePassword={requirePassword}
            />
          ) : (
            <SignupForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSignup}
              loading={loading}
            />
          )}

          <p className="mt-2 text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button className="btn btn-primary w-100" onClick={toggleForm}>
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
