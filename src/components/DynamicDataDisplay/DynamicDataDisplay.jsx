import React, { useState, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import UnauthorizedModal from "../Modal/UnauthorizedModal";
import Layout from "../Layout/Layout";
import "./DynamicDataDisplay.css";
import { devLog } from "../../utils/devLog";

const ITEMS_PER_PAGE = 20;

const DynamicDataDisplay = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [buttonTitle, setButtonTitle] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedTerm, setSelectedTerm] = useState("All");
  const [selectedSet, setSelectedSet] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useContext(UserContext);
  const { data = {}, type, fullURL } = location.state || {};
  const actualData = data.data || [];

  useEffect(() => {
    devLog("Current user role:", role);
  }, [role]);

  useEffect(() => {
    devLog("Actual data:", actualData);
  }, [actualData]);

  const urlParams = new URLSearchParams(fullURL?.split("?")[1] || "");
  const tableName = urlParams.get("tableName");
  const schema = urlParams.get("schema");
  const category = urlParams.get("category");

  const allowedFields = ["subject", "grade", "file", "fileName", "year"];

  // --- Filtering ---
  const filteredData = useMemo(() => {
    return actualData.filter((item) => {
      if (selectedYear !== "All" && item.year !== selectedYear) return false;
      if (selectedSubject !== "All" && item.subject !== selectedSubject) return false;
      if (selectedGrade !== "All" && item.grade !== selectedGrade) return false;
      if (selectedTerm !== "All" && item.term !== selectedTerm) return false;
      if (selectedSet !== "All" && item.set !== selectedSet) return false;

      if (searchTerm.trim() !== "") {
        const lowerSearch = searchTerm.toLowerCase();
        // Search in fileName and subject fields
        if (
          !(item.fileName?.toLowerCase().includes(lowerSearch) ||
            item.subject?.toLowerCase().includes(lowerSearch))
        )
          return false;
      }
      return true;
    });
  }, [actualData, selectedYear, selectedSubject, selectedGrade,selectedTerm, selectedSet, searchTerm]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleDownload = async (row) => {
    if (!row?.id || !schema || !tableName || !category) {
      devLog("Missing required parameters for download.");
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const preSignedUrlEndpoint = `${baseURL}/api/resource/${row.id}/download/presigned-url?schema=${schema}&tableName=${tableName}&category=${category}`;

      const response = await axios.get(preSignedUrlEndpoint, { withCredentials: true });

      if (!response.data?.preSignedUrl) throw new Error("Pre-signed URL not received");

      window.location.href = response.data.preSignedUrl;
    } catch (error) {
      devLog("Error during download:", error.response?.status, error.response?.data || error.message);

      let errorMessage = "An error occurred";
      let btnTitle = "Retry";

      if (error.response?.status === 401) {
        errorMessage = "Login to download";
        btnTitle = "Login";
      } else if (error.response?.status === 402) {
        errorMessage = "Subscribe to access this resource";
        btnTitle = "Subscribe";
      } else if (error.response?.status === 403) {
        errorMessage = "Subscription Expired";
        btnTitle = "Subscribe";
      } else if (error.response?.status === 404) {
        errorMessage = "File not found!";
      }

      setModalTitle(errorMessage);
      setButtonTitle(btnTitle);
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !schema || !tableName) {
      alert("Missing required parameters for delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const deleteEndpoint = `${baseURL}/api/resource/${id}?schema=${schema}&tableName=${tableName}`;

      await axios.delete(deleteEndpoint, { withCredentials: true });

      window.location.reload();
    } catch (err) {
      devLog("Delete failed:", err);
      alert("Failed to delete the file.");
    }
  };

  // Extract unique values for filters
  const uniqueYears = useMemo(() => {
    return Array.from(new Set(actualData.map((item) => item.year).filter(Boolean))).sort();
  }, [actualData]);

  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(actualData.map((item) => item.subject).filter(Boolean))).sort();
  }, [actualData]);

  const uniqueGrades = useMemo(() => {
    return Array.from(new Set(actualData.map((item) => item.grade).filter(Boolean))).sort();
  }, [actualData]);

  const uniqueTerm = useMemo(() => {
    return Array.from(new Set(actualData.map((item) => item.term).filter(Boolean))).sort();
  }, [actualData]);

  const uniqueSet = useMemo(() => {
    return Array.from(new Set(actualData.map((item) => item.set).filter(Boolean))).sort();
  }, [actualData]);

  // Pagination Controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <div className="data-display-container downloadable-item">
        {type === "table" && Array.isArray(actualData) ? (
          <>
            {/* Filters and Search */}
            <div className="row mb-3">
              <div className="col-md-2 mb-2">
                <select
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Years</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-2">
                <select
                  className="form-select"
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Subjects</option>
                  {uniqueSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2 mb-2">
                <select
                  className="form-select"
                  value={selectedGrade}
                  onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Grades</option>
                  {uniqueGrades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 mb-2">
                <select
                  className="form-select"
                  value={selectedTerm}
                  onChange={(e) => {
                    setSelectedTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Term</option>
                  {uniqueTerm.map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 mb-2">
                <select
                  className="form-select"
                  value={selectedSet}
                  onChange={(e) => {
                    setSelectedSet(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Sets</option>
                  {uniqueSet.map((set) => (
                    <option key={set} value={set}>
                      {set}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-5 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by file name or subject..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Data List */}
            <ul>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <li key={row.id}>
                    <div className="d-flex align-items-center">
                      {/* Clickable Download Info */}
                      <div
                        onClick={() => handleDownload(row)}
                        className="me-2 cursor-pointer d-flex flex-wrap gap-3"
                        title={`Click to download ${row.fileName || "file"}`}
                      >
                        {allowedFields.map((key) => (
                          <span key={key}>{row[key] ? ` ${row[key]}` : ""}</span>
                        ))}
                      </div>

                      {/* Trash Icon for Admin/Staff */}
                      {(role === "admin" || role === "staff") && (
                        <i
                          className="bi bi-trash text-danger cursor-pointer"
                          onClick={() => handleDelete(row.id)}
                          title="Delete"
                          style={{ fontSize: "1rem" }}
                        ></i>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <p>No data available</p>
              )}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label="Page navigation example" className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {[...Array(totalPages)].map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  })}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        ) : type === "text" ? (
          <pre>{actualData}</pre>
        ) : type === "image" ? (
          <img src={actualData} alt="Fetched Content" className="data-image" />
        ) : (
          <p>Unsupported data format</p>
        )}

        <UnauthorizedModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onLogin={() =>
            buttonTitle === "Login" ? navigate("/login/register") : navigate("/subscriptions")
          }
          title={modalTitle}
          buttonTitle={buttonTitle}
        />
      </div>
    </Layout>
  );
};

export default DynamicDataDisplay;
