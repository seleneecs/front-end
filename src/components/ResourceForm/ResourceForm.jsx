import React, { useState } from "react";
import axios from "axios";
import "./ResourceForm.css";
import Layout from "../Layout/Layout";

const baseURL = import.meta.env.VITE_API_URL;

const ResourceForm = () => {
  const [formData, setFormData] = useState({
    year: "",
    subject: "",
    QPMS: "",
    grade: "",
    files: [],
    schema: "",
    tableName: "",
    term: "",
    set: "", // fixed: initialized as empty string
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      files: selectedFiles,
    }));
  };

 const toUpperCase = (str) => {
  return str.toUpperCase();
};


  const uploadSingleFile = async (file) => {
    const response = await axios.post(`${baseURL}/api/generate-upload-url`, {
      originalName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    });

    const { uploadUrl, fileKey } = response.data;

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

        if (!response.ok) throw new Error(`Part upload failed: ${response.statusText}`);

        const eTag = response.headers.get("ETag");
        return eTag.replace(/"/g, "");
      } catch (err) {
        attempt++;
        if (attempt === retries) throw new Error("Failed to upload part after multiple attempts.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      for (let fileIndex = 0; fileIndex < formData.files.length; fileIndex++) {
        const file = formData.files[fileIndex];
        let fileKey = "";

        if (file.size <= 5 * 1024 * 1024) {
          fileKey = await uploadSingleFile(file);
          setUploadProgress(100);
        } else {
          const initiateResponse = await axios.post(`${baseURL}/api/initiate-multipart-upload`, {
            originalName: file.name,
            mimeType: file.type,
            fileSize: file.size,
          });

          const { uploadId, fileKey: initiatedFileKey, uploadUrls } = initiateResponse.data;
          fileKey = initiatedFileKey;

          const partSize = 5 * 1024 * 1024;
          const parts = [];

          for (let i = 0; i < uploadUrls.length; i++) {
            const start = i * partSize;
            const end = Math.min(start + partSize, file.size);
            const partBlob = file.slice(start, end);

            const eTag = await uploadPartToR2(uploadUrls[i], partBlob);
            parts.push({ ETag: eTag, PartNumber: i + 1 });

            const progress = Math.round(((i + 1) / uploadUrls.length) * 100);
            setUploadProgress(progress);
          }

          await axios.post(`${baseURL}/api/complete-multipart-upload`, {
            uploadId,
            fileKey,
            parts,
          });
        }

        const fileUrl = `https://${import.meta.env.VITE_R2_ENDPOINT}/${import.meta.env.VITE_R2_BUCKET_NAME}/${fileKey}`;

        await axios.post(`${baseURL}/api/create-resource`, {
          grade: toUpperCase(formData.grade),
          subject: toUpperCase(formData.subject),
          QPMS: formData.QPMS,
          year: formData.year,
          schema: formData.schema,
          tableName: formData.tableName,
          originalName: file.name,
          fileKey,
          fileUrl,
          term: formData.term,
          set: formData.set ? `(SET ${formData.set}) ` : "",
        });

        setUploadProgress(100);
      }

      alert("🎉 All files uploaded and metadata saved successfully!");
      e.target.reset();
      setFormData({
        year: "",
        subject: "",
        QPMS: "",
        grade: "",
        files: [],
        schema: "",
        tableName: "",
        term: "",
        set: "",
      });
    } catch (error) {
      console.error("❗ Upload error:", error);
      alert("❗ Error occurred during upload.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Layout>
      <div className="form_container my-5 custom-form">
        <h2 className="text-center mb-4">Create Resource</h2>

        <form onSubmit={handleSubmit}>
          <fieldset disabled={isSubmitting}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="schema" className="form-label"><strong>Schema/Database</strong></label>
                <select className="form-select" id="schema" name="schema" value={formData.schema} onChange={handleChange} required>
                  <option value="" disabled>Select a schema</option>
                  <option value="selene_primaryschool">Primary School</option>
                  <option value="selene_secondary">Secondary School</option>
                  <option value="selene_jss">Junior Secondary School</option>
                  <option value="selene_seniorschool">Senior Secondary School</option>
                  <option value="selene_priprimary">Preprimary</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="tableName" className="form-label"><strong>Table Name</strong></label>
                <select className="form-select" id="tableName" name="tableName" value={formData.tableName} onChange={handleChange} required>
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
                  <option value="teaching_aids">Teaching Aids</option>
                  <option value="lesson_plans"> Lesson Plans</option> 
                  <option value="records_of_work"> Records of Work</option>              
   
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="year" className="form-label"><strong>Year</strong></label>
                <input type="text" className="form-control" id="year" name="year" value={formData.year} onChange={handleChange} placeholder="Enter year (e.g., 2024)" required />
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="subject" className="form-label"><strong>Subject</strong></label>
                <input type="text" className="form-control" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter subject (e.g., Mathematics)" required />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="QPMS" className="form-label"><strong>Marking Scheme / Question Paper</strong></label>
                <select
                  className="form-select"
                  id="QPMS"
                  name="QPMS"
                  value={formData.QPMS}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Question Paper">Question Paper</option>
                  <option value="Marking Scheme">Marking Scheme</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
              <label htmlFor="term" className="form-label"><strong>Term</strong></label>
              <select
                className="form-control"
                id="term"
                name="term"
                value={formData.term}
                onChange={handleChange}
                required
              >
                <option value="">Select  Term</option>
                <option value="All">All</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>


              <div className="col-md-4 mb-3">
                <label htmlFor="set" className="form-label"><strong>Set</strong></label>
                <input type="number" className="form-control" id="set" name="set" value={formData.set} onChange={handleChange} placeholder="Enter set (e.g., 2)"/>
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="grade" className="form-label"><strong>Grade</strong></label>
                <select className="form-select" id="grade" name="grade" value={formData.grade} onChange={handleChange} required>
                  <option value="">Select Grade</option>
                  {[
                    "All", "PP1", "PP2", "GRADE 1", "GRADE 2", "GRADE 3", "GRADE 4", "GRADE 5",
                    "GRADE 6", "GRADE 7", "GRADE 8", "GRADE 9", "GRADE 10", "GRADE 11", "GRADE 12",
                    "FORM 1", "FORM 2", "FORM 3", "FORM 4"
                  ].map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="files" className="form-label"><strong>Upload Files</strong></label>
              <input type="file" className="form-control" id="files" name="files" multiple onChange={handleFileChange} required />
            </div>

            {uploadProgress > 0 && (
              <div className="progress mb-3">
                <div
                  className="progress-bar"
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

            <div className="d-flex justify-content-center">
  <button
    type="submit"
    className="btn btn-primary w-auto px-4"
    disabled={isSubmitting}
  >
    {isSubmitting ? "Uploading..." : "Submit"}
  </button>
</div>

          </fieldset>
        </form>
      </div>
    </Layout>
  );
};

export default ResourceForm;
