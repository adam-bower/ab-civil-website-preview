import React, { useState } from 'react';
import './UtilityBar.css';

const UtilityBar = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);

  const openRequestForm = () => {
    setShowRequestForm(true);
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
  };

  const openClientPortal = () => {
    // Opens client portal in new window
    // Replace with actual client portal URL
    window.open('https://portal.ab-civil.com', '_blank');
  };

  return (
    <>
      <div className="utility-bar">
        <div className="utility-container">
          <div className="utility-left">
          </div>
          <div className="utility-right">
            <button 
              className="utility-button request-form"
              onClick={openRequestForm}
            >
              Request Form
            </button>
            <button 
              className="utility-button client-portal"
              onClick={openClientPortal}
            >
              Client Portal
            </button>
          </div>
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="request-form-modal">
          <div className="request-form-modal-content">
            <button className="close-modal" onClick={closeRequestForm}>×</button>
            <iframe 
              src="http://localhost:3002"
              title="Request Form"
              width="100%"
              height="100%"
              frameBorder="0"
            />
          </div>
          <div className="request-form-modal-overlay" onClick={closeRequestForm} />
        </div>
      )}
    </>
  );
};

export default UtilityBar;