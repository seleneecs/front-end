import "./OtherSchoolResources.css";
import Layout from "../Layout/Layout";

const OthersSection = () => {
  const handleItemClick = (item) => {
    console.log("You clicked:", item);
  };
  
  const categorizedResources = {
    "Pre-Primary School": [
      "Video Lessons",
      "Interactive Chats",
      "Downloadable Worksheets / Notes",
      "Daily Challenges or Brain Teasers",
      "Gamified Learning Modules",
      "Offline Resources (Download for later)",
      "Parent/Guardian Dashboard"
    ],
    "Primary School": [
      "Live Webinars / Classes",
      "Quizzes & Practice Tests",
      "Progress Tracking & Analytics",
      "Discussion Forums",
      "Subject Glossary / Dictionary",
      "Resource Library (PDFs, Slides, etc.)",
      "Ask a Teacher (Q&A Section)"
    ],
    "Secondary School": [
      "Peer Collaboration / Study Groups",
      "Mentorship / Tutor Connect",
      "Career Guidance Corner",
      "Events & Competitions",
      "Revision Planner / Scheduler",
      "Offline Resources (Download for later)",
      "Student Achievements / Badges"
    ],
    "Senior School": [
      "Advanced Video Lessons",
      "Exam-Focused Practice Tests",
      "Career Planning Tools",
      "Live Tutoring Sessions",
      "Internship / Volunteer Opportunities",
      "Mentorship / Tutor Connect",
      "Scholarship & University Resources"
    ]
  };

  return (
    <Layout>
  <div className="container-fluid">
    <div className="other-setion row py-4">  
    {Object.entries(categorizedResources).map(([category, resources], index) => (
  <div className="col-md-4 col-sm-10 mx-auto mb-4" key={index}>
    <div className="custom-card">
      <div className="custom-card-header">{category}</div>
      <ul className="custom-card-body">
        {resources.map((item, idx) => (
          <li onClick={() => handleItemClick(item)} key={idx}>{item}</li>
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
