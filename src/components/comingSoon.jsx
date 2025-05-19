// src/components/ComingSoon.jsx
import React from 'react';

const ComingSoon = () => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: '#f3f4f6',
      color: '#1f2937',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem' }}>🚧 Coming Soon</h1>
      <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
        SeleneECS is under construction. We'll be live soon at <strong>seleneecs.com</strong>.
      </p>
    </div>
  );
};

export default ComingSoon;
