import React, { useState, useRef, useEffect } from 'react';
import SupabaseStorageService from '../../services/supabaseStorageService';
import './FileUpload.css';

const FileUpload = ({
  files = [],
  onFilesChange,
  formType,
  companyName,
  projectName,
  disabled = false,
  maxFiles = 10
}) => {
  const [selectedFiles, setSelectedFiles] = useState(files);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Update local state when props change
  useEffect(() => {
    setSelectedFiles(files);
  }, [files]);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Process selected files
  const handleFiles = async (newFiles) => {
    const fileArray = Array.from(newFiles);
    
    // Check max files limit
    if (selectedFiles.length + fileArray.length > maxFiles) {
      setErrors([`Maximum ${maxFiles} files allowed`]);
      return;
    }

    // Validate files
    const validationErrors = [];
    const validFiles = [];
    
    fileArray.forEach(file => {
      const validation = SupabaseStorageService.validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        validationErrors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    }

    if (validFiles.length === 0) return;

    // Upload files
    setUploading(true);
    setErrors([]);
    
    try {
      const result = await SupabaseStorageService.uploadMultipleFiles(
        validFiles,
        formType,
        companyName,
        projectName
      );

      // Add successful uploads to selected files
      const newSelectedFiles = [...selectedFiles, ...result.successful];
      setSelectedFiles(newSelectedFiles);
      
      // Call parent callback
      if (onFilesChange) {
        onFilesChange(newSelectedFiles);
      }

      // Show failed uploads as errors
      if (result.failed.length > 0) {
        const failedErrors = result.failed.map(f => `${f.filename}: ${f.error}`);
        setErrors(failedErrors);
      }


    } catch (error) {
      console.error('Upload error:', error);
      setErrors([error.message || 'Upload failed']);
    } finally {
      setUploading(false);
    }
  };

  // Remove file from list (doesn't delete from storage)
  const removeFile = (fileId) => {
    const newFiles = selectedFiles.filter(f => f.id !== fileId);
    setSelectedFiles(newFiles);
    
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    if (fileType.includes('dwg') || fileType.includes('dxf')) return '📐';
    if (fileType.includes('sheet')) return '📊';
    return '📎';
  };

  return (
    <div className="file-upload-component">
      {/* Drop zone */}
      <div
        className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        
        <p className="upload-text">
          Drag and drop files here or click to browse
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.dwg,.dxf,.zip,.rar,.jpg,.jpeg,.png,.gif,.webp,.xls,.xlsx"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          style={{ display: 'none' }}
        />
        
        <button
          type="button"
          className="btn-upload"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
        >
          Select Files
        </button>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="upload-errors">
          {errors.map((error, index) => (
            <div key={index} className="error-item">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="selected-files has-files">
          <h4>Uploaded Files ({selectedFiles.length}/{maxFiles})</h4>
          {selectedFiles.map(file => (
            <div key={file.id} className="file-item">
              <div className="file-info">
                <span className="file-icon">{getFileIcon(file.type)}</span>
                <span className="file-name">{file.filename}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
              
              <div className="file-actions">
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="file-link"
                  title="View file"
                >
                  👁️
                </a>
                <button
                  type="button"
                  className="file-remove"
                  onClick={() => removeFile(file.id)}
                  disabled={uploading}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;