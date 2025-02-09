import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../Layout/Layout";
import "./DynamicDataDisplay.css";

const DynamicDataDisplay = () => {
    const location = useLocation();
    const { data = {}, type } = location.state || {};
    const actualData = data.data || [];

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

    const allowedFields = ["subject", "grade", "fileName", "year"];

    const handleDownload = (row) => {
        try {
            let blob;
            if (type === "table") {
                const headers = allowedFields.join(",") + "\n";
                const rowData = allowedFields.map(key => row[key] || "").join(",");
                const csvContent = headers + rowData;
                blob = new Blob([csvContent], { type: "text/csv" });
            } else {
                blob = new Blob([JSON.stringify(row, null, 2)], { type: "application/json" });
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `download.${type === "table" ? "csv" : "json"}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error during download:", error);
        }
    };

    return (
        <Layout>
            <div className="data-display-container">
                {type === "table" && Array.isArray(actualData) ? (
                    <ul className="data-list">
                        {actualData.map((row, index) => (
                            <li key={index} onClick={() => handleDownload(row)} className="downloadable-item">
                                {allowedFields.map((key) => (
                                    <span key={key}>
                                        {row[key] ? ` ${row[key]}` : ""}
                                    </span>
                                ))}
                            </li>
                        ))}
                    </ul>
                ) : type === "text" ? (
                    <pre>{actualData}</pre>
                ) : type === "image" ? (
                    <img src={actualData} alt="Fetched Content" className="data-image" />
                ) : (
                    <p>Unsupported data format</p>
                )}
            </div>
        </Layout>
    );
};

export default DynamicDataDisplay;