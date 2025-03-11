import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UnauthorizedModal from "../Modal/UnauthorizedModal";
import Layout from "../Layout/Layout";
import "./DynamicDataDisplay.css";

const DynamicDataDisplay = () => {
    const [showModal, setShowModal] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [buttonTitle, setButtonTitle] = useState("")
    const navigate = useNavigate()
    const location = useLocation();
    const { data = {}, type, fullURL } = location.state || {};
    const actualData = data.data || [];


    // Use URLSearchParams to extract tableName and schema from the fullURL
    const urlParams = new URLSearchParams(fullURL.split('?')[1]);
    const tableName = urlParams.get('tableName');
    const schema = urlParams.get('schema');
    const category = urlParams.get("category")

    if (!actualData) {
        return (
            <Layout>
                <p>No data available</p>
            </Layout>
        );
    }

    if (type === "table" && !Array.isArray(actualData)) {
        return (
            <Layout>
                <p>Invalid data format for table display</p>
            </Layout>
        );
    }

    const allowedFields = ["subject", "grade", "file", "fileName", "year"];

    const handleDownload = async (row) => {
        if (!row?.id || !schema || !tableName || !category) {
            console.error("Error: Missing required parameters for download.");
            return;
        }
    
        try {
            // ✅ Correct API URL with the `/download/presigned-url` path
            const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
            const preSignedUrlEndpoint = `${baseURL}/api/resource/${row.id}/download/presigned-url?schema=${schema}&tableName=${tableName}&category=${category}`;
    
            console.log("Requesting Pre-Signed URL:", preSignedUrlEndpoint);
    
            // ✅ Fetch the pre-signed URL
            const response = await axios.get(preSignedUrlEndpoint, {
                withCredentials: true, // Ensure cookies are sent if needed
            });
    
            console.log("Pre-Signed URL Response:", response.data);
    
            if (!response.data?.preSignedUrl) {
                throw new Error("Pre-signed URL not received");
            }
    
            // ✅ Redirect user to download the file from MinIO
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
    
    
    return (
        <Layout>
            <div className="data-display-container downloadable-item">
                {type === "table" && Array.isArray(actualData) ? (
                    <ul >
                        {actualData.length > 0 ? (
                            actualData.map((row, index) => (
                                <li key={row.id}  >
                                    {allowedFields.map((key) => (
                                        <span  onClick={() => handleDownload(row)} key={key}>
                                            {row[key] ? ` ${row[key]}` : ""}
                                        </span>
                                    ))}
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
                onLogin={() => buttonTitle==="Login" ? navigate("/login/register"):navigate("/subscription")} 
                title={modalTitle}
                buttonTitle ={buttonTitle}
            />

        </Layout>
    );
};

export default DynamicDataDisplay;
