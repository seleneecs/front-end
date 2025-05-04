import React, { useState } from "react";
import axios from "axios";
import "./ResourceForm.css";
import Layout from "../Layout/Layout";

const ResourceForm = () => {
  const [formData, setFormData] = useState({
    year: "",
    subject: "",
    grade: "",
    files: [], // Ensure consistency with backend field name
    schema: "",
    tableName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      files: selectedFiles, // Ensuring field matches backend
    }));
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toUpperCase()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable submit button during submission

    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const formDataToSend = new FormData();

      // Ensure subject and grade are in Title Case
      const formattedFormData = {
        ...formData,
        subject: toTitleCase(formData.subject),
        grade: toTitleCase(formData.grade),
      };

      // Append all other form data
      Object.keys(formattedFormData).forEach((key) => {
        if (key !== "files") {
          formDataToSend.append(key, formattedFormData[key]);
        }
      });

      // Append all files correctly
      formData.files.forEach((file) => {
        formDataToSend.append("files", file); // Ensure the key name matches backend
      });

      // Debug: Check form data before sending
      console.log("Form Data Being Sent:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(`${baseURL}/api/upload`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Files uploaded successfully!", response.data);
      alert("All files uploaded successfully!");

      // Reset the form after successful submission
      setFormData({
        year: "",
        subject: "",
        grade: "",
        files: [],
        schema: "",
        tableName: "",
      });

    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false); // Enable submit button again after submission attempt
    }
  };

  return (
    <Layout>
      <div className="form_container container my-5 container-fluid">
        <h2 className="text-center mb-4">Create Resource</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Schema Dropdown */}
            <div className="col-md-6 mb-3">
              <label htmlFor="schema" className="form-label">
                <strong>Schema/Database</strong>
              </label>
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
                <option value="selene_seniorschool">Senior Secondary School</option>
                <option value="selene_priprimary">Preprimary</option>
              </select>
            </div>

            {/* Table Name Dropdown */}
            <div className="col-md-6 mb-3">
              <label htmlFor="tableName" className="form-label">
                <strong>Table Name</strong>
              </label>
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
                <option value="curriculum_designs">Curriculum Design</option>
                <option value="holiday_assignments">Holiday Assignments</option>
                <option value="play_group_exams">Play Group Exams</option>
                <option value="pp1_exams">PP1 Exams</option>
                <option value="pp2_exams">PP2 Exams</option>
              </select>
            </div>
          </div>

          <div className="row">
            {/* Year Input */}
            <div className="col-md-4 mb-3">
              <label htmlFor="year" className="form-label">
                <strong>Year</strong>
              </label>
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
            <div className="col-md-4 mb-3">
              <label htmlFor="subject" className="form-label">
                <strong>Subject</strong>
              </label>
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
            <div className="col-md-4 mb-3">
              <label htmlFor="grade" className="form-label">
                <strong>Grade</strong>
              </label>
              <select
                className="form-control"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
              >
                <option value="">Select Grade</option>
                <option value="PP1">PP1</option>
                <option value="PP2">PP2</option>
                <option value="GRADE 1">GRADE 1</option>
                <option value="GRADE 2">GRADE 2</option>
                <option value="GRADE 3">GRADE 3</option>
                <option value="GRADE 4">GRADE 4</option>
                <option value="GRADE 5">GRADE 5</option>
                <option value="GRADE 6">GRADE 6</option>
                <option value="GRADE 7">GRADE 7</option>
                <option value="GRADE 8">GRADE 8</option>
                <option value="GRADE 9">GRADE 9</option>
                <option value="GRADE 10">GRADE 10</option>
                <option value="GRADE 11">GRADE 11</option>
                <option value="GRADE 12">GRADE 12</option>
                <option value="FORM 2">FORM 2</option>
                <option value="FORM 3">FORM 3</option>
                <option value="FORM 4">FORM 4</option>
              </select>
            </div>
          </div>

          <div className="row">
            {/* File Upload */}
            <div className="col-md-12 mb-3">
              <label htmlFor="files" className="form-label">
                <strong>Files</strong>
              </label>
              <input
                type="file"
                className="form-control"
                id="files"
                name="files"
                multiple
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          {/* Submit Button with Spinner */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ResourceForm;
