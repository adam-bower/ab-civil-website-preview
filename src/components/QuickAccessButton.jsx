import React, { useState } from 'react';
import './QuickAccessButton.css';

const QuickAccessButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleFormClick = () => {
    // Get saved client info
    const savedInfo = localStorage.getItem('abCivilClientInfo');
    let queryParams = '';

    if (savedInfo) {
      try {
        const clientData = JSON.parse(savedInfo);
        const params = new URLSearchParams();

        // Add saved fields to URL params
        if (clientData.name) params.append('name', clientData.name);
        if (clientData.email) params.append('email', clientData.email);
        if (clientData.company) params.append('company', clientData.company);
        if (clientData.phone) params.append('phone', clientData.phone);
        if (clientData.state) params.append('state', clientData.state);
        if (clientData.fileFormats && clientData.fileFormats.length > 0) {
          params.append('fileFormats', clientData.fileFormats.join(','));
        }

        queryParams = params.toString() ? '?' + params.toString() : '';
      } catch (error) {
        console.error('Error loading saved client info:', error);
      }
    }

    // Use Wix form URL from environment variable, fallback to direct form
    const wixFormUrl = process.env.REACT_APP_WIX_FORM_URL || 'https://www.ab-civil.com/requestform';
    const targetUrl = `${wixFormUrl}${queryParams}`;

    // Open the Wix page with parameters
    window.open(targetUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      <div className={`quick-access-container ${isOpen ? 'open' : ''}`}>
        <button 
          className="quick-access-trigger"
          onClick={toggleMenu}
          aria-label="Quick Access Menu"
        >
          <span className="trigger-text">Quick Request</span>
          <svg className="trigger-icon" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        </button>
        
        {isOpen && (
          <div className="quick-access-menu">
            <div className="menu-header">
              <h3>What do you need?</h3>
              <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
            </div>
            <div className="menu-content">
              <p className="menu-description">Click below to open our Request Form where you can submit:</p>
              <ul className="service-list">
                <li>3D Model Requests</li>
                <li>Takeoff Requests</li>
                <li>Revisions to existing projects</li>
                <li>Quote requests (if needed)</li>
              </ul>
              <button 
                className="open-form-button"
                onClick={handleFormClick}
              >
                Open Request Form
              </button>
            </div>
            <div className="menu-footer">
              <p>Need help? <a href="mailto:support@ab-civil.com">Contact Support</a></p>
            </div>
          </div>
        )}
      </div>
      {isOpen && <div className="quick-access-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default QuickAccessButton;