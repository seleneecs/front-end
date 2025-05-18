import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SecurityCheckForm from "./SecurityCheckForm";
import ResetPasswordForm from "./ResetPasswordForm";
import { devLog } from "../../utils/devLog";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const [securityData, setSecurityData] = useState({
    email: "",
    question: "",
    answer: "",
  });
  const [newPassword, setNewPassword] = useState("");
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
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/login`,
        { Email: email, Password: password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.user?.id) {
        setUserId(response.data.user.id);
        setToken(response.data.token);
        setRole(response.data.user.role || "ordinary_user");
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post(`${baseURL}/api/signup`, formData);
      setSuccess(response.data.message || "Signup successful! Redirecting...");
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
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError(err?.response?.data?.errorMessage || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post(`${baseURL}/api/auth/verify-security`, securityData);
      devLog("data on verification", response.data)
      if (response.data.message ==='Security question verified successfully') {
        setShowReset("reset-password");
      } else {
        setError("Security answer is incorrect or user not found.");
      }
    } catch (err) {
      setError(err.response?.data?.errorMessage || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post(`${baseURL}/api/auth/reset-password`, {
        email: securityData.email,
        newPassword,
      });
      setSuccess(response.data.message || "Password reset successful.");
      setShowReset(false);
    } catch (err) {
      setError(err.response?.data?.errorMessage || "Failed to reset password.");
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

          {showReset === "reset-password" ? (
            <ResetPasswordForm
              email={securityData.email}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              loading={loading}
              handleSubmit={handlePasswordReset}
            />
          ) : showReset ? (
            <SecurityCheckForm
              securityData={securityData}
              setSecurityData={setSecurityData}
              handleSubmit={handleSecurityCheck}
              loading={loading}
            />
          ) : isLogin ? (
            <LoginForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              handleSubmit={handleLogin}
              loading={loading}
              onForgotPassword={() => {
                setIsLogin(false);
                setShowReset(true);
                setError(null);
                setSuccess(null);
              }}
            />
          ) : (
            <SignupForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSignup}
              loading={loading}
            />
          )}

          {!showReset && (
            <p className="mt-2 text-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button className="btn btn-link" onClick={toggleForm}>
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
