import React from "react";

const SignupForm = ({ formData, setFormData, handleSubmit, loading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name Field */}
      <div className="mb-3">
        <label htmlFor="Name">Name</label>
        <input
          type="text"
          id="Name"
          name="Name"
          className="form-control"
          value={formData.Name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Phone Field */}
      <div className="mb-3">
        <label htmlFor="Phone">Phone</label>
        <input
          type="text"
          id="Phone"
          name="Phone"
          className="form-control"
          value={formData.Phone}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-success w-100" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up / Register"}
      </button>
    </form>
  );
};

export default SignupForm;
