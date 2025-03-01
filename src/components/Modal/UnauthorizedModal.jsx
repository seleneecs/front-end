import React from "react";
import "./UnauthorizedModal.css"; // Regular CSS

const UnauthorizedModal = ({ show, onClose, title, onLogin, buttonTitle }) => {
    

    if (!show) return null; // Don't render if modal is hidden

  

    return (
        <div className="modalBackdrop">
            <div className="modalContainer">
                <div className="modalHeader">
                    <h5 className="modal-title">Unauthorized</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <p>{title}</p>
                </div>
                <div className="modalFooter">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn btn-primary" onClick={onLogin}>{buttonTitle}</button>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedModal;
