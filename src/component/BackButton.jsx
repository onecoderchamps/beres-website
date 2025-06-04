import React from 'react';
import { HiArrowLeft } from 'react-icons/hi'; // ← Icon dari Heroicons (React Icons)

const BackButton = ({ onClick, title }) => {
  return (
    <button onClick={onClick || (() => window.history.back())} style={styles.backButton}>
      <HiArrowLeft style={styles.icon} />
      <span style={styles.text}>{title}</span>
    </button>
  );
};

const styles = {
  backButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#000',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
    cursor: 'pointer',
    padding: 0
  },
  icon: {
    marginRight: 20,
    fontSize: '20px'
  },
  text: {
    fontSize: '16px'
  }
};

export default BackButton;
