
import React from 'react';
import { UploadCloud } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center animate-float">
        <UploadCloud className="h-8 w-8 text-indigo-600" />
      </div>
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">Drag & drop your resume</p>
        <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
        <p className="text-xs text-gray-400 mt-4">
          Supported formats: PDF, DOC, DOCX, TXT, RTF (Max size: 10MB)
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
