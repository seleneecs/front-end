import React, { useState, useEffect, useContext } from "react";
import { Mail } from "lucide-react";
import Layout from "../Layout/Layout";
import axios from "axios";
import { Download } from "lucide-react";
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
    { table: "holiday_assignments", unit: "Holiday Assignments" },
    { table: "play_group_exams", unit: "Playgroup Exams" },
    { table: "pp1_exams", unit: "PP1 Exams" },
    { table: "pp2_exams", unit: "PP2 Exams" },
  ],
  selene_primaryschool: [
    { table: "schemes", unit: "Schemes" },
    
    { table: "revision_notes", unit: "Revision Notes" },
    { table: "curriculum_designs", unit: "Curriculum Designs" },
    { table: "fullset_examinations", unit: "Fullset Examinations" },    
    { table: "trial_examinations", unit: "Trial Examinations" },
  ],
  selene_jss: [
    
    { table: "curriculum_designs", unit: "Curriculum Designs" },
    { table: "fullset_examinations", unit: "Fullset Examinations" },    
   
    { table: "revision_notes", unit: "Revision Notes" },
    { table: "schemes", unit: "Schemes" },
  ],
  selene_secondary: [
    { table: "schemes", unit: "Schemes" },
    { table: "mocks", unit: "Mocks" },   
    { table: "fullset_examinations", unit: "Fullset Examinations" },
    { table: "holiday_assignments", unit: "Holiday Assignments" },
    { table: "ksce_past_papers", unit: "KCSE Past Papers" },
    { table: "revision_notes", unit: "Revision Notes" },
    { table: "trial_examinations", unit: "Trial Examinations" },
  ],
};

// Renderer component
const Renderer = ({ sections, handleSubjectClick, selectedTables, handleUnitClick, handleSectionClick }) => (
  <div className="home-container">
   
    
    {sections.map(({ name, levels, subjects, titles }) => (
      <div className="card" key={name}>
        
        <div className="title">
          <h5
            onClick={() => handleSectionClick(name)}
            style={{ cursor: "pointer" }}
          >
            {name}
          </h5>
        </div>

        {levels.map((level, index) => (
<div className="subjectList mb-4" key={level}>
  <p className="grade">{level}</p>
  <label htmlFor={`subjectDropdown-${level}`} className="form-label">
    Select Subject
  </label>
  <select
    id={`subjectDropdown-${level}`}
    className="form-select mb-3"
    onChange={(e) => {
      const [subject, category] = e.target.value.split("::");
      if (subject) handleSubjectClick(name, level, subject);
    }}
  >
    <option value="">-- Choose a Subject --</option>

    {titles ? (
      titles.map(({ category, subjects }) =>
        subjects.map((subject) => (
          <option key={`${category}-${subject}`} value={`${subject}::${category}`}>
            {category} - {subject}
          </option>
        ))
      )
    ) : (
      (typeof subjects === "function" ? subjects(index) : subjects).map((subject) => (
        <option key={subject} value={`${subject}::`}>
          {subject}
        </option>
      ))
    )}
  </select>

  {/* Units List - only show if selectedTables has matches for this level */}
  {selectedTables
    .filter((table) => table.level === level)
    .map(({ unit, table, database, level, subject }) => (
      <ul className="nested-list" key={table}>
        <li
          className="ps-2"
          onClick={() => handleUnitClick(unit, table, database, level, subject)}
          style={{ cursor: "pointer" }}
        >
          📘 {unit}
        </li>
      </ul>
    ))}
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


  // To deal with user clicking the tittle or the header eg primary
const sectionMap = {
  "Pre-Primary School": seleneMaterials.selene_priprimary?.map(item => ({
    ...item,
    schemaName: "selene_priprimary",
  })),
  "Primary School": seleneMaterials.selene_primaryschool?.map(item => ({
    ...item,
    schemaName: "selene_primaryschool",
  })),
  "Junior School": seleneMaterials.selene_jss?.map(item => ({
    ...item,
    schemaName: "selene_jss",
  })),
  "Secondary School": seleneMaterials.selene_secondary?.map(item => ({
    ...item,
    schemaName: "selene_secondary",
  })),
};


const handleSectionClick = (sectionName) => {
  const selectedSection = sections.find((section) => section.name === sectionName);

  if (!selectedSection) {
    console.warn("Section not found:", sectionName);
    return;
  }

  console.log(`\n📚 Section: ${selectedSection.name}`);

  let structuredSubjects = [];

  const getSeleneMaterials = () => {
  const section = selectedSection.name;
  const materials = sectionMap[section] || seleneMaterials.other;

  let schemaName = "";

  // Dynamically determine the schema name
  switch (section) {
    case "Pre-Primary School":
      schemaName = "selene_priprimary";
      break;
    case "Primary School":
      schemaName = "selene_primaryschool";
      break;
    case "Junior School":
      schemaName = "selene_jss";
      break;
    case "Secondary School":
      schemaName = "selene_secondary";
      break;
    default:
      schemaName = "selene_other"; // optional fallback
  }

  // Add schemaName to each item
  return materials?.map((item) => ({
    ...item,
    schemaName,
  }));
};


  // 🟨 Pre-Primary: flat same subjects for each level
  if (selectedSection.name === "Pre-Primary School" && selectedSection.levels) {
    structuredSubjects = selectedSection.levels.map((level) => ({
      level,
      subjects: selectedSection.subjects,
    }));

    navigate(`/subjects/${selectedSection.name.toLowerCase()}`, {
      state: {
        seleneMaterials: getSeleneMaterials(),
        sectionName: selectedSection.name,
        subjectsByLevel: structuredSubjects,
      },
    });
    return;
  }

  // 🟩 Primary School: subjects is a function based on level index
  if (typeof selectedSection.subjects === "function") {
    structuredSubjects = selectedSection.levels.map((level, index) => ({
      level,
      subjects: selectedSection.subjects(index),
    }));

    navigate(`/subjects/${selectedSection.name.toLowerCase()}`, {
      state: {
        seleneMaterials: getSeleneMaterials(),
        sectionName: selectedSection.name,
        subjectsByLevel: structuredSubjects,
      },
    });
    return;
  }

  // 🟦 Others: same subjects across levels
  if (Array.isArray(selectedSection.subjects) && selectedSection.levels) {
    structuredSubjects = selectedSection.levels.map((level) => ({
      level,
      subjects: selectedSection.subjects,
    }));

    navigate(`/subjects/${selectedSection.name.toLowerCase()}`, {
      state: {
        seleneMaterials: getSeleneMaterials(),
        sectionName: selectedSection.name,
        subjectsByLevel: structuredSubjects,
      },
    });
    return;
  }

  // 🟥 Secondary: grouped by categories
  if (selectedSection.titles) {
    structuredSubjects = selectedSection.titles.map((group) => ({
      level: group.category,
      subjects: group.subjects,
    }));

    navigate(`/subjects/${selectedSection.name.toLowerCase()}`, {
      state: {
        seleneMaterials: getSeleneMaterials(),
        sectionName: selectedSection.name,
        subjectsByLevel: structuredSubjects,
      },
    });
    return;
  }
};






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
      console.log("full url is:", fullURL)
      navigate("/display", { state: { data: response.data, type: "table", fullURL } });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unexpected error. If this continues, contact support at infot@seleneecs.com. or Tel: 0748 996 731";
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
            handleSectionClick={handleSectionClick}
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
      <OtherSchoolResources />
      <SecondarySchool />      
    </Layout>
  );
};

export default Home;
