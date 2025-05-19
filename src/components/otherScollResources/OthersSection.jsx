import "./OtherSchoolResources.css";
import Layout from "../Layout/Layout";

const OthersSection = () => {
  const handleItemClick = (item) => {
    console.log("You clicked:", item);
  };
  
  const categorizedResources = {
    "Pre-Primary School": [
      "PREPRIMARY TEACHING AIDS",
      "PRESCHOOL PRINTABLES AND ACTIVITY BOOKS",
      "WORKSHEETS",
      "NURSERY RHYME SONGS",
      "PREPRIMARY ASSESSMENT BOOKS",
      "COLOURING PAGES"     
    ],
    "Primary School": [
      "ebooks",
      "KICD COMPETENCY BASED CURRICULUM MATERIALS",
      "KICD CURRICULUM DESIGNS",
      "KICD TRAINING TOOLS",
      "LESSON PLANS",
      "POWER POINT PRESENTATIONS",
      "TOPICAL REVISION BOOKLETS",
      "tips"
    ],
    "Junior School": [
      "JUNIOR SCHOOL RECORDS OF WORK",
      "JUNIOR SCHOOL LESSON PLANS",
      "JUNIOR SCHOOL QUESTIONS & ANSWERS BOOKLETS"      
    ],
    "Senior School": [
      "Advanced Video Lessons",
      "Exam-Focused Practice Tests",
      "Career Planning Tools"    
      
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
