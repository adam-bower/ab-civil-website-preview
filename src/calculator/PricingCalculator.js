import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './PricingCalculator.css';

// Supabase configuration
const SUPABASE_URL = 'https://db.ab-civil.com';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function PricingCalculator() {
  // Form state
  const [projectType, setProjectType] = useState('');
  const [projectSize, setProjectSize] = useState('');
  const [hasErosion, setHasErosion] = useState(false);
  const [hasUtil, setHasUtil] = useState(false);
  const [hasAdvUtil, setHasAdvUtil] = useState(false);
  const [advUtilCount, setAdvUtilCount] = useState(0);
  
  // User info state
  const [projectName, setProjectName] = useState('');
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  
  // UI state
  const [showModal, setShowModal] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cost breakdown
  const [costs, setCosts] = useState({
    base: 0,
    utility: 0,
    erosion: 0,
    advancedUtility: 0,
    total: 0
  });

  const trimFloat = (value) => {
    value = Math.ceil(value * 100) / 100;
    return Math.ceil(value / 10) * 10;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(trimFloat(amount));
  };

  const calculateEstimate = () => {
    setAlert({ show: false, type: '', message: '' });
    
    // Validation
    if (!projectType) {
      setAlert({ show: true, type: 'warning', message: 'Please select a Project Type.' });
      return;
    }
    
    if (['Utilities Only', 'Roadway', 'Other'].includes(projectType)) {
      setAlert({ 
        show: true, 
        type: 'info', 
        message: 'This project type requires a custom quote. Please submit via our <a href="https://www.ab-civil.com/requestform" target="_BLANK">Custom Estimate form</a>.' 
      });
      return;
    }
    
    if (projectType === 'Typical Site Model' && (!projectSize || parseFloat(projectSize) <= 0)) {
      setAlert({ show: true, type: 'warning', message: 'Please enter a valid Project Size (Acres) greater than 0.' });
      return;
    }
    
    if (projectType === 'Typical Site Model' && parseFloat(projectSize) > 150) {
      setAlert({ 
        show: true, 
        type: 'warning', 
        message: 'Please <a href="https://www.ab-civil.com/requestform">contact us</a> for projects larger than 150 Acres.' 
      });
      return;
    }

    // Calculate costs
    let baseCost = 0;
    const size = parseFloat(projectSize) || 0;
    
    if (projectType === 'Typical Site Model') {
      if (size <= 0.5) {
        baseCost = 1200;
      } else if (size > 0.5 && size <= 1) {
        baseCost = 900 + (600 * size);
      } else if (size > 1 && size <= 5) {
        baseCost = 280 * size + 1220;
      } else if (size > 5 && size <= 999) {
        baseCost = 1350 * Math.pow(size, 0.38) + 141.47;
      }
      baseCost *= 1.05;
    } else if (projectType === 'Linework') {
      baseCost = 450;
    }

    const costBreakdown = {
      base: trimFloat(baseCost),
      utility: hasUtil ? trimFloat(baseCost * 0.10) : 0,
      erosion: hasErosion ? 450 : 0,
      advancedUtility: hasAdvUtil ? trimFloat(parseInt(advUtilCount || 0) * 30) : 0,
      total: 0
    };
    
    costBreakdown.total = costBreakdown.base + costBreakdown.utility + 
                         costBreakdown.erosion + costBreakdown.advancedUtility;
    
    setCosts(costBreakdown);
    setShowModal(true);
  };

  const validateUserInfo = () => {
    const errors = [];
    
    if (!projectName.trim()) errors.push('Project Name is required.');
    if (!userName.trim()) errors.push('Your Name is required.');
    if (!companyName.trim()) errors.push('Company Name is required.');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('A valid Email Address is required.');
    }
    
    if (errors.length > 0) {
      setAlert({ 
        show: true, 
        type: 'warning', 
        message: 'Please fix the following:<ul>' + errors.map(e => `<li>${e}</li>`).join('') + '</ul>' 
      });
      return false;
    }
    
    return true;
  };

  const submitEstimate = async () => {
    if (!validateUserInfo()) return;
    
    setIsSubmitting(true);
    setAlert({ show: false, type: '', message: '' });
    
    const data = {
      project_name: projectName,
      customer_name: userName,
      company_name: companyName,
      email_address: email,
      company_address_street: street,
      company_address_city: city,
      company_address_state: state,
      company_address_zip: zip,
      project_type: projectType,
      acreage: projectType === 'Linework' ? 0 : parseFloat(projectSize),
      has_erosion_surface: hasErosion,
      has_elevated_utilities: hasUtil,
      has_advanced_utilities: hasAdvUtil,
      advanced_utility_structures: parseInt(advUtilCount || 0),
      base_cost: costs.base,
      utility_cost: costs.utility,
      erosion_cost: costs.erosion,
      advanced_utility_cost: costs.advancedUtility,
      estimated_cost: costs.total,
    };

    console.log('Submitting data:', data);

    try {
      const finalPayload = { ...data, raw_payload: data };
      const { data: responseData, error } = await supabaseClient
        .from('pricing_calculator_quote')
        .insert([finalPayload]);
      
      console.log('Supabase response:', { responseData, error });
      
      if (error) {
        console.error('Supabase error:', error);
        setAlert({ 
          show: true, 
          type: 'danger', 
          message: `Error: ${error.message || 'There was an error sending your request. Please contact us to continue your inquiry.'}` 
        });
        setIsSubmitting(false);
      } else {
        console.log('Quote submitted successfully');
        setShowModal(false);
        setSubmitted(true);
        setIsSubmitting(false);
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Network error:', error);
      setAlert({ 
        show: true, 
        type: 'danger', 
        message: `Network error: ${error.message || 'Please check your connection and try again.'}` 
      });
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProjectType('');
    setProjectSize('');
    setHasErosion(false);
    setHasUtil(false);
    setHasAdvUtil(false);
    setAdvUtilCount(0);
    setProjectName('');
    setUserName('');
    setCompanyName('');
    setEmail('');
    setShowAddress(false);
    setStreet('');
    setCity('');
    setState('');
    setZip('');
    setShowModal(false);
    setShowUserForm(false);
    setSubmitted(false);
    setAlert({ show: false, type: '', message: '' });
  };

  if (submitted) {
    return (
      <div className="calculator-container">
        <div className="calculator-card">
          <div className="success-message">
            <h4>Quote Submitted!</h4>
            <div className="alert alert-success">
              You should receive a quote via email shortly. If you do not receive one, 
              please email <a href="mailto:estimates@ab-civil.com">estimates@ab-civil.com</a>.
            </div>
            <button className="btn btn-primary" onClick={resetForm}>
              Calculate Another Quote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calculator-container">
      <div className="calculator-card">
        <div className="calculator-body">
          {alert.show && (
            <div className={`alert alert-${alert.type}`} 
                 dangerouslySetInnerHTML={{ __html: alert.message }} />
          )}
          
          {/* Project Type Section */}
          <div className="form-section">
            <h3>Project Type</h3>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  name="projectType"
                  value="Typical Site Model"
                  checked={projectType === 'Typical Site Model'}
                  onChange={(e) => {
                    if (projectType === 'Typical Site Model') {
                      setProjectType('');
                    } else {
                      setProjectType(e.target.value);
                    }
                  }}
                />
                <span>Typical Site Model</span>
              </label>
              {projectType === 'Typical Site Model' && (
                <div className="sub-section">
                  <p>Enter the size of the finished modeled surface in acres. 
                     This represents the proposed grading design of the site.</p>
                  <div className="input-group">
                    <span className="input-label">Acres</span>
                    <input
                      type="number"
                      value={projectSize}
                      onChange={(e) => setProjectSize(e.target.value)}
                      min="0.1"
                      max="9999"
                      step="0.1"
                    />
                  </div>
                </div>
              )}
              
              <label className="radio-item">
                <input
                  type="radio"
                  name="projectType"
                  value="Linework"
                  checked={projectType === 'Linework'}
                  onChange={(e) => {
                    if (projectType === 'Linework') {
                      setProjectType('');
                    } else {
                      setProjectType(e.target.value);
                    }
                  }}
                />
                <span>Linework Only</span>
              </label>
              
              <label className="radio-item">
                <input
                  type="radio"
                  name="projectType"
                  value="Utilities Only"
                  checked={projectType === 'Utilities Only'}
                  onChange={(e) => {
                    if (projectType === 'Utilities Only') {
                      setProjectType('');
                    } else {
                      setProjectType(e.target.value);
                    }
                  }}
                />
                <span>Utilities Only</span>
              </label>
              
              <label className="radio-item">
                <input
                  type="radio"
                  name="projectType"
                  value="Roadway"
                  checked={projectType === 'Roadway'}
                  onChange={(e) => {
                    if (projectType === 'Roadway') {
                      setProjectType('');
                    } else {
                      setProjectType(e.target.value);
                    }
                  }}
                />
                <span>Roadway</span>
              </label>
              
              <label className="radio-item">
                <input
                  type="radio"
                  name="projectType"
                  value="Other"
                  checked={projectType === 'Other'}
                  onChange={(e) => {
                    if (projectType === 'Other') {
                      setProjectType('');
                    } else {
                      setProjectType(e.target.value);
                    }
                  }}
                />
                <span>Other</span>
              </label>
            </div>
          </div>

          {/* Add-on Services Section */}
          <div className="form-section">
            <h4>Add-on Services</h4>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={hasErosion}
                  onChange={(e) => setHasErosion(e.target.checked)}
                />
                <span>Erosion Surface - +$450</span>
              </label>
              {hasErosion && (
                <div className="info-note">
                  Please select ONLY when a dedicated erosion surface is needed.
                </div>
              )}
              
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={hasUtil}
                  onChange={(e) => setHasUtil(e.target.checked)}
                />
                <span>Elevated Utilities (10% of base)</span>
              </label>
              {hasUtil && (
                <div className="sub-section">
                  <div className="info-note">
                    All gravity pipe linework will be elevated by invert elevation.
                  </div>
                  <label className={`checkbox-item ${!hasUtil ? 'disabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={hasAdvUtil}
                      disabled={!hasUtil}
                      onChange={(e) => setHasAdvUtil(e.target.checked)}
                    />
                    <span>Advanced Utility Model - $30/structure</span>
                  </label>
                  {hasAdvUtil && (
                    <div className="sub-section">
                      <p>$30/structure modeled from shop drawings. 
                         Please enter total number of structures to be included.</p>
                      <div className="input-group">
                        <span className="input-label">Structures</span>
                        <input
                          type="number"
                          value={advUtilCount}
                          onChange={(e) => setAdvUtilCount(e.target.value)}
                          min="1"
                          max="9999"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="calculator-footer">
          <button className="btn btn-primary" onClick={calculateEstimate}>
            Calculate
          </button>
        </div>
      </div>

      {/* Quote Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Project Estimate</h5>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {alert.show && (
                <div className={`alert alert-${alert.type}`} 
                     dangerouslySetInnerHTML={{ __html: alert.message }} />
              )}
              <table className="cost-table">
                <tbody>
                  <tr>
                    <td><b>{projectType} ({projectType === 'Linework' ? 'N/A' : projectSize + ' Acre'})</b>:</td>
                    <td>{formatCurrency(costs.base)}</td>
                  </tr>
                  {costs.utility > 0 && (
                    <tr>
                      <td><b>Utility:</b></td>
                      <td>{formatCurrency(costs.utility)}</td>
                    </tr>
                  )}
                  {costs.erosion > 0 && (
                    <tr>
                      <td><b>Erosion Surface (Add-on):</b></td>
                      <td>{formatCurrency(costs.erosion)}</td>
                    </tr>
                  )}
                  {costs.advancedUtility > 0 && (
                    <tr>
                      <td><b>Advanced Utility x {advUtilCount}:</b></td>
                      <td>{formatCurrency(costs.advancedUtility)}</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td className="h3">Total:</td>
                    <td className="h3">{formatCurrency(costs.total)}</td>
                  </tr>
                </tbody>
              </table>
              
              <p className="disclaimer">
                <small><i>Final pricing will be based on the actual modeled surface area of the project.
                Please ensure the correct project type is selected. Projects classified as 'Typical Site Model'
                that do not align with standard criteria may be subject to reclassification and adjusted pricing.</i></small>
              </p>
              
              {!showUserForm ? (
                <button 
                  className="btn btn-primary full-width"
                  onClick={() => setShowUserForm(true)}
                >
                  Click Here for an Official Quote
                </button>
              ) : (
                <div className="user-form">
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      maxLength="255"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      maxLength="255"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      maxLength="255"
                      required
                    />
                  </div>
                  
                  <div className="form-check">
                    <label>
                      <input
                        type="checkbox"
                        checked={showAddress}
                        onChange={(e) => setShowAddress(e.target.checked)}
                      />
                      <span>Add Company Address (Optional)</span>
                    </label>
                  </div>
                  
                  {showAddress && (
                    <div className="address-fields">
                      <div className="form-group">
                        <label>Street Address</label>
                        <input
                          type="text"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          maxLength="255"
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            maxLength="100"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>State</label>
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            maxLength="50"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>ZIP</label>
                          <input
                            type="text"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            maxLength="20"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength="255"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
            
            {showUserForm && (
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={submitEstimate}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PricingCalculator;