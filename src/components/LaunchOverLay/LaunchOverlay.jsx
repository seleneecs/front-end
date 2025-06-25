import React, { useState } from "react";
import "./LaunchOverlay.css";

const LaunchOverlay = ({ onContinue }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleContinue = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onContinue(); // hide overlay after fade animation completes
    }, 800);
  };

  return (
    <div className={`launch-overlay ${isFadingOut ? "fade-out" : ""}`}>
      {/* Floating animated objects */}
      <div className="floating-objects">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="float-object"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Launch content */}
      <div className="launch-content">
       <h1 className="launch-title">🎉 Selene ECS Has Officially Launched!</h1>
<p className="launch-subtitle">Empowering Education — Anytime, Anywhere</p>
<p className="launch-date">🚀 Launched on: <strong>25th June 2025</strong></p>

        <div className="launch-loader"></div>

        <button className="continue-btn" onClick={handleContinue}>
          🎉 Continue to App
        </button>
      </div>
    </div>
  );
};

export default LaunchOverlay;
