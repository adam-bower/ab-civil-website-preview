import { supabase } from '../lib/supabase';
import { sanitizeFilename, generateSecureId, validateFile as securityValidateFile } from '../utils/security';

class SupabaseStorageService {
  // Storage configuration
  static bucketName = 'service-selection-fileupload';
  static supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://db.ab-civil.com';
  static maxFileSize = 2 * 1024 * 1024 * 1024; // 2GB file size limit
  static allowedTypes = [
    // Documents
    'application/pdf', 'application/x-pdf',
    
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'image/bmp', 'image/tiff', 'image/svg+xml',
    
    // Spreadsheets
    'application/vnd.ms-excel', 'application/excel', 'application/x-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    
    // CAD formats
    'application/acad', 'application/x-acad', 'application/autocad_dwg', 
    'image/x-dwg', 'application/dwg', 'image/vnd.dwg', 'application/x-dwg',
    'application/dxf', 'application/x-dxf', 'image/vnd.dxf', 'image/x-dxf',
    
    // Text/Data
    'text/plain', 'text/csv', 'application/csv', 'text/x-csv',
    
    // Archive formats
    'application/zip', 'application/x-zip-compressed', 'application/x-zip',
    'application/x-rar-compressed', 'application/vnd.rar', 'application/rar', 'application/x-rar',
    
    // BIM/CAD formats
    'application/x-step', 'model/ifc', 'application/ifc', 'application/x-ifc',
    'application/octet-stream', // For .rvt and other binary CAD files
    'application/step', 'model/step', 'model/x-step', 'application/p21', 'application/stp',
    'application/sla', 'application/vnd.ms-pki.stl', 'model/stl', 'application/x-stl',
    
    // Additional common types that might be needed
    '', // Some browsers don't set MIME type for certain files
    null // Handle null MIME types
  ];
  static allowedExtensions = [
    // Documents
    '.pdf',
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.tif', '.svg',
    // Spreadsheets
    '.xls', '.xlsx', '.xlsm', '.xlsb',
    // CAD/Engineering
    '.dwg', '.dxf', '.dwf', '.dwfx',
    // Text/Data
    '.txt', '.csv',
    // Archives
    '.zip', '.rar', '.7z',
    // BIM/3D formats
    '.ifc', '.rvt', '.rfa', '.rte', '.step', '.stp', '.stl', '.iges', '.igs',
    // Additional CAD formats
    '.sat', '.3dm', '.3ds', '.obj', '.dae', '.skp'
  ];

  /**
   * Validate file before upload with enhanced security
   * @param {File} file - File to validate
   * @returns {Object} {isValid: boolean, error?: string}
   */
  static validateFile(file) {
    // Check file extension first (more reliable than MIME type)
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const hasValidExtension = this.allowedExtensions.includes(fileExtension);
    
    // Check MIME type (can be unreliable, so we're more lenient)
    const hasValidMimeType = !file.type || 
                             file.type === '' || 
                             this.allowedTypes.includes(file.type) ||
                             this.allowedTypes.includes('application/octet-stream'); // Fallback for unknown types
    
    // If extension is valid but MIME type isn't recognized, still allow it
    if (hasValidExtension && !hasValidMimeType) {
      console.log(`File ${file.name} has valid extension but unrecognized MIME type: ${file.type}`);
      // Allow the file since extension is correct
    } else {
      // Use security utility for comprehensive validation
      const securityValidation = securityValidateFile(file, {
        maxSize: this.maxFileSize,
        allowedTypes: this.allowedTypes,
        allowedExtensions: this.allowedExtensions
      });
      
      if (!securityValidation.isValid && !hasValidExtension) {
        return {
          isValid: false,
          error: securityValidation.errors[0] || 'File validation failed'
        };
      }
    }

    // Additional checks for file name
    if (file.name.length > 255) {
      return {
        isValid: false,
        error: 'File name is too long'
      };
    }

    // Check for double extensions (potential bypass attempt)
    const doubleExtPattern = /\.[a-z]+\.[a-z]+$/i;
    if (doubleExtPattern.test(file.name)) {
      return {
        isValid: false,
        error: 'File names with double extensions are not allowed'
      };
    }

    return { isValid: true };
  }

