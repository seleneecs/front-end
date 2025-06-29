import React from "react";

const SignupForm = ({ formData, setFormData, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit}>
    {["Name",  "Phone", "Password"].map((field) => (
      <div className="mb-3" key={field}>
        <label>{field.replace("_", " ")}</label>
        <input
          type={field === "Password" ? "password" : "text"}
          className="form-control"
          value={formData[field]}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          required
        />
      </div>
    ))}
    

    <button type="submit" className="btn btn-success w-100" disabled={loading}>
      {loading ? "Signing up..." : "Sign Up"}
    </button>
  </form>
);

export default SignupForm;
