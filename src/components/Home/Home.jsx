import React, { useState, useEffect, useContext } from "react";
import { Mail } from "lucide-react";
import Layout from "../Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
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
        subjects: ["English & Literature", "Kiswahili & Fasihi",  "French", "German", "Chinese"],
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
    { table: "holiday_assignments", unit: "Holiday Assignments" },
    { table: "play_group_exams", unit: "Playgroup Exams" },
    { table: "pp1_exams", unit: "PP1 Exams" },
  ],
  selene_primaryschool: [
    { table: "schemes", unit: "Schemes" },
    { table: "assesment_tools", unit: "Assessment Tools" },
    { table: "revision_notes", unit: "Revision Notes" },
    { table: "curriculum_designs", unit: "Curriculum Designs" },
    { table: "fullset_examinations", unit: "Fullset Examinations" },    
    { table: "trial_examinations", unit: "Trial Examinations" },
  ],
  selene_jss: [
    { table: "assessment_tools", unit: "Assessment Tools" },
    { table: "curriculum_designs", unit: "Curriculum Designs" },
    { table: "fullset_examinations", unit: "Fullset Examinations" },    
    { table: "holiday_assignments", unit: "Holiday Assignments" },
    { table: "revision_notes", unit: "Revision Notes" },
    { table: "schemes", unit: "Schemes" },
  ],
  selene_secondary: [
    { table: "schemes", unit: "Schemes" },
    { table: "assesment_tools", unit: "Assessment Tools" },
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
    <h6>Download files below</h6>
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
                      .map(({ unit, table, database, level, subject }) => (
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
  const { userId, setUserId, token, setToken, role, setRole, email, setEmail } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedTables, setSelectedTables] = useState([]);

  // On mount, initialize context state from localStorage if available
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");

    if (storedUserId) setUserId(storedUserId);
    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
    if (storedEmail) setEmail(storedEmail);
  }, [setUserId, setToken, setRole, setEmail]);

  // Sync changes in context to localStorage
  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
    else localStorage.removeItem("userId");

    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");

    if (email) localStorage.setItem("email", email);
    else localStorage.removeItem("email");
  }, [userId, token, role, email]);

  const handleSubjectClick = (section, level, subject) => {
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
        level,
        subject,
        label: `${level} ${subject}`,
      }))
    );
  };

  const handleUnitClick = async (unit, table, database, level, subject) => {
    const formattedGrade = level.trim();
    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const queryParams = {
        grade: formattedGrade,
        tableName: table,
        subject: subject,
        schema: database,
        category: level,
      };

      const fullURL = `${baseURL}/api/resource?${new URLSearchParams(queryParams).toString()}`;
      const response = await axios.get(fullURL, { withCredentials: true });

      navigate("/display", { state: { data: response.data, type: "table", fullURL } });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      console.error("Error fetching data:", errorMessage);
      window.alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <Layout>
      <div className="main-layout">
        <div className="column left-column">          
          <div className="sidebar-content-wrapper">
             <div className="subscription-intro">
              <h4>Subscriptions Choices</h4>
              <p>Explore our carefully structured learning categories designed to align with 
                Kenya’s Competency-Based Education (CBE). From early foundational levels to 
                specialized senior school pathways, you can subscribe to resources that match your academic needs:
              </p>
             </div>
              <div className="subscription-categories">                       
                  <div className="category-group">                  
                    <h5>Preprimary</h5>
                    <ul>
                      <li>PP1</li>
                      <li>PP2</li>
                    </ul>
                  </div>
                
                  <div className="category-group">
                    <h5>Primary</h5>
                    <ul>
                      <li>GRADE 1</li>
                      <li>GRADE 2</li>
                      <li>GRADE 3</li>
                      <li>GRADE 4</li>
                      <li>GRADE 5</li>
                      <li>GRADE 6</li>
                      
                    </ul>
                  </div>
                  <div className="category-group">
                    <h5>Junior School</h5>
                    <ul>                    
                      <li>GRADE 7</li>
                      <li>GRADE 8</li>
                      <li>GRADE 9</li>
                    </ul>
                  </div>
                  <div className="category-group">
                    <h5>Secondary School</h5>
                    <ul>                    
                      <li>GRADE 7</li>
                      <li>GRADE 8</li>
                      <li>GRADE 9</li>
                    </ul>
                  </div>
                  <div className="category-group">
                    <h5>Senior School </h5>
                    <ul>                    
                      <li>STEM</li>
                      <li>ART & SPORTS</li>
                      <li>SOCIAL SCIENCES</li>
                    </ul>
                  </div>
                  <div className="category-group">
                    <h5>Senior School </h5>
                    <ul>                    
                      <li>STEM</li>
                      <li>ART & SPORTS</li>
                      <li>SOCIAL SCIENCES</li>
                    </ul>
                  </div>
                  <div className="category-group">
                    <h5>Senior School </h5>
                    <ul>                    
                      <li>STEM</li>
                      <li>ART & SPORTS</li>
                      <li>SOCIAL SCIENCES</li>
                    </ul>
                  </div>
                  <div className="category-group">
                    <h5>Senior School </h5>
                    <ul>                    
                      <li>STEM</li>
                      <li>ART & SPORTS</li>
                      <li>SOCIAL SCIENCES</li>
                    </ul>
                  </div>
          </div>
          </div>

        </div>


        {/* Main Content */}
        <div className="column center-column">
          <Renderer
            sections={sections}
            handleSubjectClick={handleSubjectClick}
            selectedTables={selectedTables}
            handleUnitClick={handleUnitClick}
          />
        </div>

        {/* Right Sidebar */}
        <div className="column right-column">
      <h2>Education News & Social</h2>

      {/* Twitter Embed */}
      <div className="social-widget">
        <h5>Latest from Twitter</h5>
        <a
          className="twitter-timeline"
          data-height="400"
          href="https://twitter.com/KICDKenya?ref_src=twsrc%5Etfw"
        >
          Tweets by KICDKenya
        </a>
      </div>

      {/* News Feed */}
      <div className="news-widget">
        <h5>Recent Education Updates</h5>
        <ul>
         <li>
  <a href="https://www.kicd.ac.ke/cbc-guidelines" >
    Ministry releases new CBC guidelines
  </a>
</li>          
<li>
  <a href="https://www.knec.ac.ke/exams-schedule-2025" >
    National exams schedule 2025
  </a>
</li>


        </ul>
      </div>
      <div className="more-resources-container">
          <div className="more-resources-container">
          <p className="more-resources-intro">
            For a richer learning experience, we offer a variety of additional materials including videos, documents, and interactive content. Explore more resources tailored to help you succeed by clicking the button below.
          </p>
          <a href="/others" className="btn btn-primary more-resources-button">
            More Resources
          </a>
        </div>

      </div>


    </div>

      </div>

      {/* Components below the main layout */}
      <SecondarySchool />
      <OtherSchoolResources />
    </Layout>
  );
};

export default Home;
