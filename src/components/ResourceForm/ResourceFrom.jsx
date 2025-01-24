import React, { useState } from "react";
import axios from "axios";
import Layout from "../Layout/Layout";

const ResourceForm = () => {
  const [formData, setFormData] = useState({
    year: "",
    subject: "",
    grade: "",
    file: null,
    schema: "",
    tableName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post("http://localhost:9000/api/resource", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resource created successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  return (
   <Layout>
     <form onSubmit={handleSubmit}>
      {/* Schema Dropdown */}
      <div className="mb-3">
        <label htmlFor="schema" className="form-label"><strong>Schema</strong></label>
        <select
          className="form-select"
          id="schema"
          name="schema"
          value={formData.schema}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a schema</option>
          <option value="selene_primaryschool">Primary School</option>
          <option value="selene_secondary">Secondary School</option>
          <option value="selene_jss">Junior Secondary School</option>
          <option value="selene_priprimary">Preprimary</option>
        </select>
      </div>

      {/* Table Name Dropdown */}
      <div className="mb-3">
        <label htmlFor="tableName" className="form-label"><strong>Table Name</strong></label>
        <select
          className="form-select"
          id="tableName"
          name="tableName"
          value={formData.tableName}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a table</option>
          <option value="fullset_examinations">Fullset Examinations</option>
          <option value="ksce_past_papers">KCSE Past Papers</option>
          <option value="schemes">Schemes</option>
          <option value="revision_notes">Revision Notes</option>
          <option value="assesment_tools">Assessment Tools</option>
          <option value="trial_examinations">Trial Examinations</option>
          <option value="curriculum_design">Curriculum Design</option>
          <option value="holiday_assignments">Holiday Assignments</option>
          <option value="play_group_exams">Play Group Exams</option>
          <option value="pp1_exams">PP1 Exams</option>
          <option value="pp2_exams">PP2 Exams</option>
        </select>
      </div>

      {/* Year Input */}
      <div className="mb-3">
        <label htmlFor="year" className="form-label"><strong>Year</strong></label>
        <input
          type="text"
          className="form-control"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Enter the year (e.g., 2024)"
          required
        />
      </div>

      {/* Subject Input */}
      <div className="mb-3">
        <label htmlFor="subject" className="form-label"><strong>Subject</strong></label>
        <input
          type="text"
          className="form-control"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Enter the subject (e.g., Mathematics)"
          required
        />
      </div>

      {/* Grade Input */}
      <div className="mb-3">
        <label htmlFor="grade" className="form-label"><strong>Grade</strong></label>
        <input
          type="text"
          className="form-control"
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          placeholder="Enter the grade (e.g., 7)"
          required
        />
      </div>

      {/* File Upload */}
      <div className="mb-3">
        <label htmlFor="file" className="form-label"><strong>File</strong></label>
        <input
          type="file"
          className="form-control"
          id="file"
          name="file"
          onChange={handleFileChange}
          required
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
   </Layout>
  );
};

export default ResourceForm;