  /**
   * Generate organized file path with folder structure preservation
   * @param {string} formType - Type of form (3d-request, 3d-quote, takeoff-request, takeoff-quote)
   * @param {string} companyName - Company name
   * @param {string} projectName - Project name
   * @param {string} originalFilename - Original file name
   * @param {string} relativePath - Relative path from folder upload (optional)
   * @param {string} uploadSessionId - Shared session ID for folder uploads (optional)
   * @param {boolean} preserveExactStructure - Whether to preserve exact folder structure
   * @returns {string} File path
   */
  static generateFilePath(formType, companyName, projectName, originalFilename, relativePath = null, uploadSessionId = null, preserveExactStructure = true) {
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedCompany = sanitizeFilename(companyName).substring(0, 50); // Limit company name length
    const sanitizedProject = sanitizeFilename(projectName).substring(0, 50);
    
    // If we have a relative path (from folder upload), preserve the folder structure
    if (relativePath && relativePath !== originalFilename) {
      // For folder uploads, preserve the exact structure
      if (preserveExactStructure) {
        // Keep the original folder structure intact
        // Just sanitize each part of the path
        const pathParts = relativePath.split('/');
        const sanitizedParts = pathParts.map(part => sanitizeFilename(part));
        const sanitizedRelativePath = sanitizedParts.join('/');
        
        // Create a cleaner structure without redundant timestamps for each file
        // Format: formType/company/project/original_folder_structure
        const projectFolder = sanitizedProject || 'misc';
        return `${formType}/${sanitizedCompany}/${projectFolder}/${sanitizedRelativePath}`;
      } else {
        // Legacy behavior with session ID
        if (!uploadSessionId) {
          uploadSessionId = generateSecureId(12);
        }
        const pathParts = relativePath.split('/');
        const sanitizedParts = pathParts.map(part => sanitizeFilename(part));
        const sanitizedRelativePath = sanitizedParts.join('/');
        return `${formType}/${sanitizedCompany}/${timestamp}_${uploadSessionId}/${sanitizedRelativePath}`;
      }
    } else {
      // Single file upload - use secure ID
      const fileId = uploadSessionId || generateSecureId(12);
      const sanitizedOriginalFilename = sanitizeFilename(originalFilename);
      
      // For single files, put them in a project folder if specified
      if (sanitizedProject && preserveExactStructure) {
        const projectFolder = sanitizedProject;
        return `${formType}/${sanitizedCompany}/${projectFolder}/${sanitizedOriginalFilename}`;
      } else {
        // Legacy behavior
        const filename = `${timestamp}_${fileId}_${sanitizedOriginalFilename}`;
        return `${formType}/${sanitizedCompany}/${filename}`;
      }
    }
  }

  /**
   * Upload a single file to Supabase Storage
   * @param {File} file - File to upload
   * @param {string} formType - Type of form
   * @param {string} companyName - Company name
   * @param {string} projectName - Project name
   * @param {Function} onProgress - Progress callback (0-100)
   * @param {string} relativePath - Relative path for folder structure (optional)
   * @param {string} uploadSessionId - Shared session ID for folder uploads (optional)
   * @param {AbortSignal} signal - AbortSignal for cancellation support
   * @param {string} sessionId - Session ID for security tracking
   * @param {string} userId - User ID for RLS policies (optional)
   * @returns {Promise<Object>} File metadata or error
   */
  static async uploadFile(file, formType, companyName, projectName, onProgress, relativePath = null, uploadSessionId = null, signal = null, sessionId = null, userId = null) {
    // Declare progress variables outside try block for proper scope
    let progressInterval = null;
    let currentProgress = 0;
    
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate file path
      const filePath = this.generateFilePath(formType, companyName, projectName, file.name, relativePath, uploadSessionId);

      // Start progress simulation since Supabase doesn't provide real progress
      
      if (onProgress) {
        onProgress(5);
        currentProgress = 5;
        
        // Simulate gradual progress during upload
        progressInterval = setInterval(() => {
          if (currentProgress < 90) {
            currentProgress += Math.random() * 3; // Increment by 0-3%
            currentProgress = Math.min(currentProgress, 90); // Cap at 90%
            onProgress(Math.floor(currentProgress));
          }
        }, 500); // Update every 500ms
      }

      // Upload file to public bucket with optional abort signal and metadata
      const uploadOptions = {
        cacheControl: '3600',
        upsert: false
      };
      
      // Add metadata for RLS policies
      const uploadMetadata = {};
      if (sessionId) {
        uploadMetadata.session_id = sessionId;
      }
      if (userId) {
        uploadMetadata.user_id = userId;
      }
      if (Object.keys(uploadMetadata).length > 0) {
        uploadOptions.metadata = uploadMetadata;
      }
      
      // Add abort signal if provided
      if (signal) {
        uploadOptions.signal = signal;
      }
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, uploadOptions);

