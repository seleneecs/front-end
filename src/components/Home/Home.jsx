import React, { useState } from "react";
import Layout from "../Layout/Layout";
import axios from "axios";
import "./Home.css";

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
  {
    name: "Senior Secondary School",
    levels: [...Array(3)].map((_, i) => `Grade ${i + 10}`),
    titles: [
      {
        category: "Arts & Sport",
        subjects: ["Sports", "Visual Arts", "Performing Arts"],
      },
      {
        category: "Social Sciences",
        subjects: ["Languages and Literature", "Humanities", "Business Studies"],
      },
      {
        category: "STEM",
        subjects: ["Pure Sciences", "Applied Sciences", "Technical and Engineering", "Career and Technical Studies"],
      },
    ],
  },
];

// Table names mapping
const elimufiMaterials = {
  selene_priprimary: [    
    { table: "schemes", unit: "Schemes" },
    { table: "curriculum_design", unit: "Curriculum Design" },
    { table: "revision_notes", unit: "Revision Notes" },
    { table: "holiday_assignments", unit: "holiday Assignments" },   
    { table: "play_group_exams", unit: "Playgroup Exams" },
    { table: "pp1_exams", unit: "PP1 Exams" },
    { table: "pp2_exams", unit: "PP2 Exams" },
    
    
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
  elimufi1_jss: [
    { table: "assessment_tools", unit: "Assessment Tools" },
    { table: "curriculum_designs", unit: "Curriculum Designs" },
    { table: "fullset_examinations", unit: "Fullset Examinations" },
    { table: "grade7_examinations", unit: "Grade 7 Examinations" },
    { table: "grade8_examinations", unit: "Grade 8 Examinations" },
    { table: "holiday_assignments", unit: "Holiday Assignments" },
    { table: "notes", unit: "Notes" },
    { table: "schemes", unit: "Schemes" },
  ],
  elimufi1_secondary: [
    { table: "fullset_examinations", unit: "Fullset Examinations" },
    { table: "holiday_assignments", unit: "Holiday Assignments" },
    { table: "holiday_revisions", unit: "Holiday Revisions" },
    { table: "ksce_past_papers", unit: "KCSE Past Papers" },
    { table: "revision_notes", unit: "Revision Notes" },
    { table: "schemes", unit: "Schemes" },
    { table: "trial_examinations", unit: "Trial Examinations" },
  ],
};

// Etract number from label
function extractNumber(label) {
  const match = label.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

// Renderer component
const Renderer = ({ sections, handleItemClick, selectedTables, handleUnitClick }) => (
  <div className="home-container">
    {sections.map(({ name, levels, subjects, titles }) => (
      <div className="card" key={name}>
        <div className="section">
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
                        <span className="subjectSpan" onClick={() => handleItemClick(name, level, subject)}>
                          {subject}
                        </span>
                        {selectedTables
                          .filter((table) => table.label === `${level} ${subject}`)
                          .map(({ table, unit, database, label, subject }) => (
                            <ul className="nested-list" key={table}>
                              <li onClick={() => handleUnitClick(unit, table, database, label, subject)}>
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
                    <span className="subjectSpan" onClick={() => handleItemClick(name, level, subject)}>
                      {subject}
                    </span>
                    {selectedTables
                      .filter((table) => table.label === `${level} ${subject}`)
                      .map(({ table, unit, database, label, subject }) => (
                        <ul className="nested-list" key={table}>
                          <li onClick={() => handleUnitClick(unit, table, database, label, subject)}>{unit}</li>
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
  const [selectedTables, setSelectedTables] = useState([]);

  const handleItemClick = (section, level, subject) => {
    const sectionToTableMap = {
      "Pre-Primary School": "selene_priprimary",
      "Primary School": "selene_primaryschool",
      "Junior School": "elimufi1_jss",
      "Secondary School": "elimufi1_secondary",
      "Senior Secondary School": "elimufi1_secondary",
    };

    const database = sectionToTableMap[section];
    if (!database) return;

    const tables = elimufiMaterials[database] || [];
    setSelectedTables(
      tables.map((table) => ({
        ...table,
        database,
        label: `${level} ${subject}`,
        subject,
      }))
    );
  };

  const handleUnitClick = async (unit, table, database, label, subject) => {
    try {
      const baseURL = "http://localhost:9000/api/resource";
      const queryParams = { grade: extractNumber(label), tableName: table, subject, schema: database };
      const fullURL = `${baseURL}?${new URLSearchParams(queryParams).toString()}`;
      const response = await axios.get(fullURL);

      console.log("Full URL:", fullURL);
      console.log("Fetched Data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <Layout>
      <Renderer
        sections={sections}
        handleItemClick={handleItemClick}
        selectedTables={selectedTables}
        handleUnitClick={handleUnitClick}
      />
    </Layout>
  );
};

export default Home;
