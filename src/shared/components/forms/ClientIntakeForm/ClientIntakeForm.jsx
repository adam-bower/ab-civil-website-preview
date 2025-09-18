import React, { useState } from 'react';
import './ClientIntakeForm.css';
import { supabase } from '../../../lib/supabase';
import ConfirmationPage from '../../ConfirmationPage/ConfirmationPage';
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidPhone, 
  generateSecureId,
  validateFormData,
  formSubmissionLimiter,
  maskSensitiveData 
} from '../../../utils/security';

const ClientIntakeForm = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [currentContactIndex, setCurrentContactIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [formData, setFormData] = useState({
    company: {
      company_name: '',
      company_address: '',
      city: '',
      state: '',
      zip_code: '',
      company_phone: '',
      email_w9_coi: '',
      services_used: [],
      machine_control_brands: [],
      source_type: '',
      platform: '',
      platform_other: '',
      dealer_name: '',
      contractor_name: '',
      other_source_detail: '',
    },
    contacts: []
  });

  const [currentContact, setCurrentContact] = useState({
    name: '',
    phone_number: '',
    email: '',
    position: '',
    receives_invoices: false,
    another_contact: ''
  });

  const [showConditionalFields, setShowConditionalFields] = useState({
    platform: false,
    otherPlatform: false,
    dealer: false,
    contractor: false,
    otherSource: false
  });

  const [errors, setErrors] = useState({});

  // US States list
  const states = [
    { value: '', label: 'State / Province' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
    { value: 'DC', label: 'District of Columbia' }
  ];

  // Phone number formatting with +1 prefix
  const formatPhoneNumber = (value) => {
    // Remove all non-digits and the +1 prefix if it exists
    const cleaned = value.replace(/^\+1\s?/, '').replace(/\D/g, '');
    const limited = cleaned.substring(0, 10);
    
    if (limited.length === 0) return '';
    if (limited.length <= 3) return `+1 (${limited}`;
    if (limited.length <= 6) return `+1 (${limited.substring(0, 3)}) ${limited.substring(3)}`;
    return `+1 (${limited.substring(0, 3)}) ${limited.substring(3, 6)}-${limited.substring(6)}`;
  };

  // Handle company field changes with sanitization
  const handleCompanyChange = (field, value) => {
    // Don't sanitize during input - only sanitize on submit
    setFormData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value
      }
    }));
  };

  // Handle service checkbox changes
  const handleServiceChange = (service) => {
    setFormData(prev => {
      const services = prev.company.services_used;
      const newServices = services.includes(service)
        ? services.filter(s => s !== service)
        : [...services, service];
      
      return {
        ...prev,
        company: {
          ...prev.company,
          services_used: newServices
        }
      };
    });
  };

  // Handle machine brand checkbox changes
  const handleMachineBrandChange = (brand) => {
    setFormData(prev => {
      const brands = prev.company.machine_control_brands;
      const newBrands = brands.includes(brand)
        ? brands.filter(b => b !== brand)
        : [...brands, brand];
      
      return {
        ...prev,
        company: {
          ...prev.company,
          machine_control_brands: newBrands
        }
      };
    });
  };

  // Handle source selection
  const handleSourceChange = (value) => {
    handleCompanyChange('source_type', value);
    
    // Reset conditional fields
    setShowConditionalFields({
      platform: value === 'social-media',
      dealer: value === 'dealer',
      contractor: value === 'current-client',
      otherSource: value === 'other',
      otherPlatform: false
    });
    
    // Clear conditional field values
    if (value !== 'social-media') {
      handleCompanyChange('platform', '');
      handleCompanyChange('platform_other', '');
    }
    if (value !== 'dealer') {
      handleCompanyChange('dealer_name', '');
    }
    if (value !== 'current-client') {
      handleCompanyChange('contractor_name', '');
    }
    if (value !== 'other') {
      handleCompanyChange('other_source_detail', '');
    }
  };

  // Handle platform selection
  const handlePlatformChange = (value) => {
    handleCompanyChange('platform', value);
    setShowConditionalFields(prev => ({
      ...prev,
      otherPlatform: value === 'Other'
    }));
    
    if (value !== 'Other') {
      handleCompanyChange('platform_other', '');
    }
  };

  // Handle contact field changes with sanitization
  const handleContactChange = (field, value) => {
    // Don't sanitize during input - only sanitize on submit
    setCurrentContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate company form
  const validateCompanyForm = () => {
    const newErrors = {};
    const { company } = formData;
    
    if (!company.company_name) {
      newErrors.company_name = 'Company name is required';
    } else if (company.company_name.length < 2 || company.company_name.length > 200) {
      newErrors.company_name = 'Company name must be between 2 and 200 characters';
    }
    
    if (!company.company_address) {
      newErrors.company_address = 'Company address is required';
    } else if (company.company_address.length < 5 || company.company_address.length > 500) {
      newErrors.company_address = 'Address must be between 5 and 500 characters';
    }
    
    if (!company.company_phone) {
      newErrors.company_phone = 'Company phone is required';
    } else if (!isValidPhone(company.company_phone)) {
      newErrors.company_phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!company.email_w9_coi) {
      newErrors.email_w9_coi = 'Email is required';
    } else if (!isValidEmail(company.email_w9_coi)) {
      newErrors.email_w9_coi = 'Please enter a valid email address';
    }
    if (company.services_used.length === 0) newErrors.services = 'Please select at least one service';
    if (!company.source_type) newErrors.source = 'Please select how you found out about us';
    
    // Validate conditional fields
    if (company.source_type === 'social-media' && !company.platform) {
      newErrors.platform = 'Please select a platform';
    }
    if (company.platform === 'Other' && !company.platform_other) {
      newErrors.platform_other = 'Please specify the platform';
    }
    if (company.source_type === 'dealer' && !company.dealer_name) {
      newErrors.dealer_name = 'Please enter the dealer name';
    }
    if (company.source_type === 'current-client' && !company.contractor_name) {
      newErrors.contractor_name = 'Please enter the contractor name';
    }
    if (company.source_type === 'other' && !company.other_source_detail) {
      newErrors.other_source_detail = 'Please specify how you found out about us';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate contact form
  const validateContactForm = () => {
    const newErrors = {};
    
    if (!currentContact.name) {
      newErrors.contact_name = 'Name is required';
    } else if (currentContact.name.length < 2 || currentContact.name.length > 100) {
      newErrors.contact_name = 'Name must be between 2 and 100 characters';
    }
    
    if (!currentContact.phone_number) {
      newErrors.contact_phone = 'Phone number is required';
    } else if (!isValidPhone(currentContact.phone_number)) {
      newErrors.contact_phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!currentContact.email) {
      newErrors.contact_email = 'Email is required';
    } else if (!isValidEmail(currentContact.email)) {
      newErrors.contact_email = 'Please enter a valid email address';
    }
    if (!currentContact.position) newErrors.position = 'Please select a position';
    if (currentContact.receives_invoices === '') newErrors.receives_invoices = 'Please specify if this contact receives invoices';
    
    const contactNumber = currentContactIndex + 1;
    if (contactNumber < 5 && !currentContact.another_contact) {
      newErrors.another_contact = 'Please specify if you need to submit another contact';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle company form submission
  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (validateCompanyForm()) {
      setCurrentStep(1);
      setErrors({});
    }
  };

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (validateContactForm()) {
      // Save current contact
      const contactData = {
        name: currentContact.name,
        phone_number: currentContact.phone_number,
        email: currentContact.email,
        position: currentContact.position,
        receives_invoices: currentContact.receives_invoices === 'yes',
        created_at: new Date().toISOString()
      };
      
      const newContacts = [...formData.contacts];
      newContacts[currentContactIndex] = contactData;
      setFormData(prev => ({
        ...prev,
        contacts: newContacts
      }));
      
      // Check if adding another contact
      if (currentContact.another_contact === 'yes' && formData.contacts.length < 5) {
        setCurrentContactIndex(prev => prev + 1);
        setCurrentContact({
          name: '',
          phone_number: '',
          email: '',
          position: '',
          receives_invoices: '',
          another_contact: ''
        });
        setErrors({});
      } else {
        // Go to review step
        setCurrentStep(2);
        setErrors({});
      }
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === 1 && currentContactIndex > 0) {
      // Go to previous contact
      setCurrentContactIndex(prev => prev - 1);
      const prevContact = formData.contacts[currentContactIndex - 1];
      if (prevContact) {
        setCurrentContact({
          name: prevContact.name,
          phone_number: prevContact.phone_number,
          email: prevContact.email,
          position: prevContact.position,
          receives_invoices: prevContact.receives_invoices ? 'yes' : 'no',
          another_contact: currentContactIndex < formData.contacts.length - 1 ? 'yes' : 'no'
        });
      }
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  // Handle final submission to Supabase with security checks
  const handleFinalSubmit = async () => {
    // Check rate limiting
    const rateLimitCheck = formSubmissionLimiter.check(
      formData.company.email_w9_coi || 'anonymous'
    );
    if (!rateLimitCheck.allowed) {
      setSubmitMessage({ 
        type: 'error', 
        text: rateLimitCheck.message 
      });
      return;
    }
    
    // Additional security validation
    const companySecurityCheck = validateFormData(formData.company);
    if (!companySecurityCheck.isValid) {
      setSubmitMessage({ 
        type: 'error', 
        text: 'Invalid input detected in company information. Please check your entries.' 
      });
      return;
    }
    
    // Validate each contact
    for (const contact of formData.contacts) {
      const contactSecurityCheck = validateFormData(contact);
      if (!contactSecurityCheck.isValid) {
        setSubmitMessage({ 
          type: 'error', 
          text: 'Invalid input detected in contact information. Please check your entries.' 
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    try {
      // Helper to strip +1 from phone numbers for database storage
      const stripPhonePrefix = (phone) => {
        if (!phone) return phone;
        return phone.replace(/^\+1\s?/, '');
      };

      // Prepare data for client_intake table
      const intakeData = {
        // Company fields
        company_name: sanitizeInput(formData.company.company_name),
        company_address: sanitizeInput(formData.company.company_address),
        city: sanitizeInput(formData.company.city),
        state: formData.company.state,
        zip_code: formData.company.zip_code,
        company_phone: stripPhonePrefix(formData.company.company_phone),
        email_w9_coi: sanitizeInput(formData.company.email_w9_coi),
        
        // Source fields - remove enum values by not including them
        source_type: formData.company.source_type,
        platform_other: sanitizeInput(formData.company.platform_other) || null,
        dealer_name: sanitizeInput(formData.company.dealer_name) || null,
        contractor_name: sanitizeInput(formData.company.contractor_name) || null,
        other_source_detail: sanitizeInput(formData.company.other_source_detail) || null,
        
        // Services and brands as arrays
        services_used: formData.company.services_used.length > 0 
          ? formData.company.services_used 
          : null,
        machine_control_brands: formData.company.machine_control_brands.length > 0 
          ? formData.company.machine_control_brands 
          : null,
        
        // Total contacts
        total_contacts: formData.contacts.length,
        created_at: new Date().toISOString()
      };

      // Add contact fields (up to 5 contacts)
      formData.contacts.forEach((contact, index) => {
        const num = index + 1;
        intakeData[`contact_${num}_name`] = sanitizeInput(contact.name);
        intakeData[`contact_${num}_phone`] = stripPhonePrefix(contact.phone_number);
        intakeData[`contact_${num}_email`] = sanitizeInput(contact.email);
        intakeData[`contact_${num}_position`] = contact.position || null;
        intakeData[`contact_${num}_receives_invoices`] = contact.receives_invoices === true || contact.receives_invoices === 'yes';
      });

      // Insert into client_intake table
      const { error } = await supabase
        .from('client_intake')
        .insert([intakeData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Success! Store submission data and show confirmation page
      // Use secure random ID instead of timestamp
      const referenceNumber = `CI-${generateSecureId(8)}`;
      
      // Format source_type for display
      const formatSourceType = (type) => {
        const sourceMap = {
          'social-media': 'Social Media',
          'dealer': 'Dealer',
          'current-client': 'Current Client',
          'email-marketing': 'Email/Text',
          'search-engine': 'Google',
          'other': 'Other'
        };
        return sourceMap[type] || type;
      };
      
      setSubmissionResult({
        referenceNumber,
        submittedData: {
          company: {
            ...formData.company,
            source_type: formatSourceType(formData.company.source_type)
          },
          contacts: formData.contacts
        }
      });
      
      setShowConfirmation(true);
      
    } catch (error) {
      // Log error with masked sensitive data
      console.error('Submission error:', maskSensitiveData(error));
      setSubmitMessage({ 
        type: 'error', 
        text: 'There was an error submitting your information. Please try again or contact us directly.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle new submission from confirmation page
  const handleNewSubmission = () => {
    resetForm();
    setSubmissionResult(null);
    setShowConfirmation(false);
  };

  // Reset form to initial state
  const resetForm = () => {
    setCurrentStep(0);
    setCurrentContactIndex(0);
    setFormData({
      company: {
        company_name: '',
        company_address: '',
        city: '',
        state: '',
        zip_code: '',
        company_phone: '',
        email_w9_coi: '',
        services_used: [],
        machine_control_brands: [],
        source_type: '',
        platform: '',
        platform_other: '',
        dealer_name: '',
        contractor_name: '',
        other_source_detail: '',
      },
      contacts: []
    });
    setCurrentContact({
      name: '',
      phone_number: '',
      email: '',
      position: '',
      receives_invoices: '',
      another_contact: ''
    });
    setShowConditionalFields({
      platform: false,
      otherPlatform: false,
      dealer: false,
      contractor: false,
      otherSource: false
    });
    setErrors({});
    setSubmitMessage({ type: '', text: '' });
  };

  // Render company form
  const renderCompanyForm = () => (
    <form onSubmit={handleCompanySubmit} className="form-step condensed-form">
      <div className="form-header">
        <h2 className="form-title">Business Information</h2>
      </div>
      
      {/* Company Details Section */}
      <div className="form-section">
        <div className="form-row">
          <label htmlFor="company-name">
            Company Name <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="company-name"
              placeholder="Type your answer"
              value={formData.company.company_name}
              onChange={(e) => handleCompanyChange('company_name', e.target.value)}
              className={errors.company_name ? 'error-highlight' : ''}
              required
            />
            {errors.company_name && <span className="error-message">{errors.company_name}</span>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="company-address">
            Company Address <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="company-address"
              placeholder="Street Address"
              value={formData.company.company_address}
              onChange={(e) => handleCompanyChange('company_address', e.target.value)}
              className={errors.company_address ? 'error-highlight' : ''}
              required
            />
            <div className="address-row">
              <input
                type="text"
                placeholder="City"
                value={formData.company.city}
                onChange={(e) => handleCompanyChange('city', e.target.value)}
              />
              <select
                value={formData.company.state}
                onChange={(e) => handleCompanyChange('state', e.target.value)}
              >
                {states.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="ZIP"
                value={formData.company.zip_code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').substring(0, 5);
                  handleCompanyChange('zip_code', value);
                }}
                maxLength="5"
              />
            </div>
            {errors.company_address && <span className="error-message">{errors.company_address}</span>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="company-phone">
            Company Phone <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="tel"
              id="company-phone"
              placeholder="+1 (___) ___-____"
              value={formData.company.company_phone}
              onChange={(e) => handleCompanyChange('company_phone', formatPhoneNumber(e.target.value))}
              className={errors.company_phone ? 'error-highlight' : ''}
              maxLength="17"
              required
            />
            {errors.company_phone && <span className="error-message">{errors.company_phone}</span>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="email-w9">
            Email for W9/COI <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email-w9"
              placeholder="email@company.com"
              value={formData.company.email_w9_coi}
              onChange={(e) => handleCompanyChange('email_w9_coi', e.target.value)}
              className={errors.email_w9_coi ? 'error-highlight' : ''}
              required
            />
            {errors.email_w9_coi && <span className="error-message">{errors.email_w9_coi}</span>}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="form-section">
        <div className="form-row">
          <label>
            Services Needed <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <div className="checkbox-group-inline">
              <label className="checkbox-item-inline" htmlFor="service-3d-model">
                <input
                  type="checkbox"
                  id="service-3d-model"
                  checked={formData.company.services_used.includes('3D Models')}
                  onChange={() => handleServiceChange('3D Models')}
                />
                <span>3D Models</span>
              </label>
              <label className="checkbox-item-inline" htmlFor="service-takeoff">
                <input
                  type="checkbox"
                  id="service-takeoff"
                  checked={formData.company.services_used.includes('Takeoffs')}
                  onChange={() => handleServiceChange('Takeoffs')}
                />
                <span>Takeoffs</span>
              </label>
            </div>
            {errors.services && <span className="error-message">{errors.services}</span>}
          </div>
        </div>

        <div className="form-row">
          <label>Machine Control</label>
          <div className="input-wrapper">
            <div className="checkbox-group-inline">
              <label className="checkbox-item-inline" htmlFor="brand-trimble">
                <input
                  type="checkbox"
                  id="brand-trimble"
                  checked={formData.company.machine_control_brands.includes('Trimble')}
                  onChange={() => handleMachineBrandChange('Trimble')}
                />
                <span>Trimble</span>
              </label>
              <label className="checkbox-item-inline" htmlFor="brand-topcon">
                <input
                  type="checkbox"
                  id="brand-topcon"
                  checked={formData.company.machine_control_brands.includes('Topcon')}
                  onChange={() => handleMachineBrandChange('Topcon')}
                />
                <span>Topcon</span>
              </label>
              <label className="checkbox-item-inline" htmlFor="brand-leica">
                <input
                  type="checkbox"
                  id="brand-leica"
                  checked={formData.company.machine_control_brands.includes('Leica')}
                  onChange={() => handleMachineBrandChange('Leica')}
                />
                <span>Leica</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Source Section */}
      <div className="form-section">
        <div className="form-row">
          <label>
            How did you hear? <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <div className="radio-group-inline radio-group-mobile-stack">
              <label className="radio-item-inline" htmlFor="social-media">
                <input
                  type="radio"
                  id="social-media"
                  name="source"
                  value="social-media"
                  checked={formData.company.source_type === 'social-media'}
                  onChange={(e) => handleSourceChange(e.target.value)}
                />
                <span>Social Media</span>
              </label>
              <label className="radio-item-inline" htmlFor="dealer">
                <input
                  type="radio"
                  id="dealer"
                  name="source"
                  value="dealer"
                  checked={formData.company.source_type === 'dealer'}
                  onChange={(e) => handleSourceChange(e.target.value)}
                />
                <span>Dealer</span>
              </label>
              <label className="radio-item-inline" htmlFor="current-client">
                <input
                  type="radio"
                  id="current-client"
                  name="source"
                  value="current-client"
                  checked={formData.company.source_type === 'current-client'}
                  onChange={(e) => handleSourceChange(e.target.value)}
                />
                <span>Current Client</span>
              </label>
              <label className="radio-item-inline" htmlFor="email-marketing">
                <input
                  type="radio"
                  id="email-marketing"
                  name="source"
                  value="email-marketing"
                  checked={formData.company.source_type === 'email-marketing'}
                  onChange={(e) => handleSourceChange(e.target.value)}
                />
                <span>Email/Text</span>
              </label>
              <label className="radio-item-inline" htmlFor="search-engine">
                <input
                  type="radio"
                  id="search-engine"
                  name="source"
                  value="search-engine"
                  checked={formData.company.source_type === 'search-engine'}
                  onChange={(e) => handleSourceChange(e.target.value)}
                />
                <span>Google</span>
              </label>
              <label className="radio-item-inline" htmlFor="other-source">
                <input
                  type="radio"
                  id="other-source"
                  name="source"
                  value="other"
                  checked={formData.company.source_type === 'other'}
                  onChange={(e) => handleSourceChange(e.target.value)}
                />
                <span>Other</span>
              </label>
            </div>
            {errors.source && <span className="error-message">{errors.source}</span>}
          </div>
        </div>
      </div>

      {/* Conditional fields */}
      {showConditionalFields.platform && (
        <div className="form-group">
          <label>
            Which Platform? <span className="required">*</span>
          </label>
          <div className="radio-group">
            <label className="radio-item" htmlFor="instagram">
              <input
                type="radio"
                id="instagram"
                name="platform"
                value="Instagram"
                checked={formData.company.platform === 'Instagram'}
                onChange={(e) => handlePlatformChange(e.target.value)}
              />
              <span>Instagram</span>
            </label>
            <label className="radio-item" htmlFor="tiktok">
              <input
                type="radio"
                id="tiktok"
                name="platform"
                value="TikTok"
                checked={formData.company.platform === 'TikTok'}
                onChange={(e) => handlePlatformChange(e.target.value)}
              />
              <span>TikTok</span>
            </label>
            <label className="radio-item" htmlFor="facebook">
              <input
                type="radio"
                id="facebook"
                name="platform"
                value="Facebook"
                checked={formData.company.platform === 'Facebook'}
                onChange={(e) => handlePlatformChange(e.target.value)}
              />
              <span>Facebook</span>
            </label>
            <label className="radio-item" htmlFor="youtube">
              <input
                type="radio"
                id="youtube"
                name="platform"
                value="YouTube"
                checked={formData.company.platform === 'YouTube'}
                onChange={(e) => handlePlatformChange(e.target.value)}
              />
              <span>YouTube</span>
            </label>
            <label className="radio-item" htmlFor="linkedin">
              <input
                type="radio"
                id="linkedin"
                name="platform"
                value="LinkedIn"
                checked={formData.company.platform === 'LinkedIn'}
                onChange={(e) => handlePlatformChange(e.target.value)}
              />
              <span>LinkedIn</span>
            </label>
            <label className="radio-item" htmlFor="other-platform">
              <input
                type="radio"
                id="other-platform"
                name="platform"
                value="Other"
                checked={formData.company.platform === 'Other'}
                onChange={(e) => handlePlatformChange(e.target.value)}
              />
              <span>Other</span>
            </label>
          </div>
          {errors.platform && (
            <span className="error-message">{errors.platform}</span>
          )}
        </div>
      )}

      {showConditionalFields.otherPlatform && (
        <div className="form-group">
          <label htmlFor="other-platform-text">
            Please specify platform <span className="required">*</span>
          </label>
          <input
            type="text"
            id="other-platform-text"
            placeholder="Type your answer"
            value={formData.company.platform_other}
            onChange={(e) => handleCompanyChange('platform_other', e.target.value)}
            className={errors.platform_other ? 'error-highlight' : ''}
          />
        </div>
      )}

      {showConditionalFields.dealer && (
        <div className="form-group">
          <label htmlFor="dealer-name">
            Name of dealer <span className="required">*</span>
          </label>
          <input
            type="text"
            id="dealer-name"
            placeholder="Type your answer"
            value={formData.company.dealer_name}
            onChange={(e) => handleCompanyChange('dealer_name', e.target.value)}
            className={errors.dealer_name ? 'error-highlight' : ''}
          />
        </div>
      )}

      {showConditionalFields.contractor && (
        <div className="form-group">
          <label htmlFor="contractor-name">
            Name of contractor <span className="required">*</span>
          </label>
          <input
            type="text"
            id="contractor-name"
            placeholder="Type your answer"
            value={formData.company.contractor_name}
            onChange={(e) => handleCompanyChange('contractor_name', e.target.value)}
            className={errors.contractor_name ? 'error-highlight' : ''}
          />
        </div>
      )}

      {showConditionalFields.otherSource && (
        <div className="form-group">
          <label htmlFor="other-source-text">
            Please specify <span className="required">*</span>
          </label>
          <input
            type="text"
            id="other-source-text"
            placeholder="Type your answer"
            value={formData.company.other_source_detail}
            onChange={(e) => handleCompanyChange('other_source_detail', e.target.value)}
            className={errors.other_source_detail ? 'error-highlight' : ''}
          />
        </div>
      )}

      <div className="button-group">
        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </div>
    </form>
  );

  // Render contact form
  const renderContactForm = () => {
    const contactNumber = currentContactIndex + 1;
    
    return (
      <form onSubmit={handleContactSubmit} className="form-step condensed-form">
        <div className="form-header">
          <h2 className="form-title">Contact Person {contactNumber}</h2>
        </div>
        
        {/* Contact summary for contacts 2+ */}
        {contactNumber > 1 && (
          <div className="contact-summary">
            <h4>Previous Contacts:</h4>
            {formData.contacts.slice(0, currentContactIndex).map((contact, index) => (
              <p key={index}>
                <strong>Contact {index + 1}:</strong> {contact.name} - {contact.position}
              </p>
            ))}
          </div>
        )}

        {/* Contact Details Section */}
        <div className="form-section">
          <div className="form-row">
            <label htmlFor="contact-name">
              Name <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="contact-name"
                placeholder="Type your answer"
                value={currentContact.name}
                onChange={(e) => handleContactChange('name', e.target.value)}
                className={errors.contact_name ? 'error-highlight' : ''}
                required
              />
              {errors.contact_name && <span className="error-message">{errors.contact_name}</span>}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="contact-phone">
              Phone <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="tel"
                id="contact-phone"
                placeholder="+1 (___) ___-____"
                value={currentContact.phone_number}
                onChange={(e) => handleContactChange('phone_number', formatPhoneNumber(e.target.value))}
                className={errors.contact_phone ? 'error-highlight' : ''}
                maxLength="17"
                required
              />
              {errors.contact_phone && <span className="error-message">{errors.contact_phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="contact-email">
              Email <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="contact-email"
                placeholder="Type your answer"
                value={currentContact.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className={errors.contact_email ? 'error-highlight' : ''}
                required
              />
              {errors.contact_email && <span className="error-message">{errors.contact_email}</span>}
            </div>
          </div>
        </div>

        {/* Position Section */}
        <div className="form-section">
          <div className="form-row">
            <label>
              Position <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <div className="radio-group-inline radio-group-mobile-stack">
                <label className="radio-item-inline" htmlFor="owner-president">
                  <input
                    type="radio"
                    id="owner-president"
                    name="position"
                    value="Owner/President"
                    checked={currentContact.position === 'Owner/President'}
                    onChange={(e) => handleContactChange('position', e.target.value)}
                  />
                  <span>Owner/President</span>
                </label>
                <label className="radio-item-inline" htmlFor="accounts-payable">
                  <input
                    type="radio"
                    id="accounts-payable"
                    name="position"
                    value="Accounts Payable"
                    checked={currentContact.position === 'Accounts Payable'}
                    onChange={(e) => handleContactChange('position', e.target.value)}
                  />
                  <span>Accounts Payable</span>
                </label>
                <label className="radio-item-inline" htmlFor="admin">
                  <input
                    type="radio"
                    id="admin"
                    name="position"
                    value="Admin"
                    checked={currentContact.position === 'Admin'}
                    onChange={(e) => handleContactChange('position', e.target.value)}
                  />
                  <span>Admin</span>
                </label>
                <label className="radio-item-inline" htmlFor="project-management">
                  <input
                    type="radio"
                    id="project-management"
                    name="position"
                    value="Project Management"
                    checked={currentContact.position === 'Project Management'}
                    onChange={(e) => handleContactChange('position', e.target.value)}
                  />
                  <span>Project Mgmt</span>
                </label>
                <label className="radio-item-inline" htmlFor="field-staff">
                  <input
                    type="radio"
                    id="field-staff"
                    name="position"
                    value="Field Staff"
                    checked={currentContact.position === 'Field Staff'}
                    onChange={(e) => handleContactChange('position', e.target.value)}
                  />
                  <span>Field Staff</span>
                </label>
                <label className="radio-item-inline" htmlFor="estimator">
                  <input
                    type="radio"
                    id="estimator"
                    name="position"
                    value="Estimator"
                    checked={currentContact.position === 'Estimator'}
                    onChange={(e) => handleContactChange('position', e.target.value)}
                  />
                  <span>Estimator</span>
                </label>
              </div>
              {errors.position && <span className="error-message">{errors.position}</span>}
            </div>
          </div>
        </div>

        {/* Additional Contact Details Section */}
        <div className="form-section">
          <div className="form-row">
            <label>
              Receives Invoices? <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <div className="radio-group-inline">
                <label className="radio-item-inline" htmlFor="receives-yes">
                  <input
                    type="radio"
                    id="receives-yes"
                    name="receives-invoices"
                    value="yes"
                    checked={currentContact.receives_invoices === 'yes'}
                    onChange={(e) => handleContactChange('receives_invoices', e.target.value)}
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-item-inline" htmlFor="receives-no">
                  <input
                    type="radio"
                    id="receives-no"
                    name="receives-invoices"
                    value="no"
                    checked={currentContact.receives_invoices === 'no'}
                    onChange={(e) => handleContactChange('receives_invoices', e.target.value)}
                  />
                  <span>No</span>
                </label>
              </div>
              {errors.receives_invoices && <span className="error-message">{errors.receives_invoices}</span>}
            </div>
          </div>

          {contactNumber < 5 && (
            <div className="form-row">
              <label>
                Another Contact? <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <div className="radio-group-inline">
                  <label className="radio-item-inline" htmlFor="another-yes">
                    <input
                      type="radio"
                      id="another-yes"
                      name="another-contact"
                      value="yes"
                      checked={currentContact.another_contact === 'yes'}
                      onChange={(e) => handleContactChange('another_contact', e.target.value)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="radio-item-inline" htmlFor="another-no">
                    <input
                      type="radio"
                      id="another-no"
                      name="another-contact"
                      value="no"
                      checked={currentContact.another_contact === 'no'}
                      onChange={(e) => handleContactChange('another_contact', e.target.value)}
                    />
                    <span>No</span>
                  </label>
                </div>
                {errors.another_contact && <span className="error-message">{errors.another_contact}</span>}
              </div>
            </div>
          )}
        </div>

        <div className="button-group">
          <button type="button" className="btn btn-secondary" onClick={handleBack}>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </div>
      </form>
    );
  };

  // Render review step
  const renderReviewStep = () => {
    const servicesArray = formData.company.services_used;
    const brandsArray = formData.company.machine_control_brands;
    
    return (
      <div className="form-step">
        <h2 className="form-title">Review & Submit</h2>
        
        {submitMessage.text && (
          <div className={`submit-message ${submitMessage.type}`}>
            {submitMessage.text}
          </div>
        )}
        
        <div className="contact-summary">
          <h4>Company Information</h4>
          <p>{formData.company.company_name}</p>
          <p>{formData.company.company_address}, {formData.company.city}, {formData.company.state} {formData.company.zip_code}</p>
          <p>{formData.company.company_phone}</p>
          <p>{formData.company.email_w9_coi}</p>
          <p><strong>Services:</strong> {servicesArray.join(', ')}</p>
          {brandsArray.length > 0 && (
            <p><strong>Machine Control Brands:</strong> {brandsArray.join(', ')}</p>
          )}
          {formData.company.source_type && (
            <p><strong>How did you hear about us:</strong> {
              formData.company.source_type === 'social-media' ? 'Social Media' :
              formData.company.source_type === 'dealer' ? 'Dealer' :
              formData.company.source_type === 'current-client' ? 'Current Client' :
              formData.company.source_type === 'email-marketing' ? 'Email/Text' :
              formData.company.source_type === 'search-engine' ? 'Google' :
              formData.company.source_type === 'other' ? 'Other' :
              formData.company.source_type
            }</p>
          )}
          {formData.company.platform && formData.company.platform !== 'Other' && (
            <p><strong>Platform:</strong> {formData.company.platform}</p>
          )}
          {formData.company.platform_other && (
            <p><strong>Platform:</strong> {formData.company.platform_other}</p>
          )}
          {formData.company.dealer_name && (
            <p><strong>Dealer Name:</strong> {formData.company.dealer_name}</p>
          )}
          {formData.company.contractor_name && (
            <p><strong>Contractor Name:</strong> {formData.company.contractor_name}</p>
          )}
          {formData.company.other_source_detail && (
            <p><strong>Source Details:</strong> {formData.company.other_source_detail}</p>
          )}
        </div>

        {formData.contacts.map((contact, index) => (
          <div key={index} className="contact-summary">
            <h4>Contact {index + 1}</h4>
            <p><strong>Name:</strong> {contact.name}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Phone:</strong> {contact.phone_number}</p>
            <p><strong>Position:</strong> {contact.position}</p>
            <p><strong>Receives Invoices:</strong> {contact.receives_invoices ? 'Yes' : 'No'}</p>
          </div>
        ))}

        <div className="button-group">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit All Information'}
          </button>
        </div>
      </div>
    );
  };

  // Show confirmation page if form was submitted successfully
  if (showConfirmation && submissionResult) {
    return (
      <ConfirmationPage
        title="Client Information Received!"
        message="Thank you for submitting your company information. We will review your information."
        referenceNumber={submissionResult.referenceNumber}
        submissionData={submissionResult.submittedData}
        showDetails={true}
        onNewSubmission={handleNewSubmission}
      />
    );
  }

  return (
    <div className="form-container">
      {currentStep === 0 && renderCompanyForm()}
      {currentStep === 1 && renderContactForm()}
      {currentStep === 2 && renderReviewStep()}
    </div>
  );
};

export default ClientIntakeForm;