      // Clear the progress interval
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      if (onProgress) {
        onProgress(95);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl;

      if (!publicUrl) {
        throw new Error('Failed to generate public URL');
      }

      if (onProgress) {
        onProgress(100);
      }

      // Return file metadata with secure ID
      const fileMetadata = {
        id: generateSecureId(16),
        filename: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        path: filePath,
        relativePath: relativePath || file.name,
        folder: relativePath ? relativePath.split('/').slice(0, -1).join('/') : ''
      };
      
      // Add session ID if provided for security tracking
      if (sessionId) {
        fileMetadata.session_id = sessionId;
      }
      
      // Add user ID if provided for RLS policies
      if (userId) {
        fileMetadata.user_id = userId;
      }
      
      return fileMetadata;

    } catch (error) {
      // Clear the progress interval if it exists
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files (including folder structures)
   * @param {Array} processedFiles - Array of file objects with metadata from FolderUploadComponent
   * @param {string} formType - Type of form
   * @param {string} companyName - Company name
   * @param {string} projectName - Project name
   * @param {Function} onProgress - Progress callback per file
   * @param {string} userId - User ID for RLS policies (optional)
   * @returns {Promise<Object>} {successful: Array, failed: Array}
   */
  static async uploadProcessedFiles(processedFiles, formType, companyName, projectName, onProgress, userId = null) {
    // Generate secure session ID for all files in this upload batch
    const sessionId = generateSecureId(12);
    
    const uploadPromises = [];
    
    // Filter out invalid files
    const validFiles = processedFiles.filter(fileObj => fileObj.isValid.valid);
    const invalidFiles = processedFiles.filter(fileObj => !fileObj.isValid.valid);

    for (let i = 0; i < validFiles.length; i++) {
      const fileObj = validFiles[i];
      
      uploadPromises.push(
        this.uploadFile(
          fileObj.file,
          formType,
          companyName,
          projectName,
          (progress) => {
            if (onProgress) {
              onProgress(i, progress, fileObj.name);
            }
          },
          fileObj.relativePath,
          sessionId, // Pass the same sessionId to all files
          null, // signal
          sessionId, // sessionId for metadata
          userId // userId for RLS policies
        )
      );
    }

    try {
      const results = await Promise.allSettled(uploadPromises);
      const successful = [];
      const failed = [...invalidFiles.map(fileObj => ({
        filename: fileObj.name,
        error: fileObj.isValid.error
      }))];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(result.value);
        } else {
          failed.push({
            filename: validFiles[index].name,
            error: result.reason.message || 'Upload failed'
          });
        }
      });

      return { successful, failed };
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files (legacy method for backward compatibility)
   * @param {FileList|Array} files - Files to upload
   * @param {string} formType - Type of form
   * @param {string} companyName - Company name
   * @param {string} projectName - Project name
   * @param {Function} onProgress - Progress callback per file
   * @param {string} userId - User ID for RLS policies (optional)
   * @returns {Promise<Array>} Array of file metadata
   */
  static async uploadMultipleFiles(files, formType, companyName, projectName, onProgress, userId = null) {
    // Generate secure session ID for all files in this upload batch
    const sessionId = generateSecureId(12);
    
    const uploadPromises = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const relativePath = file.webkitRelativePath || file.name;
      
      uploadPromises.push(
        this.uploadFile(
          file,
          formType,
          companyName,
          projectName,
          (progress) => {
            if (onProgress) {
              onProgress(i, progress, file.name);
            }
          },
          relativePath,
          sessionId, // Pass the same sessionId to all files
          null, // signal
          sessionId, // sessionId for metadata
          userId // userId for RLS policies
        )
      );
    }

