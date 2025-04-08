import React from "react";

const SecurityCheckForm = ({ securityData, setSecurityData, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit}>
    <div className="mb-3">
      <label>Email</label>
      <input
        type="email"
        className="form-control"
        value={securityData.email}
        onChange={(e) => setSecurityData({ ...securityData, email: e.target.value })}
        required
      />
    </div>
    <div className="mb-3">
      <label>Security Question</label>
      <select
        className="form-select"
        value={securityData.question}
        onChange={(e) => setSecurityData({ ...securityData, question: e.target.value })}
        required
      >
        <option value="">Select a question</option>
        <option value="What was the name of your first pet?">What was the name of your first pet?</option>
        <option value="What is your mother’s maiden name?">What is your mother’s maiden name?</option>
        <option value="What was the name of your primary school?">What was the name of your primary school?</option>
      </select>
    </div>
    <div className="mb-3">
      <label>Answer</label>
      <input
        type="text"
        className="form-control"
        value={securityData.answer}
        onChange={(e) => setSecurityData({ ...securityData, answer: e.target.value })}
        required
      />
    </div>

    <button type="submit" className="btn btn-warning w-100" disabled={loading}>
      {loading ? "Verifying..." : "Verify"}
    </button>
  </form>
);

export default SecurityCheckForm;
