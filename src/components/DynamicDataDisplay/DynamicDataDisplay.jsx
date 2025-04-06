import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import UnauthorizedModal from "../Modal/UnauthorizedModal";
import Layout from "../Layout/Layout";
import "./DynamicDataDisplay.css";

const DynamicDataDisplay = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [buttonTitle, setButtonTitle] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = useContext(UserContext);
    const { data = {}, type, fullURL } = location.state || {};
    const actualData = data.data || [];

    // Log role to ensure it's set correctly
    useEffect(() => {
        console.log("Current user role:", role); // Log role for debugging
    }, [role]);

    // Log the actual data to verify it's populated correctly
    useEffect(() => {
        console.log("Actual data:", actualData); // Log the fetched data
    }, [actualData]);

    const urlParams = new URLSearchParams(fullURL.split('?')[1]);
    const tableName = urlParams.get('tableName');
    const schema = urlParams.get('schema');
    const category = urlParams.get("category");

    const allowedFields = ["subject", "grade", "file", "fileName", "year"];

    const handleDownload = async (row) => {
        if (!row?.id || !schema || !tableName || !category) {
            console.error("Missing required parameters for download.");
            return;
        }

        try {
            const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const preSignedUrlEndpoint = `${baseURL}/api/resource/${row.id}/download/presigned-url?schema=${schema}&tableName=${tableName}&category=${category}`;

            const response = await axios.get(preSignedUrlEndpoint, { withCredentials: true });

            if (!response.data?.preSignedUrl) throw new Error("Pre-signed URL not received");

            window.location.href = response.data.preSignedUrl;
        } catch (error) {
            console.error("Error during download:", error.response?.status, error.response?.data || error.message);

            let errorMessage = "An error occurred";
            let buttonTitle = "Retry";

            if (error.response?.status === 401) {
                errorMessage = "Login to download";
                buttonTitle = "Login";
            } else if (error.response?.status === 402) {
                errorMessage = "Subscribe to access this resource";
                buttonTitle = "Subscribe";
            } else if (error.response?.status === 403) {
                errorMessage = "Subscription Expired";
                buttonTitle = "Subscribe";
            } else if (error.response?.status === 404) {
                errorMessage = "File not found!";
            }

            setModalTitle(errorMessage);
            setButtonTitle(buttonTitle);
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

            window.location.reload(); // reload to reflect updated list
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete the file.");
        }
    };

    return (
        <Layout>
            <div className="data-display-container downloadable-item">
                {type === "table" && Array.isArray(actualData) ? (
                    <ul>
                        {actualData.length > 0 ? (
                            actualData.map((row) => (
                                <li key={row.id}>
                                <div className="d-flex align-items-center">
                                    {/* Content with URL */}
                                    <div onClick={() => handleDownload(row)} className="me-2 cursor-pointer">
                                        {allowedFields.map((key) => (
                                            <span key={key}>
                                                {row[key] ? ` ${row[key]}` : ""}
                                            </span>
                                        ))}
                                    </div>
                            
                                    {/* Trash icon (only visible to admin or staff) */}
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
                ) : type === "text" ? (
                    <pre>{actualData}</pre>
                ) : type === "image" ? (
                    <img src={actualData} alt="Fetched Content" className="data-image" />
                ) : (
                    <p>Unsupported data format</p>
                )}
            </div>
            <UnauthorizedModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onLogin={() =>
                    buttonTitle === "Login" ? navigate("/login/register") : navigate("/subscription")
                }
                title={modalTitle}
                buttonTitle={buttonTitle}
            />
        </Layout>
    );
};

export default DynamicDataDisplay;
