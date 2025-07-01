import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { devLog } from "../../utils/devLog";

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
        const res = await axios.post(
          `${baseURL}/api/auth/check-role`,
          { Phone: phone },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const role = res.data.role;

        if (role === "ordinary_user") {
          // Direct login without password
          const loginRes = await axios.post(
            `${baseURL}/api/auth/login`,
            { Phone: phone },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          const user = loginRes.data.user;
          setUserId(user.id);
          setToken(loginRes.data.token);
          setRole(user.role);
          navigate("/");
          window.location.reload();
          return;
        } else {
          // Require password for staff/admin
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

      const response = await axios.post(
        `${baseURL}/api/auth/login`,
        { Phone: phone, Password: password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const user = response.data.user;
      setUserId(user.id);
      setToken(response.data.token);
      setRole(user.role);
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await axios.post(`${baseURL}/api/signup`, formData);
      setSuccess(res.data.message || "Signup successful! Please login.");

      setFormData({
        Name: "",
        Phone: "",
        Password: "",
        Role: "ordinary_user",
      });

      setTimeout(() => {
        setSuccess(null);
        setIsLogin(true);
      }, 2000);
    } catch (err) {
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
            <button className="btn btn-link" onClick={toggleForm}>
              {isLogin ? "Sign Up / Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
