import React, { useState, useRef, useEffect } from 'react';
import SupabaseStorageService from '../../services/supabaseStorageService';
import './FileUpload.css';

const FileUploadWithFolders = ({
  files = [],
  onFilesChange,
  disabled = false,
  maxFiles = 100,  // Increased default for folder uploads
  formType = 'service-request',  // New prop for upload path
  companyName = 'Unknown Company',  // New prop for upload path
  projectName = 'Unknown Project',  // New prop for upload path
  userId = null  // Optional user ID for RLS policies
}) => {
  const [selectedFiles, setSelectedFiles] = useState(files);
  const [errors, setErrors] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const [folderStructure, setFolderStructure] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState(new Set()); // Track uploading files
  const [uploadingPaths, setUploadingPaths] = useState({}); // Track file paths being uploaded for deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Track which file to confirm deletion
  const [retryingFiles, setRetryingFiles] = useState(new Set()); // Track files being retried
  const [uploadProgress, setUploadProgress] = useState({}); // Track upload progress for each file
  const [uploadControllers, setUploadControllers] = useState({}); // Track AbortControllers for cancellation
  const [sessionId] = useState(() => crypto.randomUUID()); // Generate unique session ID for this form instance

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
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const items = e.dataTransfer.items;
    const files = [];
    
    // Check if we have items (could be folders)
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            if (entry.isDirectory) {
              // Handle folder drop
              const folderFiles = await readDirectory(entry);
              files.push(...folderFiles);
            } else {
              // Handle file drop
              const file = item.getAsFile();
              if (file) {
                files.push({ file, relativePath: file.name });
              }
            }
          }
        }
      }
    }
    
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  // Recursively read directory contents
  const readDirectory = async (directoryEntry, path = '') => {
    const files = [];
    const reader = directoryEntry.createReader();
    
    return new Promise((resolve) => {
      const readEntries = () => {
        reader.readEntries(async (entries) => {
          if (entries.length === 0) {
            resolve(files);
          } else {
            for (const entry of entries) {
              const entryPath = path ? `${path}/${entry.name}` : entry.name;
              
              if (entry.isDirectory) {
                const subFiles = await readDirectory(entry, entryPath);
                files.push(...subFiles);
              } else {
                const file = await new Promise((resolveFile) => {
                  entry.file((file) => {
                    resolveFile({ 
                      file, 
                      relativePath: `${directoryEntry.name}/${entryPath}` 
                    });
                  });
                });
                files.push(file);
              }
            }
            readEntries(); // Continue reading
          }
        });
      };
      readEntries();
    });
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const filesArray = Array.from(fileList).map(file => ({
        file,
        relativePath: file.webkitRelativePath || file.name
      }));
      handleFiles(filesArray);
    }
  };

  // Handle folder selection
  const handleFolderSelect = (e) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const filesArray = Array.from(fileList).map(file => ({
        file,
        relativePath: file.webkitRelativePath || file.name
      }));
      handleFiles(filesArray);
    }
  };

  // Process selected files and immediately upload to Supabase
  const handleFiles = async (newFiles) => {
    // Check max files limit
    if (selectedFiles.length + newFiles.length > maxFiles) {
      setErrors([`Maximum ${maxFiles} files allowed`]);
      return;
    }

    // Validate files first
    const validationErrors = [];
    const validFilesToUpload = [];
    
    newFiles.forEach(({ file, relativePath }) => {
      const validation = SupabaseStorageService.validateFile(file);
      if (validation.isValid) {
        validFilesToUpload.push({ file, relativePath });
      } else {
        validationErrors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    }

    if (validFilesToUpload.length === 0) return;

    // Create all file data objects first
    const newFileDataArray = validFilesToUpload.map(({ file, relativePath }) => {
      const fileId = crypto.randomUUID();
      
      return {
        id: fileId,
        file: file,
        filename: file.name,
        size: file.size,
        type: file.type,
        relativePath: relativePath,
        isLocal: true,
        isUploading: true,
        url: null,
        progress: 0
      };
    });

    // Update state once with all new files
    const updatedFiles = [...selectedFiles, ...newFileDataArray];
    setSelectedFiles(updatedFiles);
    
    // Update folder structure once
    const structure = { ...folderStructure };
    newFileDataArray.forEach(fileData => {
      const parts = fileData.relativePath.split('/');
      let current = structure;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = fileData;
    });
    setFolderStructure(structure);

    // Update uploading trackers
    setUploadingFiles(prev => {
      const newSet = new Set(prev);
      newFileDataArray.forEach(fileData => newSet.add(fileData.id));
      return newSet;
    });
    

    // Call parent callback once with all updated files
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }

    // Start uploading files
    newFileDataArray.forEach(async (fileData) => {
      try {
        console.log('Starting upload for:', fileData.filename, 'formType:', formType, 'company:', companyName, 'project:', projectName);
        
        // Generate the file path that will be used for upload (for deletion purposes)
        const expectedPath = SupabaseStorageService.generateFilePath(
          formType, 
          companyName, 
          projectName, 
          fileData.filename, 
          fileData.relativePath,
          null,
          true // preserve exact folder structure
        );
        
        // Track the path for this file
        setUploadingPaths(prev => ({ ...prev, [fileData.id]: expectedPath }));
        
        // Initialize progress
        setUploadProgress(prev => ({ ...prev, [fileData.id]: 0 }));
        
        // Create AbortController for this upload
        const controller = new AbortController();
        setUploadControllers(prev => ({ ...prev, [fileData.id]: controller }));
        
        // Add timeout to prevent hanging uploads
        const uploadPromise = SupabaseStorageService.uploadFile(
          fileData.file,
          formType,
          companyName,
          projectName,
          (progress) => {
            // Update progress state
            setUploadProgress(prev => ({ ...prev, [fileData.id]: progress }));
          },
          fileData.relativePath,
          null, // uploadSessionId (deprecated)
          controller.signal, // AbortSignal for cancellation
          sessionId, // Session ID for security tracking
          userId // User ID for RLS policies
        );
        
        const uploadResult = await uploadPromise;
        
        console.log('Upload completed for:', fileData.filename, uploadResult);

        // Upload successful - update file data
        setSelectedFiles(prev => {
          const updatedFiles = prev.map(f => 
            f.id === fileData.id ? { 
              ...f, 
              isUploading: false, 
              url: uploadResult.url,
              path: uploadResult.path,
              uploadDate: uploadResult.uploadDate,
              session_id: uploadResult.session_id, // Include session_id for security
              user_id: uploadResult.user_id, // Include user_id for RLS policies
              isLocal: false,
              uploadComplete: true
            } : f
          );
          
          // Defer callback to avoid the warning
          setTimeout(() => {
            if (onFilesChange) {
              onFilesChange(updatedFiles);
            }
          }, 0);
          
          return updatedFiles;
        })

        // Remove from uploading trackers
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileData.id);
          return newSet;
        });

        setUploadingPaths(prev => {
          const newPaths = { ...prev };
          delete newPaths[fileData.id];
          return newPaths;
        });
        
        // Keep progress at 100% for completed uploads
        setUploadProgress(prev => ({ ...prev, [fileData.id]: 100 }));
        
        // Clear the AbortController
        setUploadControllers(prev => {
          const newControllers = { ...prev };
          delete newControllers[fileData.id];
          return newControllers;
        });

      } catch (error) {
        // Check if it was an abort error
        if (error.name === 'AbortError') {
          console.log('Upload was cancelled:', fileData.filename);
          // Update file state to show cancellation
          setSelectedFiles(prev => {
            const cancelledFiles = prev.map(f => 
              f.id === fileData.id ? { ...f, isUploading: false, uploadError: 'Cancelled' } : f
            );
            
            setTimeout(() => {
              if (onFilesChange) {
                onFilesChange(cancelledFiles);
              }
            }, 0);
            
            return cancelledFiles;
          })
        } else {
          console.error('Upload failed:', error);
          // Update file with error state
          setSelectedFiles(prev => {
            const errorFiles = prev.map(f => 
              f.id === fileData.id ? { ...f, isUploading: false, uploadError: error.message } : f
            );
            
            setTimeout(() => {
              if (onFilesChange) {
                onFilesChange(errorFiles);
              }
            }, 0);
            
            return errorFiles;
          })
        }

        // Remove from uploading trackers
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileData.id);
          return newSet;
        });

        setUploadingPaths(prev => {
          const newPaths = { ...prev };
          delete newPaths[fileData.id];
          return newPaths;
        });
        
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileData.id];
          return newProgress;
        });
        
        // Clear the AbortController
        setUploadControllers(prev => {
          const newControllers = { ...prev };
          delete newControllers[fileData.id];
          return newControllers;
        });

        if (error.name !== 'AbortError') {
          setErrors(prev => [...prev, `Upload failed for ${fileData.filename}: ${error.message}`]);
        }
      }
    });

    setErrors(validationErrors); // Only show validation errors, upload errors are handled above
  };

  // Handle delete confirmation
  const handleDeleteClick = (fileId) => {
    const fileToRemove = selectedFiles.find(f => f.id === fileId);
    if (!fileToRemove) return;
    
    // For uploading files, delete immediately (cancel)
    if (uploadingFiles.has(fileId)) {
      removeFile(fileId);
      return;
    }
    
    // For uploaded files, show confirmation dialog
    if (!fileToRemove.isLocal || fileToRemove.url) {
      setShowDeleteConfirm(fileId);
    } else {
      // For local files not yet uploaded, delete immediately
      removeFile(fileId);
    }
  };

  // Confirm deletion
  const confirmDelete = async (fileId) => {
    setShowDeleteConfirm(null);
    await removeFile(fileId);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Retry failed upload
  const retryUpload = async (fileId) => {
    const fileToRetry = selectedFiles.find(f => f.id === fileId);
    if (!fileToRetry || !fileToRetry.uploadError || !fileToRetry.file) return;

    // Clear error and start retry
    setSelectedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, uploadError: null, isUploading: true } : f
    ));
    
    setRetryingFiles(prev => new Set([...prev, fileId]));
    setUploadingFiles(prev => new Set([...prev, fileId]));

    try {
      console.log('Retrying upload for:', fileToRetry.filename);
      
      // Generate the file path
      const expectedPath = SupabaseStorageService.generateFilePath(
        formType, 
        companyName, 
        projectName, 
        fileToRetry.filename, 
        fileToRetry.relativePath,
        null,
        true // preserve exact folder structure
      );
      
      // Track the path for deletion
      setUploadingPaths(prev => ({ ...prev, [fileId]: expectedPath }));
      
      // Initialize progress for retry
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      // Create new AbortController for retry
      const controller = new AbortController();
      setUploadControllers(prev => ({ ...prev, [fileId]: controller }));
      
      const uploadResult = await SupabaseStorageService.uploadFile(
        fileToRetry.file,
        formType,
        companyName,
        projectName,
        (progress) => {
          // Update progress state
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        },
        fileToRetry.relativePath,
        null, // uploadSessionId (deprecated)
        controller.signal, // AbortSignal for cancellation
        sessionId, // Session ID for security tracking
        userId // User ID for RLS policies
      );

      console.log('Retry completed for:', fileToRetry.filename, uploadResult);

      // Update with success
      setSelectedFiles(prev => {
        const retrySuccessFiles = prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            isUploading: false, 
            url: uploadResult.url,
            path: uploadResult.path,
            uploadDate: uploadResult.uploadDate,
            session_id: uploadResult.session_id, // Include session_id for security
            user_id: uploadResult.user_id, // Include user_id for RLS policies
            isLocal: false,
            uploadComplete: true
          } : f
        );
        
        setTimeout(() => {
          if (onFilesChange) {
            onFilesChange(retrySuccessFiles);
          }
        }, 0);
        
        return retrySuccessFiles;
      })
      
      // Keep progress at 100% for completed retry
      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      
      // Clear the AbortController
      setUploadControllers(prev => {
        const newControllers = { ...prev };
        delete newControllers[fileId];
        return newControllers;
      });

    } catch (error) {
      console.error('Retry failed:', error);
      
      setSelectedFiles(prev => {
        const retryErrorFiles = prev.map(f => 
          f.id === fileId ? { ...f, isUploading: false, uploadError: error.message } : f
        );
        
        setTimeout(() => {
          if (onFilesChange) {
            onFilesChange(retryErrorFiles);
          }
        }, 0);
        
        return retryErrorFiles;
      })

      setErrors(prev => [...prev, `Retry failed for ${fileToRetry.filename}: ${error.message}`]);
    } finally {
      // Clean up tracking
      setRetryingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });

      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });


      setUploadingPaths(prev => {
        const newPaths = { ...prev };
        delete newPaths[fileId];
        return newPaths;
      });
      
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
      
      setUploadControllers(prev => {
        const newControllers = { ...prev };
        delete newControllers[fileId];
        return newControllers;
      });
    }
  };

  // Delete entire folder and all its files
  const deleteFolder = async (folderPath) => {
    // Find all files in this folder
    const filesToDelete = selectedFiles.filter(file => {
      // Check if file's relative path starts with the folder path
      const fileFolderPath = file.relativePath ? file.relativePath.substring(0, file.relativePath.lastIndexOf('/')) : '';
      return fileFolderPath === folderPath || fileFolderPath.startsWith(folderPath + '/');
    });
    
    if (filesToDelete.length === 0) return;
    
    // Confirm deletion if there are uploaded files
    const hasUploadedFiles = filesToDelete.some(f => f.uploadComplete || f.path);
    if (hasUploadedFiles) {
      const confirmDeletion = window.confirm(
        `Are you sure you want to delete the folder "${folderPath.split('/').pop()}" and all ${filesToDelete.length} file(s) inside it?\n\nThis will permanently remove uploaded files from storage.`
      );
      if (!confirmDeletion) return;
    }
    
    // Collect all file paths that need to be deleted from storage
    const pathsToDelete = filesToDelete
      .filter(f => f.path && !f.isLocal)
      .map(f => f.path);
    
    // Delete files from Supabase storage in batch if there are any uploaded files
    if (pathsToDelete.length > 0) {
      try {
        console.log(`Deleting ${pathsToDelete.length} files from storage...`);
        const deleteResult = await SupabaseStorageService.deleteMultipleFiles(pathsToDelete, sessionId);
        console.log(`Deleted ${deleteResult.successful} files from storage, ${deleteResult.failed.length} failed`);
        
        if (deleteResult.failed.length > 0) {
          setErrors(prev => [...prev, `Note: ${deleteResult.failed.length} file(s) could not be removed from server.`]);
        }
      } catch (error) {
        console.error('Error deleting files from storage:', error);
        setErrors(prev => [...prev, `Note: Files could not be removed from server. They will be cleaned up automatically.`]);
      }
    }
    
    // Remove all files from local state at once
    const fileIdsToDelete = new Set(filesToDelete.map(f => f.id));
    const newFiles = selectedFiles.filter(f => !fileIdsToDelete.has(f.id));
    setSelectedFiles(newFiles);
    
    // Clear any upload tracking for these files
    setUploadingFiles(prev => {
      const newSet = new Set(prev);
      fileIdsToDelete.forEach(id => newSet.delete(id));
      return newSet;
    });
    
    setUploadingPaths(prev => {
      const newPaths = { ...prev };
      fileIdsToDelete.forEach(id => delete newPaths[id]);
      return newPaths;
    });
    
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      fileIdsToDelete.forEach(id => delete newProgress[id]);
      return newProgress;
    });
    
    setUploadControllers(prev => {
      const newControllers = { ...prev };
      fileIdsToDelete.forEach(id => delete newControllers[id]);
      return newControllers;
    });
    
    // Rebuild folder structure
    const structure = {};
    newFiles.forEach(fileData => {
      const parts = fileData.relativePath.split('/');
      let current = structure;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = fileData;
    });
    setFolderStructure(structure);
    
    // Call parent callback
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
    
    console.log(`Deleted folder ${folderPath} with ${filesToDelete.length} files`);
  };
  
  // Remove file from list and delete from Supabase if uploaded
  const removeFile = async (fileId, skipConfirmation = false) => {
    const fileToRemove = selectedFiles.find(f => f.id === fileId);
    
    if (!fileToRemove) return;
    
    console.log('Removing file:', fileToRemove.filename, 'ID:', fileId);
    
    // If file is uploading, cancel it using AbortController
    if (uploadingFiles.has(fileId)) {
      // Abort the upload if controller exists
      const controller = uploadControllers[fileId];
      if (controller) {
        controller.abort();
        console.log('Aborted upload for:', fileToRemove.filename);
      }
      
      // Try to delete the partial upload from Supabase if it exists
      const uploadPath = uploadingPaths[fileId];
      if (uploadPath) {
        try {
          const deleteResult = await SupabaseStorageService.deleteFile(uploadPath, sessionId);
          if (deleteResult) {
            console.log('Successfully deleted cancelled upload from Supabase:', uploadPath);
          } else {
            console.warn('Failed to delete cancelled upload from Supabase:', uploadPath);
          }
        } catch (error) {
          console.warn('Could not delete cancelled upload (file might not exist yet):', uploadPath, error);
          // This is expected if the upload hadn't started or completed yet
        }
      }
      
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      
      setUploadingPaths(prev => {
        const newPaths = { ...prev };
        delete newPaths[fileId];
        return newPaths;
      });
      
      setUploadControllers(prev => {
        const newControllers = { ...prev };
        delete newControllers[fileId];
        return newControllers;
      });
    }
    
    // If file was successfully uploaded, delete it from Supabase
    if (fileToRemove.path && !fileToRemove.isLocal && !skipConfirmation) {
      console.log('Attempting to delete uploaded file:', fileToRemove.path);
      
      // Only allow deletion if file has matching session_id (if session validation is enabled)
      // For now, we'll attempt deletion regardless to fix the immediate issue
      const canDelete = !fileToRemove.session_id || fileToRemove.session_id === sessionId;
      
      if (canDelete) {
        try {
          const deleteResult = await SupabaseStorageService.deleteFile(fileToRemove.path, sessionId);
          if (deleteResult) {
            console.log('Successfully deleted file from Supabase:', fileToRemove.filename);
            setErrors(prev => prev.filter(e => !e.includes(fileToRemove.filename)));
          } else {
            console.error('Failed to delete file from Supabase:', fileToRemove.filename);
            // Show user-friendly error
            setErrors(prev => [...prev, `Note: File ${fileToRemove.filename} may still exist on server. It will be cleaned up automatically.`]);
          }
        } catch (error) {
          console.error('Error deleting file from Supabase:', error);
          // Continue with local removal even if Supabase delete fails
          setErrors(prev => [...prev, `Note: Could not remove ${fileToRemove.filename} from server. It will be cleaned up automatically.`]);
        }
      } else {
        console.warn('Cannot delete file from different session:', fileToRemove.filename);
        setErrors(prev => [...prev, `Note: Cannot remove ${fileToRemove.filename} - uploaded in different session.`]);
      }
    }
    
    // Remove from local state
    const newFiles = selectedFiles.filter(f => f.id !== fileId);
    setSelectedFiles(newFiles);
    
    // Rebuild folder structure
    const structure = {};
    newFiles.forEach(fileData => {
      const parts = fileData.relativePath.split('/');
      let current = structure;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = fileData;
    });
    setFolderStructure(structure);
    
    // Call parent callback once
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


  // Get file type info based on filename or MIME type
  const getFileTypeInfo = (file) => {
    const filename = file.name || file.filename || '';
    const mimeType = file.type || '';
    const ext = filename.split('.').pop().toLowerCase();
    
    // Check by file extension first
    if (['pdf'].includes(ext)) return { label: 'PDF', className: 'file-type-pdf' };
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return { label: 'IMG', className: 'file-type-image' };
    if (['zip', 'rar', '7z'].includes(ext)) return { label: 'ZIP', className: 'file-type-archive' };
    if (['dwg', 'dxf', 'dwf'].includes(ext)) return { label: 'CAD', className: 'file-type-cad' };
    if (['xls', 'xlsx', 'xlsm'].includes(ext)) return { label: 'XLS', className: 'file-type-excel' };
    if (['txt', 'csv'].includes(ext)) return { label: 'TXT', className: 'file-type-text' };
    if (['rvt', 'rfa', 'ifc'].includes(ext)) return { label: 'BIM', className: 'file-type-bim' };
    
    // Fall back to MIME type checking
    if (mimeType.includes('pdf')) return { label: 'PDF', className: 'file-type-pdf' };
    if (mimeType.includes('image')) return { label: 'IMG', className: 'file-type-image' };
    if (mimeType.includes('zip') || mimeType.includes('rar')) return { label: 'ZIP', className: 'file-type-archive' };
    if (mimeType.includes('sheet')) return { label: 'XLS', className: 'file-type-excel' };
    if (mimeType.includes('text')) return { label: 'TXT', className: 'file-type-text' };
    
    return { label: 'FILE', className: 'file-type-default' };
  };

  // Render folder structure
  const renderFolderStructure = () => {
    const renderLevel = (obj, level = 0) => {
      return Object.entries(obj).map(([key, value]) => {
        if (value.id) {
          // It's a file
          const fileType = getFileTypeInfo(value);
          return (
            <div key={value.id} className="file-item compact" style={{ paddingLeft: `${level * 20}px` }}>
              <div className="file-info">
                <span className={`file-type-badge ${fileType.className}`}>
                  {fileType.label}
                </span>
                <span className="file-name">{value.filename}</span>
                <span className="file-size">{formatFileSize(value.size)}</span>
                
                {/* Upload status */}
                {value.isUploading && uploadProgress[value.id] < 100 && (
                  <div className="file-upload-status">
                    <span className="file-status uploading">
                      Uploading... {uploadProgress[value.id] ? `${Math.round(uploadProgress[value.id])}%` : '0%'}
                    </span>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${uploadProgress[value.id] || 0}%` }}
                      />
                    </div>
                  </div>
                )}
                {((value.isUploading && uploadProgress[value.id] === 100) || (!value.isUploading && !value.uploadError && value.uploadComplete)) && (
                  <span className="file-status uploaded">✓ Uploaded</span>
                )}
                {value.uploadError && (
                  <span className="file-status error">
                    Upload failed: {value.uploadError}
                    <button
                      type="button"
                      className="retry-button"
                      onClick={() => retryUpload(value.id)}
                      disabled={disabled || retryingFiles.has(value.id)}
                      title="Retry upload"
                    >
                      {retryingFiles.has(value.id) ? '⟳' : '↻'} Retry
                    </button>
                  </span>
                )}
                {value.isLocal && !value.isUploading && !value.uploadComplete && (
                  <span className="file-status pending">Pending upload</span>
                )}
              </div>
              
              <div className="file-actions">
                <button
                  type="button"
                  className={`file-remove compact ${value.isUploading ? 'uploading' : ''}`}
                  onClick={() => handleDeleteClick(value.id)}
                  disabled={disabled}
                  title={value.isUploading ? "Cancel upload" : "Remove file"}
                >
                  ✕
                </button>
              </div>
              
            </div>
          );
        } else {
          // It's a folder
          // Get the full folder path
          const folderPath = level === 0 ? key : `${key}`;
          
          // Recursively collect all files in this folder and subfolders
          const getAllFilesInFolder = (obj) => {
            let files = [];
            Object.values(obj).forEach(item => {
              if (item && item.id) {
                // It's a file
                files.push(item);
              } else if (typeof item === 'object' && item !== null) {
                // It's a subfolder, recurse
                files = files.concat(getAllFilesInFolder(item));
              }
            });
            return files;
          };
          
          const filesInFolder = getAllFilesInFolder(value);
          const allFilesUploaded = filesInFolder.every(f => f.uploadComplete === true);
          // Check if any files are actually still uploading using the Set tracker
          const someFilesUploading = filesInFolder.some(f => uploadingFiles.has(f.id));
          

          return (
            <div key={key} className="folder-group">
              <div className="folder-header" style={{ paddingLeft: `${level * 20}px` }}>
                <svg 
                  className="folder-icon"
                  width="15" 
                  height="15" 
                  viewBox="0 0 16 16" 
                  fill="currentColor"
                >
                  <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3z"/>
                </svg>
                <span className="folder-name">{key}</span>
                <span className="folder-file-count">({filesInFolder.length} files)</span>
                <button
                  type="button"
                  className="folder-delete-btn"
                  onClick={() => {
                    // Build full path by traversing up the folder structure
                    const pathParts = [];
                    let currentKey = key;
                    pathParts.unshift(currentKey);
                    // For nested folders, we'd need to track parent paths
                    // For now, using the first file's path to determine folder path
                    if (filesInFolder.length > 0) {
                      const firstFile = filesInFolder[0];
                      const fullPath = firstFile.relativePath.substring(0, firstFile.relativePath.lastIndexOf('/'));
                      deleteFolder(fullPath);
                    }
                  }}
                  disabled={disabled || someFilesUploading}
                  title={someFilesUploading ? "Cannot delete while uploading" : "Delete entire folder"}
                  style={{ 
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              </div>
              {renderLevel(value, level + 1)}
            </div>
          );
        }
      });
    };

    return renderLevel(folderStructure);
  };

  return (
    <div className="file-upload-component">
      {/* Drop zone */}
      <div
        className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''} ${selectedFiles.length > 0 ? 'has-files' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {selectedFiles.length === 0 ? (
          <>
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            
            <p className="upload-text">
              Drag and drop files or folders here
            </p>
          </>
        ) : (
          <div className="files-in-dropzone">
            <div className="dropzone-header">
              <h4>Selected Files ({selectedFiles.length}/{maxFiles})</h4>
              <p className="upload-hint">
                <small>Drag more files here or use the buttons below</small>
              </p>
            </div>
            <div className="dropzone-files-list">
              {Object.keys(folderStructure).length > 0 ? (
                renderFolderStructure()
              ) : (
                selectedFiles.map(file => (
                  <div key={file.id} className="file-item compact">
                    <div className="file-info">
                      <span className={`file-type-badge ${getFileTypeInfo(file).className}`}>
                        {getFileTypeInfo(file).label}
                      </span>
                      <span className="file-name">{file.filename}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                      
                      {/* Upload status */}
                      {file.isUploading && uploadProgress[file.id] < 100 && (
                        <span className="file-status uploading">
                          {Math.round(uploadProgress[file.id] || 0)}%
                        </span>
                      )}
                      {((file.isUploading && uploadProgress[file.id] === 100) || (!file.isUploading && !file.uploadError && file.uploadComplete)) && (
                        <span className="file-status uploaded">✓</span>
                      )}
                      {file.uploadError && (
                        <button
                          type="button"
                          className="retry-button"
                          onClick={() => retryUpload(file.id)}
                          disabled={disabled || retryingFiles.has(file.id)}
                          title="Retry upload"
                        >
                          ↻
                        </button>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      className="file-remove compact"
                      onClick={() => handleDeleteClick(file.id)}
                      disabled={disabled}
                      title={file.isUploading ? "Cancel" : "Remove"}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.tif,.svg,.xls,.xlsx,.xlsm,.xlsb,.dwg,.dxf,.dwf,.dwfx,.txt,.csv,.zip,.rar,.7z,.ifc,.rvt,.rfa,.rte,.step,.stp,.stl,.iges,.igs,.sat,.3dm,.3ds,.obj,.dae,.skp"
          onChange={handleFileSelect}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        {/* Hidden folder input */}
        <input
          ref={folderInputRef}
          type="file"
          multiple
          webkitdirectory=""
          directory=""
          onChange={handleFolderSelect}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        <div className="upload-buttons">
          <button
            type="button"
            className="btn-upload"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            Select Files
          </button>
          
          <button
            type="button"
            className="btn-upload btn-folder"
            onClick={() => folderInputRef.current?.click()}
            disabled={disabled}
          >
            Select Folder
          </button>
        </div>
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

      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-dialog">
            <h3>Confirm File Deletion</h3>
            <p>
              {selectedFiles.find(f => f.id === showDeleteConfirm)?.uploadComplete ? (
                <>
                  <strong>This file has been uploaded to our servers.</strong><br/>
                  Are you sure you want to delete it? This will permanently remove the file from storage.
                </>
              ) : (
                'Are you sure you want to remove this file? This action cannot be undone.'
              )}
            </p>
            <div className="delete-confirmation-buttons">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-delete" 
                onClick={() => confirmDelete(showDeleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadWithFolders;