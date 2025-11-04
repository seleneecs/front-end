import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./secondary.css";
import axios from "axios";


const SecondarySchool = () => {
  const navigate = useNavigate()
  const [selectedSubjects, setselectedSubjects] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("Grade 10");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(null);
  const [selectedPathway, setselectedPathway] = useState(null);

  const SubjectsPerPathway = [
    {
      pathway: "STEM",
      Subjects: {
       
        "Pure Sciences": 
                    ["Biology", 
                    "Chemistry", 
                    "Physics", 
                    "Mathematics"
                    ],
        "Applied Science": 
        ["Agriculture", "Computer Science", "Food & Nutrition", "Home Management"],
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
        ],
        "Career and Technology Studies": [
          "Garment Making and Interior Design",
          "Leather Work",
          "Culinary Arts",
          "Hair Dressing and Beauty Theraby",
          "Plumbing Ceramics",
          "Welding Fabrication",
          "Tourism and Travel",
          "Air Conditioning and Refregiration",
          "Animal Keeping",
          "Exterior Design and Landcaping",
          "Building and Construction",
          "Photography",
          "Graphic Designing and Animation",
          "Food and Bevarages",
          "Capentry and Joining",
          "Fire figthing",
          "Metal Work",
          "Electricity",
          "Land Surveying",
          "Science Labaratory Technology",
          "Electronics",
          "Printing Technology",
          "Crop Production"
        ]
      },
      
    },
    {
      pathway: "ART AND SPORT SCIENCES PATHWAY",
      Subjects: {
         "Sports Sciences": [
                        "Ball Games",
                        "Atthletics", 
                        "Gymnastics",
                        "Water Sports", 
                        "Boxing", 
                        "Martial Arts", 
                        "Outdoor Persuits", 
                        "Indoor Games", 
                        "Advance Physical Education", 
                        
                        ],
        "Performing Arts": 
                      ["Music", "Dance", "Theatre and Elocution"],
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
          "IRE",
          "Hindu Religious Education",
          "Business Studies",
          "Mathematics"
        ],
        "Languages and Litrature": [
          "English & Litrature",
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
    { table: "fullset_examinations", unit: "Fullset Examinations", database: "selene_seniorschool" },      
    { table: "ksce_past_papers", unit: "KCSE Past Papers", database: "selene_seniorschool" },      
    { table: "curriculum_designs", unit: "Curriculum Designs", database: "selene_seniorschool" },      
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
      const errorMessage = error.response?.data?.message || "Unexpected error. If this continues, contact support at infot@seleneecs.com. or Tel: 0748 996 731";
      console.error("Error fetching data:", errorMessage);
      window.alert(`Error: ${errorMessage}`);
    }

  } else {
      console.log("Please select a grade and a subject first.");
  }
};

  
  

  return (
    <div className="">
     


      {/* Grade Selection */}
          
       <div className="senior-school-grade-selection">
       <ul>
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
          <h4 className="senior-selected-grade">{selectedGrade}</h4>
          {SubjectsPerPathway.map((pathway, index) => (
            <div key={index} className="mb-4 justify-items-center">
              <div className="senior-pathway">
                <h5 >{pathway.pathway}</h5>
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
