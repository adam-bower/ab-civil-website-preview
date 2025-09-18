import React, { useState } from 'react';
import './ConfirmationPage.css';

const ConfirmationPage = ({ 
  title = "Thank You!", 
  message = "Your submission has been received.",
  submissionData = null,
  showDetails = false,
  onNewSubmission = null,
  customContent = null,
  referenceNumber = null,
  estimatedResponseTime = null,
  uploadedFiles = null
}) => {
  // Debug logging for production
  console.log('[ConfirmationPage] Props received:', {
    hasUploadedFiles: !!uploadedFiles,
    uploadedFilesLength: uploadedFiles ? uploadedFiles.length : 0,
    uploadedFiles: uploadedFiles
  });
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    if (Array.isArray(value)) {
      // Check if array contains objects (like contacts)
      if (value.length > 0 && typeof value[0] === 'object') {
        return 'See details below';
      }
      return value.length > 0 ? value.join(', ') : 'None selected';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file type info based on filename
  const getFileTypeInfo = (filename) => {
    if (!filename) return { label: 'FILE', className: 'file-type-default' };
    const ext = filename.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(ext)) return { label: 'PDF', className: 'file-type-pdf' };
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return { label: 'IMG', className: 'file-type-image' };
    if (['zip', 'rar', '7z'].includes(ext)) return { label: 'ZIP', className: 'file-type-archive' };
    if (['dwg', 'dxf', 'dwf'].includes(ext)) return { label: 'CAD', className: 'file-type-cad' };
    if (['xls', 'xlsx', 'xlsm'].includes(ext)) return { label: 'XLS', className: 'file-type-excel' };
    if (['txt', 'csv'].includes(ext)) return { label: 'TXT', className: 'file-type-text' };
    if (['rvt', 'rfa', 'ifc'].includes(ext)) return { label: 'BIM', className: 'file-type-bim' };
    return { label: 'FILE', className: 'file-type-default' };
  };

  // Organize files by folder structure
  const organizeFilesByFolder = (files) => {
    const folderStructure = {};
    
    files.forEach(file => {
      // Get the folder path from the file
      const folderPath = file.folder || (file.relativePath ? 
        file.relativePath.substring(0, file.relativePath.lastIndexOf('/')) : 
        '');
      
      // If no folder, put in root
      const folder = folderPath || 'root';
      
      if (!folderStructure[folder]) {
        folderStructure[folder] = [];
      }
      
      folderStructure[folder].push(file);
    });
    
    return folderStructure;
  };

  const UploadedFilesSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedFolders, setExpandedFolders] = useState({});
    
    const folderStructure = organizeFilesByFolder(uploadedFiles);
    const folderNames = Object.keys(folderStructure).sort((a, b) => {
      if (a === 'root') return -1;
      if (b === 'root') return 1;
      return a.localeCompare(b);
    });
    
    const toggleExpanded = () => {
      setIsExpanded(!isExpanded);
    };
    
    const toggleFolder = (folderName) => {
      setExpandedFolders(prev => ({
        ...prev,
        [folderName]: !prev[folderName]
      }));
    };
    
    // Count total files
    const totalFiles = uploadedFiles.length;
    const totalFolders = folderNames.filter(name => name !== 'root').length;
    
    return (
      <div className="confirmation-files-section">
        <div 
          className="confirmation-files-header clickable"
          onClick={toggleExpanded}
        >
          <svg 
            className={`confirmation-chevron ${isExpanded ? 'expanded' : ''}`}
            width="20" 
            height="20" 
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 8l4 4 4-4" />
          </svg>
          <h2 className="confirmation-files-title">
            Uploaded Files 
            <span className="files-summary">
              ({totalFiles} {totalFiles === 1 ? 'file' : 'files'}{totalFolders > 0 ? ` in ${totalFolders} ${totalFolders === 1 ? 'folder' : 'folders'}` : ''})
            </span>
          </h2>
        </div>
        
        {isExpanded && (
          <div className="confirmation-files-content">
            <div className="confirmation-folders-list">
              {folderNames.map(folderName => {
                const isFolder = folderName !== 'root';
                const isFolderExpanded = expandedFolders[folderName] !== false;
                const files = folderStructure[folderName];
                
                return (
                  <div key={folderName} className={isFolder ? "folder-group" : "root-files"}>
                    {isFolder ? (
                      <>
                        <div className="folder-header">
                          <svg 
                            className="folder-icon"
                            width="15" 
                            height="15" 
                            viewBox="0 0 16 16" 
                            fill="currentColor"
                          >
                            <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3z"/>
                          </svg>
                          <span className="folder-name">{folderName}</span>
                          <span className="folder-file-count">({files.length} files)</span>
                        </div>
                        {files.map((file, index) => {
                          const fileType = getFileTypeInfo(file.filename || file.name);
                          return (
                            <div key={index} className="file-item compact" style={{ marginLeft: '20px', borderLeft: '1px dashed #d1d5db' }}>
                              <div className="file-info">
                                <span className={`file-type-badge ${fileType.className}`}>
                                  {fileType.label}
                                </span>
                                <span className="file-name">{file.filename || file.name}</span>
                                <span className="file-size">{formatFileSize(file.size)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      files.map((file, index) => {
                        const fileType = getFileTypeInfo(file.filename || file.name);
                        return (
                          <div key={index} className="file-item compact">
                            <div className="file-info">
                              <span className={`file-type-badge ${fileType.className}`}>
                                {fileType.label}
                              </span>
                              <span className="file-name">{file.filename || file.name}</span>
                              <span className="file-size">{formatFileSize(file.size)}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const SubmissionDetails = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [expandedSections, setExpandedSections] = useState({});
    
    React.useEffect(() => {
      // Initialize all sections as expanded
      if (submissionData) {
        const initialExpanded = {};
        Object.keys(submissionData).forEach(key => {
          if (typeof submissionData[key] === 'object' && submissionData[key] !== null) {
            initialExpanded[key] = true;
          }
        });
        setExpandedSections(initialExpanded);
      }
    }, []);
    
    const toggleMainDetails = () => {
      setIsExpanded(!isExpanded);
    };
    
    const toggleSection = (sectionKey) => {
      setExpandedSections(prev => ({
        ...prev,
        [sectionKey]: !prev[sectionKey]
      }));
    };

    const renderValue = (key, value) => {
      // Skip fields that are N/A, null, undefined, or empty
      const shouldSkipField = (fieldKey, fieldValue) => {
        // Fields to skip for all forms
        const alwaysSkipFields = ['platform', 'platform_other', 'dealer_name', 'contractor_name', 'other_source_detail', 'fileAttachments', 'phone', 'state'];
        
        // Takeoff-specific fields to skip when serviceType is "3D Model"
        const takeoffFields = ['cadAvailable', 'scopeOptions', 'strippingDepth', 'replacementDepth'];
        
        // Model-specific fields to skip when serviceType is "Takeoff"
        const modelFields = ['revision', 'fileFormats', 'additionalRequests', 'erosionSurfaceDueDate', 'advancedUtilities', 'structureCount'];
        
        // Skip if it's an always-skip field (regardless of value for fileAttachments)
        if (alwaysSkipFields.includes(fieldKey)) {
          return true;
        }
        
        // Skip takeoff fields for 3D Model forms
        if (submissionData?.serviceType === '3D Model' && takeoffFields.includes(fieldKey)) {
          return true;
        }
        
        // Skip model fields for Takeoff forms
        if (submissionData?.serviceType === 'Takeoff' && modelFields.includes(fieldKey)) {
          return true;
        }
        
        // Skip conditional fields that weren't selected/enabled
        // Hide erosion surface due date if Initial Erosion Surface wasn't selected
        if (fieldKey === 'erosionSurfaceDueDate' && 
            (!submissionData?.additionalRequests?.includes('Initial Erosion Surface') || !fieldValue)) {
          return true;
        }
        
        // Hide advanced utilities if 3D/Elevated Pipe wasn't selected OR if advanced utilities checkbox wasn't checked
        if (fieldKey === 'advancedUtilities' && 
            (!submissionData?.additionalRequests?.includes('3D/Elevated Pipe') || !fieldValue)) {
          return true;
        }
        
        // Hide structure count if 3D/Elevated Pipe wasn't selected OR advanced utilities isn't enabled or has no value
        if (fieldKey === 'structureCount' && 
            (!submissionData?.additionalRequests?.includes('3D/Elevated Pipe') || !submissionData?.advancedUtilities || !fieldValue)) {
          return true;
        }
        
        // Hide project info and special instructions if empty
        if ((fieldKey === 'projectInfo' || fieldKey === 'specialInstructions') && 
            (!fieldValue || fieldValue === null || fieldValue === undefined || fieldValue === '')) {
          return true;
        }
        
        return false;
      };

      // Don't render if this field should be skipped
      if (shouldSkipField(key, value)) {
        return null;
      }

      // Handle arrays of objects (like contacts)
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const sectionExpanded = expandedSections[key] !== false;
        return (
          <div key={key} className="confirmation-section">
            <div 
              className="confirmation-section-header clickable"
              onClick={() => toggleSection(key)}
            >
              <svg 
                className={`confirmation-dropdown-arrow ${sectionExpanded ? 'expanded' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M3 5l3 3 3-3z"/>
              </svg>
              <h3 className="confirmation-section-title">{formatFieldName(key)} ({value.length})</h3>
            </div>
            {sectionExpanded && (
              <div className="confirmation-section-body">
                {value.map((item, index) => (
                  <div key={index} className="confirmation-section-content" style={{ marginBottom: '15px' }}>
                    <h4 style={{ margin: '10px 0 5px 0' }}>{formatFieldName(key).slice(0, -1)} {index + 1}</h4>
                    {Object.entries(item)
                      .filter(([subKey, subValue]) => !shouldSkipField(subKey, subValue))
                      .map(([subKey, subValue]) => (
                        <div key={subKey} className="confirmation-detail-row">
                          <span className="confirmation-detail-label">{formatFieldName(subKey)}:</span>
                          <span className="confirmation-detail-value">{formatValue(subValue)}</span>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      
      // Handle single objects
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        const filteredEntries = Object.entries(value)
          .filter(([subKey, subValue]) => !shouldSkipField(subKey, subValue));
        
        // Don't render empty sections
        if (filteredEntries.length === 0) return null;
        
        const sectionExpanded = expandedSections[key] !== false;
        
        return (
          <div key={key} className="confirmation-section">
            <div 
              className="confirmation-section-header clickable"
              onClick={() => toggleSection(key)}
            >
              <svg 
                className={`confirmation-dropdown-arrow ${sectionExpanded ? 'expanded' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M3 5l3 3 3-3z"/>
              </svg>
              <h3 className="confirmation-section-title">{formatFieldName(key)}</h3>
            </div>
            {sectionExpanded && (
              <div className="confirmation-section-body">
                <div className="confirmation-section-content">
                  {filteredEntries.map(([subKey, subValue]) => (
                    <div key={subKey} className="confirmation-detail-row">
                      <span className="confirmation-detail-label">{formatFieldName(subKey)}:</span>
                      <span className="confirmation-detail-value">{formatValue(subValue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      return (
        <div key={key} className="confirmation-detail-row">
          <span className="confirmation-detail-label">{formatFieldName(key)}:</span>
          <span className="confirmation-detail-value">{formatValue(value)}</span>
        </div>
      );
    };

    if (!submissionData || !showDetails) return null;
    
    return (
      <div className="confirmation-details">
        <div 
          className="confirmation-details-header"
          onClick={toggleMainDetails}
        >
          <svg 
            className={`confirmation-dropdown-arrow ${isExpanded ? 'expanded' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M4 6l4 4 4-4z"/>
          </svg>
          <h2 className="confirmation-details-title">Submission Details</h2>
        </div>
        {isExpanded && (
          <div className="confirmation-details-content">
            {Object.entries(submissionData).map(([key, value]) => renderValue(key, value))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="checkmark-icon"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="confirmation-title">{title}</h1>
        <p className="confirmation-message">{message}</p>



        {customContent && (
          <div className="confirmation-custom-content">
            {customContent}
          </div>
        )}

        {submissionData && showDetails && <SubmissionDetails />}

        {/* File Upload Preview Section */}
        {uploadedFiles && uploadedFiles.length > 0 ? (
          <UploadedFilesSection />
        ) : (
          console.log('[ConfirmationPage] No uploaded files to display')
        )}

        <div className="confirmation-footer">
          <p>If you have any questions, please contact us at support@ab-civil.com</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;