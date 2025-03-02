
import React from 'react';
import { File, X, Check, AlertCircle } from 'lucide-react';
import { UploadStatus } from './types';

interface FilePreviewProps {
  file: File;
  uploadStatus: UploadStatus;
  onRemoveFile: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, uploadStatus, onRemoveFile }) => {
  return (
    <div className="flex flex-col items-center space-y-4 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
          <File className="h-8 w-8 text-indigo-600" />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveFile();
          }}
          className="absolute -top-2 -right-2 rounded-full bg-white p-1 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Remove file"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
        
        {uploadStatus === 'uploading' && (
          <div className="absolute -bottom-2 -right-2 rounded-full bg-blue-100 p-1 shadow-md">
            <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
        )}
        
        {uploadStatus === 'success' && (
          <div className="absolute -bottom-2 -right-2 rounded-full bg-green-100 p-1 shadow-md">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="absolute -bottom-2 -right-2 rounded-full bg-red-100 p-1 shadow-md">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
          {file.name}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
        
        {uploadStatus === 'uploading' && (
          <p className="text-xs text-blue-500 mt-2">Uploading...</p>
        )}
        
        {uploadStatus === 'success' && (
          <p className="text-xs text-green-500 mt-2">Upload complete</p>
        )}
        
        {uploadStatus === 'error' && (
          <p className="text-xs text-red-500 mt-2">Upload failed</p>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
