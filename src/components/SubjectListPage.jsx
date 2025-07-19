import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SubjectListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionName, subjects } = location.state || {};

  // Redirect to home or show message if no data is found
  if (!sectionName || !subjects) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>No subject data found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{sectionName} Subjects</h2>
      {subjects.length > 0 ? (
        <ul>
          {subjects.map((subject, index) => (
            <li key={index}>{subject}</li>
          ))}
        </ul>
      ) : (
        <p>No subjects found.</p>
      )}
    </div>
  );
};

export default SubjectListPage;
