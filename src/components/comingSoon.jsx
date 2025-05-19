import React, { useEffect, useState } from "react";

const ComingSoon = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date("2025-07-22T00:00:00");
    const now = new Date();
    const difference = targetDate - now;

    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  });

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const baseURL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseURL}/launch/notify/me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      alert(data.message);
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting your email.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>SeleneECS is Coming Soon 🚀</h1>
      {Object.keys(timeLeft).length > 0 ? (
        <div style={styles.timer}>
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} style={styles.timeBox}>
              <span style={styles.time}>{value}</span>
              <span>{unit}</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.launched}>We're live!</p>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Notify Me</button>
      </form>

      <a
        href="https://web.facebook.com/profile.php?id=61556763399546" // replace with actual page
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        Visit us on Facebook
      </a>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px 20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "20px",
  },
  timer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  timeBox: {
    backgroundColor: "#fff",
    padding: "15px 20px",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  time: {
    fontSize: "1.5rem",
    display: "block",
    fontWeight: "bold",
  },
  form: {
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "200px",
    marginRight: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
    fontSize: "1rem",
  },
  launched: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
};

export default ComingSoon;
