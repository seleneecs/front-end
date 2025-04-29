import React, { useState } from "react";
import Layout from "../Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import SecondarySchool from "../secondary/SecondarySchool";
import OtherSchoolResources from "../otherScollResources/OtherSchoolResources";

// Configuration for all sections
const sections = [
  {
    name: "Pre-Primary School",
    levels: ["PP1", "PP2"],
    subjects: [
      "Language Activities",
      "Mathematics Activities",
      "Environmental Activities",
      "Psychomotor & Creative Activities",
      "Religious Education Activities",
    ],
  },
  {
    name: "Primary School",
    levels: [...Array(6)].map((_, i) => `Grade ${i + 1}`),
    subjects: (index) =>
      index < 3
        ? [
            "Indigenous Languages",
            "English",
            "Kiswahili/KSL",
            "Mathematics",
            "Religious Studies",
            "Environmental Studies",
            "Creative Activities",
          ]
        : [
            "English",
            "Kiswahili/KSL",
            "Mathematics",
            "Religious Studies",
            "Social Studies",
            "Science & Technology",
            "Agriculture & Nutrition",
            "Creative Arts",
          ],
  },
  {
    name: "Junior School",
    levels: [...Array(3)].map((_, i) => `Grade ${i + 7}`),
    subjects: [
      "English",
      "Kiswahili/KSL",
      "Mathematics",
      "Religious Studies",
      "Social Studies",
      "Integrated Science",
      "Pre-Technical Studies",
      "Agriculture & Nutrition",
      "Creative Arts",
      "Pastoral/Religious Instructional Programme",
    ],
  },
  {
    name: "Secondary School",
    levels: [...Array(3)].map((_, i) => `Form ${i + 2}`),
    titles: [
      {
        category: "Science",
        subjects: ["Biology", "Chemistry", "Physics", "Home Science", "Mathematics"],
      },
      {
        category: "Arts",
        subjects: ["Computer Science", "Art & Craft", "Woodwork", "Drawing & Design"],
      },
      {
        category: "Languages",
        subjects: ["English", "Literature", "Kiswahili", "Fasihi", "French", "German", "Chinese"],
      },
      {
        category: "Humanities",
        subjects: ["History", "Geography", "Agriculture", "CRE", "Business Studies"],
      },
    ],
  },

];

// Table names mapping
const seleneMaterials = {
  selene_priprimary: [    
    { table: "schemes", unit: "Schemes" },
    { table: "curriculum_designs", unit: "Curriculum Designs" },
    { table: "revision_notes", unit: "Revision Notes" },
    { table: "holiday_assignments", unit: "holiday Assignments" },   
    { table: "play_group_exams", unit: "Playgroup Exams" },
    { table: "pp1_exams", unit: "PP1 Exams" },
    { table: "lesson_plans", unit: "Lesson Plans" }, //to add on db
    { table: "records_of_work", unit: "Records of Work" },// to add on db
    { table: "teaching_aids", unit: "Teaching Aids" },//to add on db
    
    
  ],
  selene_primaryschool: [
    { table: "schemes", unit: "Schemes" },
    { table: "assesment_tools", unit: "Assessment Tools" },
    { table: "revision_notes", unit: "Revision Notes" },
    { table: "curriculum_designs", unit: "Curriculum Designs" },
    { table: "fullset_examinations", unit: "Fullset Examinations" },
    { table: "holiday_assignments", unit: "Holiday Assignments" },   
    { table: "trial_examinations", unit: "Trial Examinations" },
  ],
  selene_jss: [
    { table: "assessment_tools", unit: "Assessment Tools" },
    { table: "curriculum_designs", unit: "Curriculum Designs" },
    { table: "fullset_examinations", unit: "Fullset Examinations" },
    { table: "grade7_examinations", unit: "Grade 7 Examinations" },
    { table: "grade8_examinations", unit: "Grade 8 Examinations" },
    { table: "holiday_assignments", unit: "Holiday Assignments" },
    { table: "notes", unit: "Notes" },
    { table: "schemes", unit: "Schemes" },
  ],
  selene_secondary: [
    { table: "schemes", unit: "Schemes" },
    { table: "assesment_tools", unit: "Assesment Tools" },
    { table: "fullset_examinations", unit: "Fullset Examinations" },
    { table: "holiday_assignments", unit: "Holiday Assignments" },    
    { table: "ksce_past_papers", unit: "KCSE Past Papers" },
    { table: "revision_notes", unit: "Revision Notes" },    
    { table: "trial_examinations", unit: "Trial Examinations" },
  ],
};



