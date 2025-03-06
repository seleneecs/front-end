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
    // ✅ Validate row and required fields
    if (!row?.id || !schema || !tableName ) {
        console.error("Error: Missing required parameters for download.");
        return;
    }

    try {
        // ✅ Construct API URL with category
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:9000/api/file/resource";
        const downloadURL = `${baseURL}/api/resource/${row.id}/download?schema=${schema}&tableName=${tableName}&category=${encodeURIComponent(category)}`;

        console.log("Full URL for download:", downloadURL);

        // ✅ Fetch file from backend (Cookies will be automatically sent)
        const response = await axios.get(downloadURL, {
            responseType: "blob",
            withCredentials: true, // Ensures cookies are sent with the request
        });

        console.log("Download response headers:", response.headers);

        // ✅ Extract filename from response headers
        const fileName = extractFileName(response.headers["content-disposition"]) || "downloaded_file";
        console.log("Downloaded filename:", fileName);

        // ✅ Handle file download
        downloadBlob(response.data, fileName);
        
    } catch (error) {
        console.error("Error during download:", error.response?.status, error.response?.data || error.message);
    
        let errorMessage = "An error occurred";
        let buttonTitle = "Login"
        if (error.response?.status === 401) {
            errorMessage = "Login to download";
            buttonTitle = "Login"
        } else if (error.response?.status === 402) {
            buttonTitle = "Subscribe"
            errorMessage = "Subscribe to access this resource";
        } else if (error.response?.status === 403) {
            buttonTitle = "Subscribe"
            errorMessage = "Subscription Expired";
        } else if (error.response?.status === 404) {
            errorMessage = "File not found!";
        }
        
        setModalTitle(errorMessage);
        setButtonTitle(buttonTitle)
        setShowModal(true);  // ✅ Always show modal after setting title
    }
    
};

    
    
    // ✅ Extract filename from 'content-disposition' header
    const extractFileName = (contentDisposition) => {
        if (!contentDisposition) return null;
        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"'\n]+)/);
        return match && match[1] ? decodeURIComponent(match[1]) : null;
    };
    
    // ✅ Handle Blob creation and file download
    const downloadBlob = (blobData, fileName) => {
        const blob = new Blob([blobData]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    
        // ✅ Clean up URL after short delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
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