    try {
      const results = await Promise.allSettled(uploadPromises);
      const successful = [];
      const failed = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(result.value);
        } else {
          failed.push({
            filename: fileArray[index].name,
            error: result.reason.message || 'Upload failed'
          });
        }
      });

      return { successful, failed };
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  /**
   * Delete a file from storage
   * @param {string} filePath - Path to file in storage
   * @param {string} sessionId - Session ID for security verification (optional)
   * @returns {Promise<boolean>} Success status
   */
  static async deleteFile(filePath, sessionId = null) {
    try {
      // Log deletion attempt for debugging
      console.log(`Attempting to delete file: ${filePath}`);
      if (sessionId) {
        console.log(`Session ID: ${sessionId}`);
      }
      
      // First attempt: Use the standard remove method
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusCode: error.statusCode
        });
        
        // If standard deletion fails, try using RPC function if available
        if (error.message?.includes('policy') || error.status === 403) {
          console.log('Attempting deletion via RPC function...');
          try {
            const { data: rpcData, error: rpcError } = await supabase
              .rpc('delete_uploaded_file', {
                p_file_path: filePath,
                p_session_id: sessionId
              });
            
            if (rpcError) {
              console.error('RPC deletion also failed:', rpcError);
              return false;
            }
            
            console.log('File deleted via RPC function');
            return rpcData === true;
          } catch (rpcErr) {
            console.error('RPC function not available:', rpcErr);
            // Continue to return false below
          }
        }
        
        return false;
      }

      // Check if deletion was successful
      // Supabase returns an array (could be empty or with deleted file info) on success
      if (Array.isArray(data)) {
        // Deletion was successful
        console.log('File deleted successfully:', filePath);
        return true;
      }
      
      // If we didn't get an array, something unexpected happened
      console.warn('Delete operation returned unexpected data:', data);
      
      // Double-check by trying to get the file
      const { data: checkData, error: checkError } = await supabase.storage
        .from(this.bucketName)
        .download(filePath);
      
      if (checkError && checkError.message?.includes('not found')) {
        console.log('File verified as deleted (not found)');
        return true;
      } else if (!checkError) {
        console.error('File still exists after deletion attempt!');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Unexpected delete error:', error);
      return false;
    }
  }

  /**
   * Delete multiple files (useful for folder deletion)
   * @param {Array<string>} filePaths - Array of file paths to delete
   * @param {string} sessionId - Session ID for security verification (optional)
   * @returns {Promise<Object>} {successful: number, failed: Array}
   */
  static async deleteMultipleFiles(filePaths, sessionId = null) {
    try {
      console.log(`Attempting to delete ${filePaths.length} files`);
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .remove(filePaths);

      if (error) {
        console.error('Multiple delete error:', error);
        
        // If batch deletion fails, try individual deletions
        if (error.message?.includes('policy') || error.status === 403) {
          console.log('Batch deletion failed, trying individual deletions...');
          const results = await Promise.allSettled(
            filePaths.map(path => this.deleteFile(path, sessionId))
          );
          
          const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
          const failed = filePaths.filter((path, index) => 
            results[index].status === 'rejected' || results[index].value === false
          );
          
          return { successful, failed };
        }
        
        return { successful: 0, failed: filePaths };
      }

      // If we got here, the deletion was successful (no error)
      // Supabase's remove() method doesn't provide detailed success info,
      // but if there's no error, we can assume all files were deleted
      console.log(`Successfully deleted ${filePaths.length} files from storage`);
      
      return { 
        successful: filePaths.length, 
        failed: []
      };
    } catch (error) {
      console.error('Unexpected multiple delete error:', error);
      return { successful: 0, failed: filePaths };
    }
  }

  /**
   * Download a file
   * @param {string} filePath - Path to file in storage
   * @returns {Promise<Blob>} File blob
   */
  static async downloadFile(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .download(filePath);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  /**
   * List files in a folder
   * @param {string} folderPath - Path to folder
   * @returns {Promise<Array>} Array of file objects
   */
  static async listFiles(folderPath = '') {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(folderPath);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('List files error:', error);
      throw error;
    }
  }
}

export default SupabaseStorageService;