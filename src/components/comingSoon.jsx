import React, { useEffect, useState } from "react";
import "./comingSoon.css";

const ComingSoon = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-07-22T00:00:00");
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) return {};

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [hasLaunched, setHasLaunched] = useState(Object.keys(timeLeft).length === 0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      setHasLaunched(Object.keys(remaining).length === 0);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseURL}/launch/notify/me`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      alert(data.message);
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coming-soon-container">
      <h1 className="coming-soon-heading">SeleneECS is Coming Soon 🚀</h1>

      {!hasLaunched ? (
        <div className="coming-soon-timer">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="time-box">
              <span className="time">{value}</span>
              <span>{unit}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="launched-text">We're live!</p>
      )}

      <form onSubmit={handleSubmit} className="notify-form">
        <input
          type="email"
          placeholder="Email"
          aria-label="Email address"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="notify-input"
        />
        <button
          type="submit"
          className="notify-button"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Submitting..." : "Notify Me"}
        </button>
      </form>

      <a
        href="https://web.facebook.com/profile.php?id=61556763399546"
        target="_blank"
        rel="noopener noreferrer"
        className="fb-link"
      >
        Visit us on Facebook
      </a>
    </div>
  );
};

export default ComingSoon;
