
import { useState } from 'react';
import { allowedFileTypes, allowedExtensions } from './types';

export const useFileValidation = () => {
  const [fileError, setFileError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!file) return false;
    
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File is too large. Maximum size is 10MB.');
      return false;
    }
    
    // Check file type
    const fileType = file.type.toLowerCase();
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    if (!allowedFileTypes.includes(fileType) && !allowedExtensions.includes(fileExtension)) {
      setFileError(`Invalid file type. Please upload a ${allowedExtensions.join(', ')} file.`);
      return false;
    }
    
    setFileError(null);
    return true;
  };

  return { fileError, setFileError, validateFile };
};
