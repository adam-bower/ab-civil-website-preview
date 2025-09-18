import React, { useState } from 'react';
import './ServiceRequestForm.css';
import { supabase } from '../../../lib/supabase';
import FileUploadWithFolders from '../../FileUpload/FileUploadWithFolders';
import SupabaseStorageService from '../../../services/supabaseStorageService';
import ConfirmationPage from '../../ConfirmationPage/ConfirmationPage';
import AutoResizeWrapper from '../../AutoResizeWrapper/AutoResizeWrapper';
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidPhone, 
  generateSecureId,
  validateFormData,
  formSubmissionLimiter,
  maskSensitiveData 
} from '../../../utils/security';

const ServiceRequestForm = () => {
  // State management
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection', 'form', or 'confirmation'
  const [serviceSelection, setServiceSelection] = useState({
    serviceType: '', // '3D Model' or 'Takeoff'
    proceedWork: ''   // 'Yes' or 'Quote Only'
  });
  
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    company: '',
    project: '',
    state: '',
    phone: '',
    
    // Model specific fields
    revision: '',
    dueDate: '',
    fileFormats: [],
    additionalRequests: [],
    erosionSurfaceDueDate: '', // Date for Initial Erosion Surface
    advancedUtilities: false,   // Checkbox for 3D/Elevated Pipe
    structureCount: '',         // Number input for advanced utilities
    
    // Takeoff specific fields
    cadAvailable: '',
    scopeOptions: [],  // Initialize as empty array for checkboxes
    strippingDepth: '',
    replacementDepth: '',
    projectInfo: '',
    
    // Common optional fields
    specialInstructions: '',
    
    // File attachments - Initialize as empty array
    fileAttachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [submissionResult, setSubmissionResult] = useState(null);

  // Function to scroll to first error
  const scrollToFirstError = (errorFields) => {
    // Find the first field with an error
    const firstErrorField = Object.keys(errorFields)[0];
    if (!firstErrorField) return;

    // Add a small delay to let the error messages render
    setTimeout(() => {
      // Try to find the element with the error
      let targetElement = null;
      
      // First try to find by ID
      targetElement = document.getElementById(firstErrorField);
      
      // If not found, try to find by name attribute
      if (!targetElement) {
        targetElement = document.querySelector(`[name="${firstErrorField}"]`);
      }
      
      // If not found, try to find the error message itself and get its associated input
      if (!targetElement) {
        const errorMessages = document.querySelectorAll('.error-message');
        for (const errorMsg of errorMessages) {
          // Look for input/select/textarea in the same parent container
          const container = errorMsg.closest('.input-wrapper') || errorMsg.closest('.form-row');
          if (container) {
            const input = container.querySelector('input, select, textarea');
            if (input) {
              targetElement = input;
              break;
            }
          }
        }
      }
      
      // If we found an element, scroll to it with proper cushion
      if (targetElement) {
        // Calculate position with cushion space
        const elementRect = targetElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const cushionSpace = 150; // Space from top of viewport
        const targetScrollPosition = Math.max(0, absoluteElementTop - cushionSpace);
        
        // Smooth scroll to position
        window.scrollTo({
          top: targetScrollPosition,
          behavior: 'smooth'
        });
        
        // Focus the field after scrolling completes
        setTimeout(() => {
          if (targetElement.tagName === 'INPUT' || targetElement.tagName === 'SELECT' || targetElement.tagName === 'TEXTAREA') {
            targetElement.focus();
          }
        }, 500); // Wait for smooth scroll to complete
      }
    }, 100); // Small delay to ensure DOM is updated
  };

  // US States list
  const states = [
    { value: '', label: 'Select a state' },
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
    { value: 'WY', label: 'Wyoming' }
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

  // Handle field changes with sanitization
  const handleFieldChange = (field, value) => {
    // Don't sanitize during input - only sanitize on submit
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  // Validate selection step
  const validateSelection = () => {
    const newErrors = {};
    
    if (!serviceSelection.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }
    if (!serviceSelection.proceedWork) {
      newErrors.proceedWork = 'Please select how to proceed';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
    }
    return Object.keys(newErrors).length === 0;
  };

  // Validate form based on type
  const validateForm = () => {
    const newErrors = {};
    
    // Common required fields with validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Name must be between 2 and 100 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.company) {
      newErrors.company = 'Company name is required';
    } else if (formData.company.length < 2 || formData.company.length > 200) {
      newErrors.company = 'Company name must be between 2 and 200 characters';
    }
    
    if (!formData.project) {
      newErrors.project = 'Project name is required';
    } else if (formData.project.length < 2 || formData.project.length > 200) {
      newErrors.project = 'Project name must be between 2 and 200 characters';
    }
    
    // Model-specific validation
    if (serviceSelection.serviceType === '3D Model') {
      if (!formData.state) newErrors.state = 'Project state is required';
      if (!formData.revision) newErrors.revision = 'Please specify if this is a revision';
      if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
      if (formData.fileFormats.length === 0) newErrors.fileFormats = 'Please select at least one file format';
      
      // Validate erosion surface date if Initial Erosion Surface is selected
      if (formData.additionalRequests.includes('Initial Erosion Surface') && !formData.erosionSurfaceDueDate) {
        newErrors.erosionSurfaceDueDate = 'Initial Erosion Surface due date is required';
      }
    }
    
    // Takeoff-specific validation (no state field needed)
    if (serviceSelection.serviceType === 'Takeoff') {
      if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
      if (!formData.cadAvailable) newErrors.cadAvailable = 'Please specify if CAD files are available';
      if (!formData.scopeOptions || formData.scopeOptions.length === 0) {
        newErrors.scopeOptions = 'Please select at least one scope option';
      }
      
      // Validate earthwork depth fields if Earthwork is selected
      if (formData.scopeOptions?.includes('Earthwork Cut/Fill')) {
        if (!formData.strippingDepth) newErrors.strippingDepth = 'Stripping depth is required when Earthwork Cut/Fill is selected';
        if (!formData.replacementDepth) newErrors.replacementDepth = 'Replacement depth is required when Earthwork Cut/Fill is selected';
      }
    }
    
    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    if (Object.keys(newErrors).length > 0) {
      scrollToFirstError(newErrors);
    }
    return Object.keys(newErrors).length === 0;
  };

  // Handle selection submission
  const handleSelectionSubmit = (e) => {
    e.preventDefault();
    if (validateSelection()) {
      setCurrentStep('form');
      setErrors({});
    }
  };

  // Handle form submission to Supabase with security checks
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Check rate limiting
    const rateLimitCheck = formSubmissionLimiter.check(formData.email || 'anonymous');
    if (!rateLimitCheck.allowed) {
      setSubmitMessage({ 
        type: 'error', 
        text: rateLimitCheck.message 
      });
      return;
    }
    
    // Log with masked sensitive data
    console.log('Form submission triggered');
    console.log('Current formData:', maskSensitiveData(formData));
    console.log('Service selection:', serviceSelection);
    
    if (!validateForm()) {
      console.log('Validation failed. Errors:', errors);
      return;
    }
    
    // Additional security validation
    const securityCheck = validateFormData(formData);
    if (!securityCheck.isValid) {
      setErrors(securityCheck.errors);
      setSubmitMessage({ 
        type: 'error', 
        text: 'Invalid input detected. Please check your entries.' 
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    try {
      // Helper to strip +1 from phone numbers for database storage
      const stripPhonePrefix = (phone) => {
        if (!phone) return phone;
        return phone.replace(/^\+1\s?/, '');
      };

      // Determine which table to use based on selection
      let tableName = '';
      if (serviceSelection.serviceType === '3D Model' && serviceSelection.proceedWork === 'Yes') {
        tableName = 'model_requests';
      } else if (serviceSelection.serviceType === '3D Model' && serviceSelection.proceedWork === 'Quote Only') {
        tableName = 'model_quotes';
      } else if (serviceSelection.serviceType === 'Takeoff' && serviceSelection.proceedWork === 'Yes') {
        tableName = 'takeoff_requests';
      } else if (serviceSelection.serviceType === 'Takeoff' && serviceSelection.proceedWork === 'Quote Only') {
        tableName = 'takeoff_quotes';
      }

      // Prepare submission data based on form type
      let submissionData = {};

      // Add model-specific fields for model_requests table
      if (serviceSelection.serviceType === '3D Model' && serviceSelection.proceedWork === 'Yes') {
        submissionData = {
          name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email),
          company_name: sanitizeInput(formData.company),
          project_name: sanitizeInput(formData.project),
          state: formData.state,
          is_revision: formData.revision === 'Yes' ? true : false,
          finish_grade_due_date: formData.dueDate,
          file_formats: formData.fileFormats,  // JSONB - send as array
          additional_requests: formData.additionalRequests.length > 0 ? formData.additionalRequests : null,  // JSONB
          advanced_utility: formData.additionalRequests.includes('3D/Elevated Pipe') && formData.advancedUtilities === true,  // Only true if 3D/Elevated Pipe is selected AND Advanced Utilities is checked
          structure_count: formData.additionalRequests.includes('3D/Elevated Pipe') && formData.advancedUtilities && formData.structureCount ? parseInt(formData.structureCount) : null,
          erosion_surface_due_date: formData.additionalRequests.includes('Initial Erosion Surface') && formData.erosionSurfaceDueDate ? formData.erosionSurfaceDueDate : null,
          project_info: formData.specialInstructions || null,
          // Format file attachments for database JSONB column
          file_attachments: (() => {
            if (!formData.fileAttachments || formData.fileAttachments.length === 0) {
              return null;
            }
            // Filter for uploaded files (those with a URL)
            const uploadedFiles = formData.fileAttachments.filter(f => !!f.url);
            if (uploadedFiles.length === 0) return null;
            return uploadedFiles.map(f => ({
              filename: f.filename,
              url: f.url,
              size: f.size,
              path: f.path || f.url.split('/').slice(-2).join('/')
            }));
          })(),
          // created_at and updated_at are handled by database defaults
        };
      }
      // Add fields for model_quotes table
      else if (serviceSelection.serviceType === '3D Model' && serviceSelection.proceedWork === 'Quote Only') {
        submissionData = {
          name: formData.name,
          email: formData.email,
          company_name: formData.company,
          project_name: formData.project,
          state: formData.state,
          is_revision: formData.revision === 'Yes' ? true : false,
          quote_due_date: formData.dueDate,  // Note: different field name than model_requests
          file_formats: formData.fileFormats.length > 0 ? formData.fileFormats : null,  // text[] array
          additional_requests: formData.additionalRequests.length > 0 ? formData.additionalRequests : null,  // text[] array
          advanced_utility: formData.additionalRequests.includes('3D/Elevated Pipe') && formData.advancedUtilities === true,  // Only true if 3D/Elevated Pipe is selected AND Advanced Utilities is checked
          structure_count: formData.additionalRequests.includes('3D/Elevated Pipe') && formData.advancedUtilities && formData.structureCount ? parseInt(formData.structureCount) : null,
          erosion_surface_due_date: formData.additionalRequests.includes('Initial Erosion Surface') && formData.erosionSurfaceDueDate ? formData.erosionSurfaceDueDate : null,
          project_info: formData.specialInstructions || null,
          // Format file attachments for database JSONB column
          file_attachments: (() => {
            if (!formData.fileAttachments || formData.fileAttachments.length === 0) {
              return null;
            }
            // Filter for uploaded files (those with a URL)
            const uploadedFiles = formData.fileAttachments.filter(f => !!f.url);
            if (uploadedFiles.length === 0) return null;
            return uploadedFiles.map(f => ({
              filename: f.filename,
              url: f.url,
              size: f.size,
              path: f.path || f.url.split('/').slice(-2).join('/')
            }));
          })(),
          // These fields will be null for new submissions
          price: null,
          quote_status: null,
          notes_from_ab_civil: null,
          date_quoted: null,
          quote_status_change_date: null,
          client_name: null,
          client_id: null,
          // Airtable fields null for web submissions
          airtable_record_id: null,
          airtable_client_record_id: null,
          airtable_contact_record_id: null,
          airtable_created_date: null,
          last_modified_date: null,
        };
      }

      // Add takeoff_requests table fields
      else if (serviceSelection.serviceType === 'Takeoff' && serviceSelection.proceedWork === 'Yes') {
        submissionData = {
          name: formData.name,
          email: formData.email,
          phone: null,
          company_name: formData.company,
          project_name: formData.project,
          due_date: formData.dueDate,
          cad_available: formData.cadAvailable === 'Yes',
          scope_options: formData.scopeOptions,  // JSONB array
          stripping_depth: formData.strippingDepth || null,
          replacement_depth: formData.replacementDepth || null,
          project_info: formData.projectInfo || null,
          takeoff_status: null,  // Explicitly set to null to avoid database default
          // Format file attachments for database JSONB column
          file_attachments: (() => {
            if (!formData.fileAttachments || formData.fileAttachments.length === 0) {
              return null;
            }
            // Filter for uploaded files (those with a URL)
            const uploadedFiles = formData.fileAttachments.filter(f => !!f.url);
            if (uploadedFiles.length === 0) return null;
            return uploadedFiles.map(f => ({
              filename: f.filename,
              url: f.url,
              size: f.size,
              path: f.path || f.url.split('/').slice(-2).join('/')
            }));
          })(),
          // created_at and updated_at are handled by database defaults
        };
      }
      // Add takeoff_quotes table fields (same structure as takeoff_requests)
      else if (serviceSelection.serviceType === 'Takeoff' && serviceSelection.proceedWork === 'Quote Only') {
        submissionData = {
          name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email),
          phone: null,
          company_name: sanitizeInput(formData.company),
          project_name: sanitizeInput(formData.project),
          due_date: formData.dueDate,
          cad_available: formData.cadAvailable === 'Yes',
          scope_options: formData.scopeOptions,  // JSONB array
          stripping_depth: formData.strippingDepth || null,
          replacement_depth: formData.replacementDepth || null,
          project_info: formData.projectInfo || null,
          // Format file attachments for database JSONB column
          file_attachments: (() => {
            if (!formData.fileAttachments || formData.fileAttachments.length === 0) {
              return null;
            }
            // Filter for uploaded files (those with a URL)
            const uploadedFiles = formData.fileAttachments.filter(f => !!f.url);
            if (uploadedFiles.length === 0) return null;
            return uploadedFiles.map(f => ({
              filename: f.filename,
              url: f.url,
              size: f.size,
              path: f.path || f.url.split('/').slice(-2).join('/')
            }));
          })(),
          // created_at and updated_at are handled by database defaults
        };
      }

      // Insert into the appropriate table
      
      const { data, error } = await supabase
        .from(tableName)
        .insert([submissionData])
        .select();


      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Submission successful:', data);

      // Files are already uploaded, collect metadata for confirmation display
      // Updated filter to be more inclusive - check for uploadComplete or has url
      const uploadedFiles = formData.fileAttachments?.filter(file => 
        (file.uploadComplete === true) || (file.url && !file.isLocal)
      ) || [];
      console.log('Files successfully included in submission:', uploadedFiles.length);
      console.log('[ServiceRequestForm] Filtered uploadedFiles details:', uploadedFiles);

      // Success! Store submission data and show confirmation page
      // Use secure random ID instead of timestamp
      const referenceNumber = `SR-${generateSecureId(8)}`;
      
      // Debug logging for production
      console.log('[ServiceRequestForm] Setting submissionResult with uploadedFiles:', {
        hasUploadedFiles: !!uploadedFiles,
        uploadedFilesLength: uploadedFiles ? uploadedFiles.length : 0,
        uploadedFiles: uploadedFiles
      });
      
      setSubmissionResult({
        referenceNumber,
        serviceType: serviceSelection.serviceType,
        proceedWork: serviceSelection.proceedWork,
        submittedData: {
          ...formData,
          serviceType: serviceSelection.serviceType,
          proceedWork: serviceSelection.proceedWork
        },
        uploadedFiles: uploadedFiles
      });
      
      setCurrentStep('confirmation');
      
    } catch (error) {
      console.error('Submission error:', error);
      console.error('Error details:', error.message);
      setSubmitMessage({ 
        type: 'error', 
        text: `Error: ${error.message || 'There was an error submitting your request. Please try again.'}` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle new submission from confirmation page
  const handleNewSubmission = () => {
    resetForm();
    setSubmissionResult(null);
  };

  // Reset form
  const resetForm = () => {
    setCurrentStep('selection');
    setServiceSelection({
      serviceType: '',
      proceedWork: ''
    });
    setFormData({
      name: '',
      email: '',
      company: '',
      project: '',
      state: '',
      phone: '',
      revision: '',
      dueDate: '',
      fileFormats: [],
      additionalRequests: [],
      erosionSurfaceDueDate: '',
      advancedUtilities: false,
      structureCount: '',
      cadAvailable: '',
      scopeOptions: [],
      strippingDepth: '',
      replacementDepth: '',
      projectInfo: '',
      specialInstructions: '',
      fileAttachments: []
    });
    setErrors({});
    setSubmitMessage({ type: '', text: '' });
  };

  // Handle back navigation
  const handleBack = () => {
    setCurrentStep('selection');
    setErrors({});
  };

  // Render selection step
  const renderSelectionStep = () => (
    <div className="selection-container">
      <form onSubmit={handleSelectionSubmit}>
        <div className="question-group">
          <p className="question">Do you need a Model or a Takeoff? <span className="required">*</span></p>
          <div className="radio-group">
            <div className="radio-option">
              <input 
                type="radio" 
                id="model" 
                name="serviceType" 
                value="3D Model"
                checked={serviceSelection.serviceType === '3D Model'}
                onChange={(e) => setServiceSelection(prev => ({ ...prev, serviceType: e.target.value }))}
              />
              <label htmlFor="model">3D Model</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="takeoff" 
                name="serviceType" 
                value="Takeoff"
                checked={serviceSelection.serviceType === 'Takeoff'}
                onChange={(e) => setServiceSelection(prev => ({ ...prev, serviceType: e.target.value }))}
              />
              <label htmlFor="takeoff">Takeoff</label>
            </div>
          </div>
          {errors.serviceType && (
            <span className="error-message">{errors.serviceType}</span>
          )}
        </div>

        <div className="question-group">
          <p className="question">Proceed with the work? <span className="required">*</span></p>
          <div className="radio-group">
            <div className="radio-option">
              <input 
                type="radio" 
                id="yes" 
                name="proceedWork" 
                value="Yes"
                checked={serviceSelection.proceedWork === 'Yes'}
                onChange={(e) => setServiceSelection(prev => ({ ...prev, proceedWork: e.target.value }))}
              />
              <label htmlFor="yes">Yes</label>
            </div>
            <div className="radio-option">
              <input 
                type="radio" 
                id="quoteOnly" 
                name="proceedWork" 
                value="Quote Only"
                checked={serviceSelection.proceedWork === 'Quote Only'}
                onChange={(e) => setServiceSelection(prev => ({ ...prev, proceedWork: e.target.value }))}
              />
              <label htmlFor="quoteOnly">Quote Only</label>
            </div>
          </div>
          {errors.proceedWork && (
            <span className="error-message">{errors.proceedWork}</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </form>
    </div>
  );

  // Render Model Request Form
  const renderModelForm = () => (
    <form onSubmit={handleFormSubmit} className="service-form condensed-form">
      <div className="form-header">
        <h2 className="form-title">
          3D Model {serviceSelection.proceedWork === 'Quote Only' ? 'Quote' : 'Request'}
        </h2>
      </div>

      {submitMessage.text && (
        <div className={`submit-message ${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}

      {/* Contact Information Section */}
      <div className="form-section">
        <div className="form-row">
          <label htmlFor="name">Name <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="text"
              id="name"
              placeholder="First and Last"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className={errors.name ? 'error-highlight' : ''}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={errors.email ? 'error-highlight' : ''}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

      </div>

      {/* Project Information Section */}
      <div className="form-section">
        <div className="form-row">
          <label htmlFor="company">Company Name <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="text"
              id="company"
              placeholder="Your Company"
              value={formData.company}
              onChange={(e) => handleFieldChange('company', e.target.value)}
              className={errors.company ? 'error-highlight' : ''}
              required
            />
            {errors.company && <span className="error-message">{errors.company}</span>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="project">Project Name <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="text"
              id="project"
              placeholder="Project Name"
              value={formData.project}
              onChange={(e) => handleFieldChange('project', e.target.value)}
              className={errors.project ? 'error-highlight' : ''}
              required
            />
            {errors.project && <span className="error-message">{errors.project}</span>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="state">Project State <span className="required">*</span></label>
          <div className="input-wrapper">
            <select
              id="state"
              value={formData.state}
              onChange={(e) => handleFieldChange('state', e.target.value)}
              className={errors.state ? 'error-highlight' : ''}
              required
            >
              {states.map(state => (
                <option key={state.value} value={state.value}>{state.label}</option>
              ))}
            </select>
            {errors.state && <span className="error-message">{errors.state}</span>}
          </div>
        </div>
      </div>

      {/* Model Details Section */}
      <div className="form-section">
        <div className="form-row">
          <label>Is this a revision to a current model? <span className="required">*</span></label>
          <div className="input-wrapper">
            <div className="radio-group-inline">
              <div className="radio-item-inline">
                <input
                  type="radio"
                  id="revisionYes"
                  name="revision"
                  value="Yes"
                  checked={formData.revision === 'Yes'}
                  onChange={(e) => handleFieldChange('revision', e.target.value)}
                />
                <label htmlFor="revisionYes">Yes</label>
              </div>
              <div className="radio-item-inline">
                <input
                  type="radio"
                  id="revisionNo"
                  name="revision"
                  value="No"
                  checked={formData.revision === 'No'}
                  onChange={(e) => handleFieldChange('revision', e.target.value)}
                />
                <label htmlFor="revisionNo">No</label>
              </div>
            </div>
            {errors.revision && <span className="error-message">{errors.revision}</span>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="dueDate">Due Date <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              className={errors.dueDate ? 'error-highlight' : ''}
              required
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>
        </div>

        <div className="form-row">
          <label>File Formats <span className="required">*</span></label>
          <div className="input-wrapper">
            <div className="checkbox-group-inline">
              <div className="checkbox-item-inline">
                <input
                  type="checkbox"
                  id="trimble"
                  checked={formData.fileFormats.includes('Trimble')}
                  onChange={() => handleCheckboxChange('fileFormats', 'Trimble')}
                />
                <label htmlFor="trimble">Trimble</label>
              </div>
              <div className="checkbox-item-inline">
                <input
                  type="checkbox"
                  id="topcon"
                  checked={formData.fileFormats.includes('Topcon')}
                  onChange={() => handleCheckboxChange('fileFormats', 'Topcon')}
                />
                <label htmlFor="topcon">Topcon</label>
              </div>
              <div className="checkbox-item-inline">
                <input
                  type="checkbox"
                  id="leica"
                  checked={formData.fileFormats.includes('Leica')}
                  onChange={() => handleCheckboxChange('fileFormats', 'Leica')}
                />
                <label htmlFor="leica">Leica</label>
              </div>
            </div>
            {errors.fileFormats && <span className="error-message">{errors.fileFormats}</span>}
          </div>
        </div>

      </div>

      {/* Additional Requests Section - Centered */}
      <div className="form-section form-section-centered">
        <div className="section-header">Additional Requests</div>
        <div className="checkbox-group-horizontal">
          <div className="checkbox-item-inline">
            <input
              type="checkbox"
              id="erosion"
              checked={formData.additionalRequests.includes('Initial Erosion Surface')}
              onChange={() => handleCheckboxChange('additionalRequests', 'Initial Erosion Surface')}
            />
            <label htmlFor="erosion">Initial Erosion Surface</label>
          </div>
          {formData.additionalRequests.includes('Initial Erosion Surface') && (
            <div className="form-section conditional-section" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <div className="form-row">
                <label htmlFor="erosionSurfaceDueDate">Erosion Surface Date <span className="required">*</span></label>
                <div className="input-wrapper">
                  <input
                    type="date"
                    id="erosionSurfaceDueDate"
                    value={formData.erosionSurfaceDueDate}
                    onChange={(e) => handleFieldChange('erosionSurfaceDueDate', e.target.value)}
                    className={errors.erosionSurfaceDueDate ? 'error-highlight' : ''}
                    required
                  />
                  {errors.erosionSurfaceDueDate && <span className="error-message">{errors.erosionSurfaceDueDate}</span>}
                </div>
              </div>
            </div>
          )}
          <div className="checkbox-item-inline">
            <input
              type="checkbox"
              id="pipe"
              checked={formData.additionalRequests.includes('3D/Elevated Pipe')}
              onChange={() => handleCheckboxChange('additionalRequests', '3D/Elevated Pipe')}
            />
            <label htmlFor="pipe">3D/Elevated Pipe</label>
          </div>
          {formData.additionalRequests.includes('3D/Elevated Pipe') && (
            <div style={{ width: '100%', marginTop: '2px', fontSize: '13px', color: '#666', textAlign: 'center' }}>
              All gravity pipe linework will be elevated by invert elevation.
            </div>
          )}
          {formData.additionalRequests.includes('3D/Elevated Pipe') && (
            <div className="form-section conditional-section" style={{ marginTop: '8px', marginBottom: '8px' }}>
              <div className="form-row">
                <label>Advanced Utilities</label>
                <div className="input-wrapper">
                  <div className="checkbox-item-inline advanced-utilities-checkbox">
                    <input
                      type="checkbox"
                      id="advancedUtilities"
                      checked={formData.advancedUtilities}
                      onChange={(e) => handleFieldChange('advancedUtilities', e.target.checked)}
                    />
                    <label htmlFor="advancedUtilities" style={{ marginLeft: '8px', fontSize: '13px', color: '#666' }}>
                      $30/structure modeled from shop drawings. Please enter total number of structures to be included.
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Show structure count input when Advanced Utilities is checked */}
              {formData.advancedUtilities && (
                <div className="form-row">
                  <label htmlFor="structureCount">Number of Structures</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      id="structureCount"
                      value={formData.structureCount}
                      onChange={(e) => handleFieldChange('structureCount', e.target.value)}
                      placeholder="Enter number of structures"
                      min="1"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="checkbox-item-inline">
            <input
              type="checkbox"
              id="linework"
              checked={formData.additionalRequests.includes('Linework Only')}
              onChange={() => handleCheckboxChange('additionalRequests', 'Linework Only')}
            />
            <label htmlFor="linework">Linework Only</label>
          </div>
          {formData.additionalRequests.includes('Linework Only') && (
            <div style={{ width: '100%', marginTop: '2px', fontSize: '13px', color: '#dc2626', fontWeight: '500', textAlign: 'center' }}>
              Caution: No surface will be generated when this option is checked. There will be no cut/fill values.
            </div>
          )}
        </div>
      </div>


      {/* Additional Information Section */}
      <div className="form-section form-section-centered">
        <div className="section-header">Additional Info</div>
        <textarea
          id="specialInstructions"
          placeholder="Please provide any additional project information, specific requirements, or other requests..."
          value={formData.specialInstructions}
          onChange={(e) => handleFieldChange('specialInstructions', e.target.value)}
          rows="3"
          style={{ width: '100%' }}
        />
      </div>

      {/* File Upload Section */}
      <div className="form-section form-section-centered file-upload-section">
        <div className="section-header">Upload Files</div>
        <FileUploadWithFolders
          files={formData.fileAttachments || []}
          onFilesChange={(files) => handleFieldChange('fileAttachments', files)}
          disabled={isSubmitting}
          maxFiles={100}
          formType={serviceSelection.serviceType === '3D Model' ? 
            (serviceSelection.proceedWork === 'Quote Only' ? '3d-quote' : '3d-request') :
            (serviceSelection.proceedWork === 'Quote Only' ? 'takeoff-quote' : 'takeoff-request')
          }
          companyName={formData.company || 'Unknown Company'}
          projectName={formData.project || 'Unknown Project'}
        />
      </div>

      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          Back
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
      {Object.keys(errors).length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '10px', color: '#dc3545', fontSize: '14px' }}>
          Please fill out required areas
        </div>
      )}
    </form>
  );

  // Render Takeoff Request Form
  const renderTakeoffForm = () => (
    <form onSubmit={handleFormSubmit} className="service-form condensed-form">
      <div className="form-header">
        <h2 className="form-title">
          Takeoff {serviceSelection.proceedWork === 'Quote Only' ? 'Quote' : 'Request'}
        </h2>
      </div>

      {submitMessage.text && (
        <div className={`submit-message ${submitMessage.type}`}>
          {submitMessage.text}
        </div>
      )}

      {/* Contact Information Section */}
      <div className="form-section">
        <div className="form-row">
          <label htmlFor="name">Name <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="text"
              id="name"
              placeholder="First and Last"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className={errors.name ? 'error-highlight' : ''}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
        </div>


        <div className="form-row">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={errors.email ? 'error-highlight' : ''}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="company">Company Name <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="text"
              id="company"
              placeholder="Your Company"
              value={formData.company}
              onChange={(e) => handleFieldChange('company', e.target.value)}
              className={errors.company ? 'error-highlight' : ''}
              required
            />
            {errors.company && <span className="error-message">{errors.company}</span>}
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="form-section">
        <div className="form-row">
          <label htmlFor="project">Project Name <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="text"
              id="project"
              placeholder="Project Name"
              value={formData.project}
              onChange={(e) => handleFieldChange('project', e.target.value)}
              className={errors.project ? 'error-highlight' : ''}
              required
            />
            {errors.project && <span className="error-message">{errors.project}</span>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="dueDate">Due Date <span className="required">*</span></label>
          <div className="input-wrapper">
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              className={errors.dueDate ? 'error-highlight' : ''}
              required
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>
        </div>

        <div className="form-row">
          <label>CAD Files Available? <span className="required">*</span></label>
          <div className="input-wrapper">
            <div className="radio-group-inline">
              <div className="radio-item-inline">
                <input
                  type="radio"
                  id="cadYes"
                  name="cadAvailable"
                  value="Yes"
                  checked={formData.cadAvailable === 'Yes'}
                  onChange={(e) => handleFieldChange('cadAvailable', e.target.value)}
                />
                <label htmlFor="cadYes">Yes</label>
              </div>
              <div className="radio-item-inline">
                <input
                  type="radio"
                  id="cadNo"
                  name="cadAvailable"
                  value="No"
                  checked={formData.cadAvailable === 'No'}
                  onChange={(e) => handleFieldChange('cadAvailable', e.target.value)}
                />
                <label htmlFor="cadNo">No</label>
              </div>
            </div>
            {errors.cadAvailable && <span className="error-message">{errors.cadAvailable}</span>}
          </div>
        </div>
      </div>

      {/* Scope Options Section */}
      <div className="form-section">
        <div className="form-row">
          <label>Scope Options <span className="required">*</span></label>
          <div className="input-wrapper">
            <div className="checkbox-group-inline" style={{ flexDirection: 'column', gap: '12px' }}>
              <div className="checkbox-item-inline">
                <input
                  type="checkbox"
                  id="earthworkCutFill"
                  checked={formData.scopeOptions?.includes('Earthwork Cut/Fill')}
                  onChange={() => handleCheckboxChange('scopeOptions', 'Earthwork Cut/Fill')}
                />
                <label htmlFor="earthworkCutFill">Earthwork Cut/Fill</label>
              </div>
              <div className="checkbox-item-inline">
                <input
                  type="checkbox"
                  id="utilities"
                  checked={formData.scopeOptions?.includes('Utilities (length/count and trench excavation)')}
                  onChange={() => handleCheckboxChange('scopeOptions', 'Utilities (length/count and trench excavation)')}
                />
                <label htmlFor="utilities">Utilities (length/count and trench excavation)</label>
              </div>
              <div className="checkbox-item-inline">
                <input
                  type="checkbox"
                  id="subgrade"
                  checked={formData.scopeOptions?.includes('Subgrade Materials (stone, curb, asphalt, concrete, ect.)')}
                  onChange={() => handleCheckboxChange('scopeOptions', 'Subgrade Materials (stone, curb, asphalt, concrete, ect.)')}
                />
                <label htmlFor="subgrade">Subgrade Materials (stone, curb, asphalt, concrete, ect.)</label>
              </div>
              <div className="checkbox-item-inline">
                <input
                  type="checkbox"
                  id="erosion"
                  checked={formData.scopeOptions?.includes('Erosion Control (silt fence, matting, safety fence, baffles, ect.)')}
                  onChange={() => handleCheckboxChange('scopeOptions', 'Erosion Control (silt fence, matting, safety fence, baffles, ect.)')}
                />
                <label htmlFor="erosion">Erosion Control (silt fence, matting, safety fence, baffles, ect.)</label>
              </div>
            </div>
            {errors.scopeOptions && <span className="error-message">{errors.scopeOptions}</span>}
          </div>
        </div>
      </div>

      {/* Conditional earthwork depth fields */}
      {formData.scopeOptions?.includes('Earthwork Cut/Fill') && (
        <div className="form-section conditional-section">
          <div className="form-row">
            <label htmlFor="strippingDepth" style={{ fontSize: '13px' }}>Stripping Depth <span className="required">*</span></label>
            <div className="input-wrapper">
              <input
                type="text"
                id="strippingDepth"
                placeholder="e.g., 6 inches, 0.5 feet"
                value={formData.strippingDepth || ''}
                onChange={(e) => handleFieldChange('strippingDepth', e.target.value)}
                className={errors.strippingDepth ? 'error-highlight' : ''}
              />
              {errors.strippingDepth && <span className="error-message">{errors.strippingDepth}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <label htmlFor="replacementDepth" style={{ fontSize: '13px' }}>Replacement Depth <span className="required">*</span></label>
            <div className="input-wrapper">
              <input
                type="text"
                id="replacementDepth"
                placeholder="e.g., 6 inches, 0.5 feet"
                value={formData.replacementDepth || ''}
                onChange={(e) => handleFieldChange('replacementDepth', e.target.value)}
                className={errors.replacementDepth ? 'error-highlight' : ''}
              />
              {errors.replacementDepth && <span className="error-message">{errors.replacementDepth}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Additional Information Section */}
      <div className="form-section form-section-centered">
        <div className="section-header">Additional Info</div>
        <textarea
          id="projectInfo"
          placeholder="Please provide any additional project information, specific requirements, or scope details..."
          value={formData.projectInfo || ''}
          onChange={(e) => handleFieldChange('projectInfo', e.target.value)}
          rows="3"
          style={{ width: '100%' }}
        />
      </div>

      {/* File Upload Section */}
      <div className="form-section form-section-centered file-upload-section">
        <div className="section-header">Upload Files</div>
        <FileUploadWithFolders
          files={formData.fileAttachments || []}
          onFilesChange={(files) => handleFieldChange('fileAttachments', files)}
          disabled={isSubmitting}
          maxFiles={100}
          formType={serviceSelection.serviceType === '3D Model' ? 
            (serviceSelection.proceedWork === 'Quote Only' ? '3d-quote' : '3d-request') :
            (serviceSelection.proceedWork === 'Quote Only' ? 'takeoff-quote' : 'takeoff-request')
          }
          companyName={formData.company || 'Unknown Company'}
          projectName={formData.project || 'Unknown Project'}
        />
      </div>

      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          Back
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
      {Object.keys(errors).length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '10px', color: '#dc3545', fontSize: '14px' }}>
          Please fill out required areas
        </div>
      )}
    </form>
  );

  // Render confirmation page
  const renderConfirmation = () => {
    if (!submissionResult) return null;
    
    const title = submissionResult.proceedWork === 'Quote Only'
      ? 'Quote Request Received!'
      : 'Service Request Submitted!';
      
    const message = `Thank you for submitting your ${submissionResult.serviceType} ${submissionResult.proceedWork === 'Quote Only' ? 'quote request' : 'service request'}. We will contact you soon.`;
    
    return (
      <ConfirmationPage
        title={title}
        message={message}
        referenceNumber={submissionResult.referenceNumber}
        submissionData={submissionResult.submittedData}
        uploadedFiles={submissionResult.uploadedFiles}
        showDetails={true}
        onNewSubmission={handleNewSubmission}
      />
    );
  };

  // Main render
  return (
    <AutoResizeWrapper padding={40}>
      <div className="service-request-container">
        {currentStep === 'selection' && renderSelectionStep()}
        {currentStep === 'form' && serviceSelection.serviceType === '3D Model' && renderModelForm()}
        {currentStep === 'form' && serviceSelection.serviceType === 'Takeoff' && renderTakeoffForm()}
        {currentStep === 'confirmation' && renderConfirmation()}
      </div>
    </AutoResizeWrapper>
  );
};

export default ServiceRequestForm;