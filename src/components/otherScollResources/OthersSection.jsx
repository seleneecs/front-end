import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OtherSchoolResources.css";
import Layout from "../Layout/Layout";


const OthersSection = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState(""); // schema string like "selene_priprimary"
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [fetchedData, setFetchedData] = useState([]);

  const navigate = useNavigate()

  const handleItemClick = (categoryValue, tableName) => {
    console.log("handleItemClick called with:", { categoryValue, tableName });
    setSelectedSchema(categoryValue);
    setSelectedTable(tableName);
    setShowPopup(true);
    setFetchedData([]); // reset previous data on new selection
  };

  const handleClose = () => {
    console.log("Popup closed. Resetting grade and subject.");
    setShowPopup(false);
    setGrade("");
    setSubject("");
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called with:", { selectedSchema, selectedTable, grade, subject });

    if (!grade || !subject) {
      alert("Please select both grade and enter a subject.");
      console.warn("Submission blocked: grade or subject missing.");
      return;
    }

    const query = new URLSearchParams({
      grade,
      subject,
      tableName: selectedTable,
      schema: selectedSchema,
      category:grade
    }).toString();

    const baseURL = import.meta.env.VITE_API_URL;
    const fetchURL = `${baseURL}/api/resource?${query}`;
    console.log("Fetching data from:", fetchURL);
    
    try {
      const res = await fetch(fetchURL);
      const data = await res.json();

      if (res.ok) {
        console.log("Data fetched successfully:", data);
        setFetchedData(data);
        navigate("/display", { state: { data, type: "table", fullURL: fetchURL } });

        // Removed handleClose() here to keep popup open for debugging
        // You can uncomment the next line if you want popup to close after submit:
        // handleClose();
      } else {
        console.error("Fetch error response:", data.error);
        alert("Error fetching data: " + data.error);
        setFetchedData([]);
      }
    } catch (error) {
      console.error("Fetch failed with error:", error);
      alert("Failed to fetch data. Please try again.");
      setFetchedData([]);
    }
  };

  const categorizedResources = {
    "Pre-Primary School": {
      value: "selene_priprimary",
      subjects: {
        "PREPRIMARY TEACHING AIDS": { table: "teaching_aids" },
        "PRESCHOOL PRINTABLES AND ACTIVITY BOOKS": { table: "activity_books" },
        "WORKSHEETS": { table: "worksheets" },
        "NURSERY RHYME SONGS": { table: "nursery_rhymes" },
        "PREPRIMARY ASSESSMENT BOOKS": { table: "assessment_books" },
        "LESSON PLANS": { table: "lesson_plans" },
        "RECORDS OF WORK": { table: "records_of_work" },
        "TEACHING AIDS": { table: "teaching_aids" },
      },
    },
    "Primary School": {
      value: "selene_primaryschool",
      subjects: {
        ebooks: { table: "ebooks" },        
        "KICD COMPETENCY BASED CURRICULUM MATERIALS": { table: "kicd_cbcm" },
        "KICD CURRICULUM DESIGNS": { table: "kicd_designs" },
        "KICD TRAINING TOOLS": { table: "kicd_training" },
        "LESSON PLANS": { table: "lesson_plans" },
        "POWER POINT PRESENTATIONS": { table: "presentations" },
        "TOPICAL REVISION BOOKLETS": { table: "revision_booklets" },
        tips: { table: "tips" },
      },
    },
    "Junior School": {
      value: "selene_jss",
      subjects: {
        "JUNIOR SCHOOL RECORDS OF WORK": { table: "records_of_work" },
        "JUNIOR SCHOOL LESSON PLANS": { table: "lesson_plans" },
        "JUNIOR SCHOOL QUESTIONS & ANSWERS BOOKLETS": { table: "qa_booklets" },
      },
    },
    "Secondary School": {
      value: "selene_secondary",
      subjects: {
        "Advanced Video Lessons": { table: "video_lessons" },
        "Syllabus": { table: "syllabus" },
        "Lesson Plans & Records of Work": { table: "lesson_plans" },
        "Topical Questions Per subject": { table: "topical_questions" },
        "Powerpoint Charts": { table: "powerpoint_charts" },
        "Study Tips": { table: "study_tips" },
        "KICD Litrature & Fasihi Set Books": { table: "kicd_litrature_fasihi" },
        "STAREHE BOYS' CENTRE EXAMS": { table: "kicd_litrature_fasihi" },
      },
    },
    "Senior School": {
      value: "selene_seniorschool",
      subjects: {
        "Advanced Video Lessons": { table: "video_lessons" },
        "Exam-Focused Practice Tests": { table: "practice_tests" },
        "Career Planning Tools": { table: "career_tools" },
      },
    },
  };

  const grades = [
    "Pp1",
    "Pp2",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Form 1",
    "Form 2",
    "Form 3",
    "Form 4",
  ];

  // Debug log inside render
  console.log("Rendering fetchedData:", fetchedData);

  return (
    <Layout>
      <div className="container-fluid">       
        <div className="other-setion row py-4">
          {Object.entries(categorizedResources).map(([categoryName, categoryData], index) => (
            <div className="col-md-4 col-sm-10 mx-auto mb-4" key={index}>
              <div className="custom-card">
                <div className="custom-card-header">{categoryName}</div>
                <ul className="custom-card-body">
                  {Object.entries(categoryData.subjects).map(([subjectName, meta], idx) => (
                    <li
                      key={idx}
                      onClick={() => handleItemClick(categoryData.value, meta.table)}
                      style={{ cursor: "pointer" }}
                    >
                      {subjectName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h5>
                Fetching resources from: <strong>{selectedTable}</strong>
              </h5>

              <div className="mb-3">
                <label htmlFor="grade-select" className="form-label">
                  Grade:
                </label>
                <select
                  id="grade-select"
                  className="form-select"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <option value="">-- Select Grade --</option>
                  {grades.map((g, idx) => (
                    <option key={idx} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="subject-input" className="form-label">
                  Subject:
                </label>
                <input
                  id="subject-input"
                  type="text"
                  className="form-control"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end">
                <button onClick={handleSubmit} className="btn btn-primary me-2">
                  Submit
                </button>
                <button onClick={handleClose} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OthersSection;
