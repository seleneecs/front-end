import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout/Layout";

const SubjectListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { seleneMaterials = [], sectionName, subjectsByLevel = [] } = location.state || {};

  const [schema, setSchema] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [availableMaterials, setAvailableMaterials] = useState([]);

  useEffect(() => {
    if (seleneMaterials.length > 0) {
      setSchema(seleneMaterials[0].schemaName);
    }
  }, [seleneMaterials]);

  const handleSubjectClick = (subject, level) => {
    console.log("Section:", sectionName);
    console.log("Level:", level);
    console.log("Subject:", subject);
    console.log("Teaching & Learning Materials:", seleneMaterials.map((item) => item.unit));

    setSelectedSubject(subject);
    setSelectedLevel(level);

    const filtered = seleneMaterials.filter((item) => item.subject === subject);
    setAvailableMaterials(filtered.length ? filtered : seleneMaterials);
  };

  const handleUnitClick = async (
    tableName,
    optionalTableName,
    subject,
    schema,
    category
  ) => {
    const grade = selectedLevel;
    const table = optionalTableName?.toLowerCase() || tableName;

    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const queryParams = {
        grade,
        tableName: table,
        subject,
        schema,
        category,
      };

      const fullURL = `${baseURL}/api/resource?${new URLSearchParams(queryParams).toString()}`;

      console.log("Fetching data from URL:", fullURL);

      const response = await axios.get(fullURL, { withCredentials: true });

      navigate("/display", {
        state: { data: response.data, type: "table", fullURL },
      });
    } catch (error) {
      console.error("Raw error object:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Unexpected error. If this continues, contact support at infot@seleneecs.com or Tel: 0748 996 731";
      window.alert(`Error: ${errorMessage}`);
    }
  };

  return (    
    <Layout>
      <div>            
            {selectedSubject ? (
        // ✅ Panel is the only visible content
        <div
    className="position-fixed top-0 start-0 w-100 h-100 overflow-auto bg-light p-4"
    style={{ zIndex: 9999 }}
  >
    <div className="container d-flex justify-content-center align-items-start">
      <div className="col-md-8 bg-white shadow rounded p-4">
        <h3 className="mb-4">
          Teaching & Learning Materials for{" "}
          <strong>{selectedSubject}</strong>:
        </h3>
        <ul className="list-unstyled">
          {availableMaterials.map((item, index) => (
            <li
              key={`${item.unit}-${index}`}
              className="mb-2 ps-2"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleUnitClick(
                  item.unit.toLowerCase(),
                  item.tableName,
                  selectedSubject,
                  schema,
                  selectedLevel
                )
              }
            >
              📘 {item.unit}
            </li>
          ))}
        </ul>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => {
            setSelectedSubject(null);
            setSelectedLevel(null);
          }}
        >
          Close Panel
        </button>
      </div>
    </div>
  </div>
      ) : (
        // ✅ Normal view when no subject is selected
        <>
  <div className="container text-center my-4">
    <h2>{sectionName}</h2>
    <div className="row justify-content-center">
      <div className="col-md-8 text-start">
        <h3>Subjects:</h3>
        {subjectsByLevel.map(({ level, subjects }) => (
          <div key={level} className="mb-4">
            <h5 className="text-primary">{level}</h5>
            <ul className="list-unstyled ps-3">
              {subjects.map((subject) => (
                <li
                  key={`${level}-${subject}`}
                  onClick={() => handleSubjectClick(subject, level)}
                  style={{ cursor: "pointer", margin: "8px 0" }}
                >
                  {subject}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
</>

      )}
      
      
    </div>
    </Layout>
  );
};

export default SubjectListPage;
