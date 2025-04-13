import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./secondary.css";
import axios from "axios";


const SecondarySchool = () => {
  const navigate = useNavigate()
  const [selectedSubjects, setselectedSubjects] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(null);
  const [selectedPathway, setselectedPathway] = useState(null);

  const SubjectsPerPathway = [
    {
      pathway: "STEM",
      Subjects: {
        "Pure Sciences": ["Biology", "Chemistry", "Physics", "Mathematics"],
        "Applied Science": ["Agriculture", "Computer Science", "Food & Nutrition", "Home Management"],
        "Technical & Engineering": [
          "Agricultural Technology",
          "Geo Science Technology",
          "Marine & Fisheries Technology",
          "Aviation Technology",
          "Wood Technology",
          "Electrical Technology",
          "Metal Technology",
          "Power Mechanics",
          "Clothing & Textile Technology",
          "Construction Technology",
          "Media Technology",
          "Electronic Technology",
          "Manufacturing Technology",
        ]
      },
      
    },
    {
      pathway: "ART AND SPORTS",
      Subjects: {
        "Performing Arts": ["Music", "Dance", "Theater", "Education"],
        "Visual and Applied Arts": ["Fine Arts", "Applied Art", "Craft", "Time-Based Media"],
      },
      
    },
    {
      pathway: "SOCIAL SCIENCES",
      Subjects: {
        "Humanities": [
          "History and Citizenship",
          "Geography",
          "CRE",
          "Islamic Education",
          "Hindu Religious Education",
          "Business Studies",
          "Mathematics"
        ],
        "Languages": [
          "English Language",
          "Literature in English",
          "Fasihi ya Kiswahili",
          "Kenya Sign Language",
          "Indigenous Languages",
          "Arabic Language",
          "German Language",
          "French Language",
          "Mandarin Language"
        ],
      },
      
    },
  ];

  const secondaryMaterials = [
    { table: "schemes", unit: "Schemes", database: "selene_seniorschool" },
    { table: "revision_notes", unit: "Revision Notes", database: "selene_seniorschool" },
    { table: "trial_examinations", unit: "Trial Examinations", database: "selene_seniorschool" },    
    { table: "assesment_tools", unit: "Assesment Tools", database: "selene_seniorschool" },
    { table: "fullset_examinations", unit: "Fullset Examinations", database: "selene_seniorschool" },
    { table: "holiday_assignments", unit: "Holiday Assignments", database: "selene_seniorschool" },    
    { table: "ksce_past_papers", unit: "KCSE Past Papers", database: "selene_seniorschool" },      
  ];

  const grades = ["Grade 10", "Grade 11", "Grade 12"];

  const handleGradeClick = (grade) => {
    setSelectedGrade(grade);
    setselectedSubjects(null);
    setSelectedMaterial(null);
    setActiveSubjectIndex(null);
  };

  const handleSubjectsClick = (pathway, subject, index) => {
    setselectedSubjects(subject); // Store subject as string instead of object
    setSelectedMaterial(null);
    setActiveSubjectIndex(index);
    setselectedPathway(pathway.pathway);
};


const handleMaterialClick = async (material, category) => {
  if (selectedGrade && selectedSubjects) {
      setSelectedMaterial(material);
      console.log(`TableName: ${material.table}, Subject: ${selectedSubjects}, 
        Grade: ${selectedGrade}, Schema: ${material.database}, pathway: ${selectedPathway}`);

      try {
          const baseURL = import.meta.env.VITE_API_URL;
          const queryParams = {
              grade: selectedGrade,
              tableName: material.table,
              subject: selectedSubjects, // Ensure this is a string
              schema: material.database,
              category: category //change the hardcoded category to be dynamic
          };
          const fullURL = `${baseURL}/api/resource?${new URLSearchParams(queryParams).toString()}`;
          const response = await axios.get(fullURL);
          
          console.log("Fetched Data:", response.data);
          navigate("/display", { state: { data: response.data, type: "table", fullURL } });

      } catch (error) {
          console.error("Error fetching data:", error.response ? error.response.data : error.message);
      }
  } else {
      console.log("Please select a grade and a subject first.");
  }
};

  
  

  return (
    <div className="">
      <div className="senior-school-title">
        <h5 className="moving">Senior School Section</h5>
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
        <div className={`mt-2 selected-grade selected-grade-${selectedGrade.replace(/\s+/g, '').toLowerCase()}`}>
          <h5>{selectedGrade}</h5>
          {SubjectsPerPathway.map((pathway, index) => (
            <div key={index} className="mb-4 justify-items-center">
              <div>
                <h5>{pathway.pathway}</h5>
              </div>
              {Object.entries(pathway.Subjects).map(([category, subjects], idx) => (
                <div key={idx} className="mb-3">
                  <h6>{category}</h6>
                  <div className="row">
                    {subjects.map((subject, i) => (
                      <div key={i} className="subjects col-12 col-md-6 col-lg-4 d-flex flex-column align-items-center">
                      <li
                        className={`list-group-item list-group-item-action ${
                          selectedSubjects === subject ? "active" : ""
                        }`}
                        onClick={() => handleSubjectsClick(pathway, subject, i)}
                        tabIndex="0" // Allows the element to be focused using Tab key
                      >
                        {subject}
                      </li>

                    
                      {/* Show Materials List below the subject */}
                      {selectedSubjects === subject && activeSubjectIndex === i && (
                        <ul className="sec-materials list-group mt-2 w-100 text-center">
                          {secondaryMaterials.map((material, index) => (
                            <li 
                              key={index} 
                              onClick={() => handleMaterialClick(material, selectedPathway)}
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
