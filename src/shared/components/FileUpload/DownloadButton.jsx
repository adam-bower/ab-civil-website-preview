import React, { useState } from 'react';
import DownloadHelper from '../../services/downloadHelper';
import './FileUpload.css';

/**
 * Download Button Component
 * Allows downloading uploaded files while preserving folder structure
 */
const DownloadButton = ({ files, projectName = 'download' }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    if (!files || files.length === 0) return;
    
    setIsDownloading(true);
    
    try {
      // Check if all files are from the same upload session
      const sessions = DownloadHelper.prepareStructuredDownload(files);
      const sessionKeys = Object.keys(sessions);
      
      if (sessionKeys.length === 1) {
        // All files from same session - download with preserved structure
        await DownloadHelper.downloadAsZip(files, `${projectName}_files.zip`);
      } else {
        // Multiple sessions - download each session separately
        for (const sessionKey of sessionKeys) {
          const session = sessions[sessionKey];
          const folderName = sessionKey.split('/').pop();
          await DownloadHelper.downloadAsZip(session.files, `${folderName}.zip`);
        }
      }
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download files. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  if (!files || files.length === 0) {
    return null;
  }
  
  return (
    <div className="download-button-container">
      <button
        type="button"
        className="btn-download"
        onClick={handleDownload}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <span className="spinner"></span> Downloading...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download All Files ({files.length} files)
          </>
        )}
      </button>
      
      {files.length > 1 && (
        <p className="download-note">
          Files will be downloaded as a ZIP archive preserving folder structure
        </p>
      )}
    </div>
  );
};

export default DownloadButton;