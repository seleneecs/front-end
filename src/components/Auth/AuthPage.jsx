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

    try {
      const response = await axios.post(
        `${baseURL}/api/auth/login`,
        { Phone: phone, Password: password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.user?.id) {
        setUserId(response.data.user.id);
        setToken(response.data.token);
        setRole(response.data.user.role || "ordinary_user");
        navigate("/");
        window.location.reload();
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
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
