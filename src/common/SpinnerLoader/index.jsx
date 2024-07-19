import React from 'react';
import './SpinnerLoader.css';

const SpinnerLoader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <svg className="fidget-spinner" viewBox="0 0 120 120">
          <circle className="spinner-ring" cx="60" cy="60" r="54" />
          <circle className="spinner-center" cx="60" cy="60" r="10" />
          <g className="spinner-arms">
            <rect x="56" y="0" width="8" height="40" rx="4" />
            <rect x="56" y="0" width="8" height="40" rx="4" transform="rotate(120 60 60)" />
            <rect x="56" y="0" width="8" height="40" rx="4" transform="rotate(240 60 60)" />
          </g>
        </svg>
      </div>
      <div className="loading-text">Initializing your experience...</div>
    </div>
  );
};

export default SpinnerLoader;