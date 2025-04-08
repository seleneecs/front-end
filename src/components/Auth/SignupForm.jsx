import React from "react";

const SignupForm = ({ formData, setFormData, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit}>
    {["First_Name", "Last_Name", "Phone", "Email", "Password"].map((field) => (
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

    <div className="mb-3">
      <label>Security Question</label>
      <select
        className="form-select"
        value={formData.security_question}
        onChange={(e) => setFormData({ ...formData, security_question: e.target.value })}
        required
      >
        <option value="">Select a question</option>
        <option value="What was the name of your first pet?">What was the name of your first pet?</option>
        <option value="What is your mother’s maiden name?">What is your mother’s maiden name?</option>
        <option value="What was the name of your primary school?">What was the name of your primary school?</option>
      </select>
    </div>

    <div className="mb-3">
      <label>Security Answer</label>
      <input
        type="text"
        className="form-control"
        value={formData.security_answer}
        onChange={(e) => setFormData({ ...formData, security_answer: e.target.value })}
        required
      />
    </div>

    <button type="submit" className="btn btn-success w-100" disabled={loading}>
      {loading ? "Signing up..." : "Sign Up"}
    </button>
  </form>
);

export default SignupForm;
