import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./secondary.css";
import axios from "axios";


const SecondarySchool = () => {
  const navigate = useNavigate()
  const [selectedLearningArea, setSelectedLearningArea] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(null);

  const learningAreasPerPathway = [
    {
      pathway: "STEM",
      learningAreas: {
        "Pure Sciences": ["Biology", "Chemistry", "Physics", "Mathematics"],
        "Applied Science": ["Agriculture", "Computer Science", "Food & Nutrition", "Home Management"],
        "Technical & Engineering": ["Agriculturaal Technology","Geo Science Technology","Marine & Fisheries Tecnology",
          "Aviation Technology", "Wood Technology","Electrical Tecnology", "Metal Technology","Power Mechanics", 
          "Clothing & Textile Technolgy", "Construction Technology", "Media Technology", "Electronic Technology",
          "Manufucturing Technology", 
        ]
      },
    },
    {
      pathway: "Arts & Sport",
      learningAreas: {
        "Visual & Performing Arts": ["Music", "Fine Arts", "Drama", "Dance"],
      },
    },
    {
      pathway: "Social Sciences",
      learningAreas: {
        "Humanities": ["Music", "Fine Arts", "Drama", "Dance"],
        "Languages": ["Music", "Fine Arts", "Drama", "Dance"],
      },
    },
  ];

  const secondaryMaterials = [
    { table: "schemes", unit: "Schemes", database: "selene_secondary" },
    { table: "revision_notes", unit: "Revision Notes", database: "selene_secondary" },
    { table: "trial_examinations", unit: "Trial Examinations", database: "selene_secondary" },    
    { table: "assesment_tools", unit: "Assesment Tools", database: "selene_secondary" },
    { table: "fullset_examinations", unit: "Fullset Examinations", database: "selene_secondary" },
    { table: "holiday_assignments", unit: "Holiday Assignments", database: "selene_secondary" },    
    { table: "ksce_past_papers", unit: "KCSE Past Papers", database: "selene_secondary" },      
  ];

  const grades = ["Grade 10", "Grade 11", "Grade 12"];

  const handleGradeClick = (grade) => {
    setSelectedGrade(grade);
    setSelectedLearningArea(null);
    setSelectedMaterial(null);
    setActiveSubjectIndex(null);
  };

  const handleLearningAreaClick = (learningArea, index) => {
    setSelectedLearningArea(learningArea);
    setSelectedMaterial(null);
    setActiveSubjectIndex(index);
  };

  const handleMaterialClick = async(material) => {
    if (selectedGrade && selectedLearningArea) {
      setSelectedMaterial(material);
      console.log(`TableName: ${material.table}, Subject: ${selectedLearningArea}, 
        Grade: ${selectedGrade}, Schema:${material.database}`);
        try {
      const baseURL = import.meta.env.VITE_API_URL ;
      const subscribed ="yes" // this hardcoded yes i want it to be fetched from subscription db
      const queryParams = { grade: selectedGrade, tableName: material.table, subject:selectedLearningArea, schema: material.database };//level decimal to be extracted
      const fullURL = `${baseURL}/${subscribed}?${new URLSearchParams(queryParams).toString()}`;
      const response = await axios.get(fullURL);
      console.log("queryParams:", queryParams)
      console.log("Full URL:", fullURL);
      console.log("Fetched Data:", response.data)
      navigate("/display", { state: { data: response.data, type: "table", fullURL } }); 
        } catch (error) {
          console.error("Error fetching data:", error.response ? error.response.data : error.message);
        }
    } else {
      console.log("Please select a grade and a subject first.");
    }
  };
  
  

  return (
    <div className="container-fluid">
      <div className="title d-flex justify-items-center">
        <h5 className="">Senior School Section</h5>
      </div>

      {/* Grade Selection */}
      <div className="grade">       
        <ul className="container-fluid d-flex ">
          {grades.map((grade, index) => (
            <li
              key={index}
              className=""
              tabIndex="0"
              onClick={() => handleGradeClick(grade)}
              style={{ cursor: "pointer" }}
            >
              {grade}
            </li>
          ))}
        </ul>
      </div>

      {/* Learning Areas */}
      {selectedGrade && (
        <div className="mt-2 selected-grade">
          <h5>{selectedGrade}</h5>
          {learningAreasPerPathway.map((pathway, index) => (
            <div key={index} className="mb-4 justify-items-center">
              <div>
                <h5>{pathway.pathway}</h5>
              </div>
              {Object.entries(pathway.learningAreas).map(([category, subjects], idx) => (
                <div key={idx} className="mb-3">
                  <h6>{category}</h6>
                  <div className="row">
                    {subjects.map((subject, i) => (
                      <div key={i} className="col-12 col-md-6 col-lg-4 d-flex align-items-start">
                        <li
                          className={`list-group-item list-group-item-action ${
                            selectedLearningArea === subject ? "active" : ""
                          }`}
                          onClick={() => handleLearningAreaClick(subject, i)}
                          style={{ cursor: "pointer", minWidth: "150px" }}
                        >
                          {subject}
                        </li>

                        {/* Show Materials List beside subject on large screens, below on small screens */}
                        {selectedLearningArea === subject && activeSubjectIndex === i && (
                          <ul className="list-group ms-md-3 mt-2 mt-md-0 w-100 w-md-auto">
                            {secondaryMaterials.map((material, index) => (
                              <li 
                                key={index} 
                                className="tables"
                                onClick={() => handleMaterialClick(material)}
                                style={{ cursor: "pointer" }}
                              >
                                {material.unit}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecondarySchool;
