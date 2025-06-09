import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OtherSchoolResources.css";
import axios from "axios";
import Layout from "../Layout/Layout";


const OthersSection = () => {
  const [selectedTable, setSelectedTable] = useState(null);
 
  const [selectedSchema, setSelectedSchema] = useState(""); // schema string like "selene_priprimary"
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [fetchedData, setFetchedData] = useState([]);




  const navigate = useNavigate()
const handleItemClick = async (DB, tableName) => {
  try {
    setSelectedSchema(DB); // no need to await this
    setSelectedTable(tableName);
    setFetchedData([]);

    const baseURL = import.meta.env.VITE_API_URL;

    const queryParams = {
      schema: DB,
      tableName: tableName,
      category: "OTHERS RESOURCES", // ✅ use DB directly
    };

    const fullURL = `${baseURL}/api/resource?${new URLSearchParams(queryParams).toString()}`;
console.log("full URL IS:", fullURL)
    const response = await axios.get(fullURL, { withCredentials: true });

    if (response.data.success) {
      setFetchedData(response.data.data);
      navigate("/display", {
        state: {
          data: response.data,
          type: "table",
          fullURL,
          category: DB, // ✅ still use DB here
        },
      });
    } else {
      console.warn("No data returned or error:", response.data.message);
    }
  } catch (error) {
  const errorMessage = error.response?.data?.message || error.message || "Unexpected error. If this continues, contact support at infot@seleneecs.com. or Tel: 0748 996 731"
;
  console.error("Error fetching data:", errorMessage);
  window.alert(`Error: ${errorMessage}`);
}

};





  const categorizedResources = {
    "Pre-Primary School": {
      value: "selene_priprimary",
      subjects: {        
        "PRE SCHOOL PRINTABLES AND ACTIVITY BOOKS": { table: "printables_activity_books" },
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
       "Assesment Tools": {table: "assessment_tools " },
        ebooks: { table: "ebooks" }, 
        "Holiday Assignments": { "table": "holiday_assignments" },       
        "KICD COMPETENCY BASED CURRICULUM MATERIALS": { table: "kicd_cbcm" },
        "KICD CURRICULUM DESIGNS": { table: "kicd_designs" },
         "WORKSHEETS": { table: "worksheets" },
        "KICD TRAINING TOOLS": { table: "kicd_training_tools" },
        "LESSON PLANS": { table: "lesson_plans" },
        "RECORDS OF WORK": { table: "records_of_work" },
        "KPSEA REPORTS": { table: "kpsea_reports" },
        "POWER POINT PRESENTATIONS": { table: "power_presentations" },
        "TOPICAL REVISION BOOKLETS": { table: "topical_revision_booklets" },
        tips: { table: "study_tips" },
      },
    },
    "Junior School": {
      value: "selene_jss",
      subjects: {
       "ASSESMENT TOOLS": {table: "assessment_tools" },
        "HOLIDAY ASSIGNMENTS": {table:"holiday_assignments"} ,
        "JUNIOR SCHOOL RECORDS OF WORK": { table: "records_of_work" },
        "JUNIOR SCHOOL LESSON PLANS": { table: "lesson_plans" },
        "JUNIOR SCHOOL QUESTIONS & ANSWERS BOOKLETS": { table: "questions_answers_booklets" },
      },
    },
    "Secondary School": {
      value: "selene_secondary",
      subjects: {
         "ASSESMENT TOOLS":{ table: "assesment_tools"} ,
        "Advanced Video Lessons": { table: "video_lessons" },
        "Syllabus": { table: "syllabus" },
        "Lesson Plans & Records of Work": { table: "lesson_plans" },
        "Topical Revision Booklets": { table: "topical_revision_booklets" },
        "POWER POINT PRESENTATIONS": { table: "power_presentations" },
        "Study Tips": { table: "study_tips" },
        "KICD Litrature & Fasihi Set Books": { table: "kicd_litrature_fasihi" },
        
      },
    },
    "Senior School": {
      value: "selene_seniorschool",
      subjects: {
        "Advanced Video Lessons": { table: "video_lessons" },
        "Exam-Focused Practice Tests": { table: "exam_focused_practice_tests" },
        "Career Planning Tools": { table: "career_tools" },
      },
    },
  };

  const grades = [
    "PP1",
    "PP2",
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

        
      </div>
    </Layout>
  );
};

export default OthersSection;
