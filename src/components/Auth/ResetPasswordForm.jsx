import React from "react";

const ResetPasswordForm = ({ email, newPassword, setNewPassword, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label>Email</label>
      <input type="email" className="form-control" value={email} disabled />
    </div>
    <div className="mb-3">
      <label>New Password</label>
      <input
        type="password"
        className="form-control"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
    </div>
    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
      {loading ? "Resetting..." : "Reset Password"}
    </button>
  </form>
);

export default ResetPasswordForm;
