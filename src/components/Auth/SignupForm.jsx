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
        <label htmlFor="Name">Full Names</label>
        <input
          type="text"
          id="Name"
          name="Name"
          className="form-control"
          value={formData.Name}
          onChange={handleChange}
          required
          pattern="^[A-Za-z\s]+$"
          title="Only letters and spaces are allowed"
        />
      </div>


      {/* Phone Field */}
      <div className="mb-3">
        <label htmlFor="Phone">Phone</label>
        <input
          type="text"
          id="Phone"
          name="Phone"
          placeholder="07xxxxxxxx or 01xxxxxxxx"
          className="form-control"
          value={formData.Phone}
          onChange={handleChange}
          required
          pattern="^(07|01)\d{8}$"
          title="Phone number must start with 07 or 01 and be 10 digits long"
        />
      </div>


      <button type="submit" className="btn btn-success w-100" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up / Register"}
      </button>
    </form>
  );
};

export default SignupForm;
