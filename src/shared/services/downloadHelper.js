/**
 * Download Helper Service
 * Utilities for downloading files and preserving folder structure
 */

import { supabase } from '../lib/supabase';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

class DownloadHelper {
  /**
   * Download multiple files as a ZIP while preserving folder structure
   * @param {Array<Object>} files - Array of file objects with path and url properties
   * @param {string} zipFileName - Name for the downloaded ZIP file
   * @returns {Promise<void>}
   */
  static async downloadAsZip(files, zipFileName = 'download.zip') {
    try {
      const zip = new JSZip();
      
      // Group files by their folder structure
      const fileStructure = {};
      
      for (const file of files) {
        // Extract the relative path from the full storage path
        // Format: formType/company/project_timestamp/folder/file.ext
        const pathParts = file.path.split('/');
        
        // Skip the first parts (formType/company/project_timestamp) to get clean structure
        // Or use the relativePath if available
        const relativePath = file.relativePath || pathParts.slice(3).join('/');
        
        // Download file content
        const response = await fetch(file.url);
        if (!response.ok) {
          console.error(`Failed to download ${file.filename}`);
          continue;
        }
        
        const blob = await response.blob();
        
        // Add to zip with proper folder structure
        if (relativePath.includes('/')) {
          // File is in a folder
          zip.file(relativePath, blob);
        } else {
          // File is in root
          zip.file(file.filename || relativePath, blob);
        }
      }
      
      // Generate and download the zip
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      saveAs(zipBlob, zipFileName);
      
    } catch (error) {
      console.error('Error creating zip:', error);
      throw error;
    }
  }
  
  /**
   * Download files from a specific upload session/folder
   * @param {string} bucketName - Storage bucket name
   * @param {string} folderPath - Path to the folder in storage
   * @returns {Promise<void>}
   */
  static async downloadFolder(bucketName, folderPath) {
    try {
      // List all files in the folder
      const { data: files, error } = await supabase.storage
        .from(bucketName)
        .list(folderPath, {
          limit: 1000,
          offset: 0
        });
      
      if (error) {
        throw error;
      }
      
      if (!files || files.length === 0) {
        console.warn('No files found in folder');
        return;
      }
      
      // Prepare file objects with URLs
      const fileObjects = files.map(file => {
        const fullPath = `${folderPath}/${file.name}`;
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fullPath);
        
        return {
          filename: file.name,
          path: fullPath,
          url: urlData.publicUrl,
          relativePath: file.name // Keep original structure
        };
      });
      
      // Extract folder name for zip filename
      const folderName = folderPath.split('/').pop() || 'download';
      
      // Download as zip
      await this.downloadAsZip(fileObjects, `${folderName}.zip`);
      
    } catch (error) {
      console.error('Error downloading folder:', error);
      throw error;
    }
  }
  
  /**
   * Download a single file
   * @param {string} url - File URL
   * @param {string} filename - Filename for download
   */
  static async downloadFile(url, filename) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      saveAs(blob, filename);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
  
  /**
   * Create a download link that preserves folder structure
   * @param {Array<Object>} uploadedFiles - Array of uploaded file metadata
   * @returns {Object} Download information
   */
  static prepareStructuredDownload(uploadedFiles) {
    // Group files by their upload session/project folder
    const sessions = {};
    
    uploadedFiles.forEach(file => {
      // Extract session/project folder from path
      const pathParts = file.path.split('/');
      const sessionFolder = pathParts.slice(0, 3).join('/'); // formType/company/project_timestamp
      
      if (!sessions[sessionFolder]) {
        sessions[sessionFolder] = {
          folder: sessionFolder,
          files: []
        };
      }
      
      sessions[sessionFolder].files.push(file);
    });
    
    return sessions;
  }
}

export default DownloadHelper;