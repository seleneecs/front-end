import React from "react";

const LoginForm = ({ phone, password, setPhone, setPassword, handleSubmit, loading, onForgotPassword }) => (
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label>Phone</label>
      <input
        type="tel"
        className="form-control"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
    </div>
    <div className="mb-3">
      <label>Password</label>
      <input
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <button type="button" className="btn btn-link" onClick={onForgotPassword}>
        Forgot Password?
      </button>
    </div>
  </form>
);

export default LoginForm;