// Renderer component
const Renderer = ({ sections, handleSubjectClick, selectedTables, handleUnitClick }) => (
  <div className="home-container">
    {sections.map(({ name, levels, subjects, titles }) => (
      <div className="card" key={name}>
        <div className="title">
          <h5>{name}</h5>
        </div>
        {levels.map((level, index) => (
          <div className="subjectList" key={level}>
            <p className="grade">{level}</p>
            {titles ? (
              titles.map(({ category, subjects }) => (
                <div key={category}>
                  <h5>{category}</h5>
                  <ul>
                    {subjects.map((subject) => (
                      <li key={subject}>
                        <span className="subjectSpan" onClick={() => handleSubjectClick(name, level, subject)}>
                          {subject}
                        </span>
                        {selectedTables
  .filter((table) => table.label === `${level} ${subject}`)
  .map(({ unit, table, database, level, subject }) => (
    <ul className="nested-list" key={table}>
      <li onClick={() => handleUnitClick(unit, table, database, level, subject)}>
        {unit}
      </li>
    </ul>
  ))}

                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <ul>
                {(typeof subjects === "function" ? subjects(index) : subjects).map((subject) => (
                  <li key={subject}>
                    <span className="subjectSpan" onClick={() => handleSubjectClick(name, level, subject)}>
                      {subject}
                    </span>
                    {selectedTables
                      .filter((table) => table.label === `${level} ${subject}`)
                      .map(({unit,  table, database, level, subject }) => (
                        <ul className="nested-list" key={table}>
                          <li onClick={() => handleUnitClick(unit, table, database, level, subject)}>{unit}</li>
                        </ul>
                      ))}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
);

const Home = () => {

  const navigate= useNavigate()
const [selectedTables, setSelectedTables] = useState([]);
console.log("selected tables",selectedTables)
const handleSubjectClick = (section, level, subject) => {
  console.log("section:", section);
  console.log("level:", level);
  console.log("subject:", subject);

  const sectionToTableMap = {
    "Pre-Primary School": "selene_priprimary",
    "Primary School": "selene_primaryschool",
    "Junior School": "selene_jss",
    "Secondary School": "selene_secondary",
    "Senior Secondary School": "selene_secondary",
  };

  const database = sectionToTableMap[section];
  if (!database) return;

  const tables = seleneMaterials[database] || [];
  setSelectedTables(
    tables.map((table) => ({
      ...table,
      database,
      level,  // Ensure "Grade 7" or "Form 2" remains separate
      subject,
      label: `${level} ${subject}`, // Only used for filtering, not API calls
    }))
  );
};



const handleUnitClick = async (unit, table, database, level, subject) => {
 
  console.log("CLICKED DETAILS", "table:", table, "database:", database, "Grade/Form:", level, "subject:", subject);
  console.log("Category (level) before building URL:", level);

  // Ensure `level` remains unchanged and does not include `subject`
  const formattedGrade = level.trim(); // Keeps "Grade 7" or "Form 2" as-is

  try {
    const baseURL = import.meta.env.VITE_API_URL;
  

    // Send correct parameters
    const queryParams = {
      grade: formattedGrade, // Ensure "Form 2" or "Grade 7", no subject concatenation
      tableName: table,
      subject: subject, // Pass subject separately
      schema: database,
      category:level
    };

    const fullURL = `${baseURL}/api/resource?${new URLSearchParams(queryParams).toString()}`;
    console.log("Corrected Full URL:", fullURL);

    const response = await axios.get(fullURL, {
      withCredentials: true, // ✅ Ensure cookies are sent with the request
    });


    navigate("/display", { state: { data: response.data, type: "table", fullURL } });
  } catch (error) {
    console.error("Error fetching data:", error.response ? error.response.data : error.message);
  }
};




  return (
    <Layout>
      <Renderer
        sections={sections}
        handleSubjectClick={handleSubjectClick}
        selectedTables={selectedTables}
        handleUnitClick={handleUnitClick}
      />
      <SecondarySchool/>
      <OtherSchoolResources/>
    </Layout>
  );
};

export default Home;
