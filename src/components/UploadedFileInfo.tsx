
import React from 'react';

interface UploadedFileInfoProps {
  fileName: string;
  uploadDate: string;
}

const UploadedFileInfo: React.FC<UploadedFileInfoProps> = ({ fileName, uploadDate }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-medium text-gray-800 break-all">{fileName}</p>
        <p className="text-sm text-gray-500 mt-1">Uploaded {uploadDate}</p>
      </div>
    </div>
  );
};

export default UploadedFileInfo;
