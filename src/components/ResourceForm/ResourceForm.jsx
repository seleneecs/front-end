import React, { useState } from "react";
import axios from "axios";
import "./ResourceForm.css";
import Layout from "../Layout/Layout";
const baseURL = import.meta.env.VITE_API_URL

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
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

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
  const uploadSingleFile = async (file) => {
    // Request a simple presigned URL
    const response = await axios.post(`${baseURL}/api/generate-upload-url`, {
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    });
  
    const { uploadUrl, fileKey } = response.data;
  
    // Upload the file directly
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });
  
    if (!uploadResponse.ok) {
      throw new Error(`Single file upload failed: ${uploadResponse.statusText}`);
    }
  
    return fileKey;
  };
  
  const uploadPartToR2 = async (url, partBlob, retries = 3) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const response = await fetch(url, {
          method: "PUT",
          body: partBlob,
        });
  
        if (!response.ok) {
          throw new Error(`Part upload failed: ${response.statusText}`);
        }
  
        const eTag = response.headers.get("ETag");
        return eTag.replace(/"/g, ""); // clean quotes
      } catch (err) {
        attempt++;
        console.error(`❌ Part upload failed (attempt ${attempt}): ${err.message}`);
        if (attempt === retries) {
          throw new Error(`Failed to upload part after ${retries} attempts.`);
        }
      }
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      for (const file of formData.files) {
        console.log(`📥 Starting upload for: ${file.name}`);
  
        let fileKey = "";
  
        if (file.size <= 5 * 1024 * 1024) {
          // --- Simple Upload for small files ---
          console.log(`🔹 Using simple upload for ${file.name}`);
          fileKey = await uploadSingleFile(file);
        } else {
          // --- Multipart Upload for large files ---
          console.log(`🔹 Using multipart upload for ${file.name}`);
  
          // Step 1: Initiate Multipart
          const initiateResponse = await axios.post(`${baseURL}/api/initiate-multipart-upload`, {
            originalName: file.name,
            mimeType: file.type,
            fileSize: file.size,
          });
  
          const { uploadId, fileKey: initiatedFileKey, uploadUrls } = initiateResponse.data;
          fileKey = initiatedFileKey;
  
          const partSize = 5 * 1024 * 1024; // 5MB
          const parts = [];
  
          // Step 2: Upload each part
          for (let i = 0; i < uploadUrls.length; i++) {
            const start = i * partSize;
            const end = Math.min(start + partSize, file.size);
            const partBlob = file.slice(start, end);
  
            try {
              const eTag = await uploadPartToR2(uploadUrls[i], partBlob);
              parts.push({ ETag: eTag, PartNumber: i + 1 });
              console.log(`✅ Part ${i + 1} uploaded`);
            } catch (err) {
              console.error(`❌ Failed to upload part ${i + 1}`, err);
              throw err;
            }
          }
  
          // Step 3: Complete Multipart
          await axios.post(`${baseURL}/api/complete-multipart-upload`, {
            uploadId,
            fileKey,
            parts,
          });
  
          console.log(`✅ Completed multipart upload for: ${file.name}`);
        }
  
        // Step 4: Save metadata (common for both uploads)
        const fileUrl = `https://${import.meta.env.VITE_R2_ENDPOINT}/${import.meta.env.VITE_R2_BUCKET_NAME}/${fileKey}`;
        await axios.post(`${baseURL}/api/create-resource`, {
          grade: toTitleCase(formData.grade),
          subject: toTitleCase(formData.subject),
          year: formData.year,
          schema: formData.schema,
          tableName: formData.tableName,
          originalName: file.name,
          fileKey,
          fileUrl,
        });
  
        console.log(`✅ Metadata saved for: ${file.name}`);
      }
  
      alert("🎉 All files uploaded and metadata saved successfully!");
      e.target.reset();
      setFormData({ year: "", subject: "", grade: "", files: [], schema: "", tableName: "" });
    } catch (error) {
      console.error("❗ Upload error:", error);
      alert("❗ Error occurred during upload process.");
    } finally {
      setIsSubmitting(false);
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

          <div className="mb-3">
            {/* File Input */}
            <label htmlFor="files" className="form-label">
              <strong>Upload Files</strong>
            </label>
            <input
              type="file"
              id="files"
              name="files"
              onChange={handleFileChange}
              multiple
              required
            />
          </div>

          <div className="mb-3">
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  &nbsp; Uploading...
                </span>
              ) : (
                "Upload Resource"
              )}
            </button>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {uploadProgress}%
              </div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default ResourceForm;
