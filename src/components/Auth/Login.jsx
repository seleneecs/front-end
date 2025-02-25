import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const baseURL = import.meta.env.VITE_API_URL;

    try {
        const response = await axios.post(
            `${baseURL}/api/auth/login`,
            { Email: email, Password: password }, // Send JSON, not form-data
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, // Ensures cookies are sent and received
            }
        );

        console.log("Login Success:", response.data);
        navigate("/");
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
