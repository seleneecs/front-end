import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserCotext"; // ✅ Import context

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserId, setToken, setRole } = useContext(UserContext); // ✅ Access context

  const handleLogin = async (e) => {
    e.preventDefault();
    const baseURL = import.meta.env.VITE_API_URL;

    try {
      const response = await axios.post(
        `${baseURL}/api/auth/login`,
        { Email: email, Password: password }, // Send JSON
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensure cookies are handled
        }
      );

      console.log("Login Success:", response.data);

      // ✅ Set UserContext values BEFORE navigating
      if (response.data.user && response.data.user.id) {
        setUserId(response.data.user.id);
        setToken(response.data.token);
        setRole(response.data.user.role || "ordinary_user");

        console.log("User ID Set in Context:", response.data.user.id); // Debugging log
      } else {
        console.warn("⚠️ No user ID in response:", response.data);
      }

      navigate("/"); // Navigate after setting context
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
