import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';
import { UploadCloud, File, X, Check, AlertCircle } from 'lucide-react';

interface ResumeDropzoneProps {
  className?: string;
  onFileUploaded?: (file: File) => void;
}

const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({ className, onFileUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const allowedFileTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'text/plain',
    'application/rtf',
    'text/rtf'
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];

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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      handleUpload(droppedFile);
    }
  };

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    
    checkMobile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      // Для мобильных добавляем небольшую задержку перед обработкой
      if (isMobile) {
        console.log("Мобильное устройство обнаружено, файл:", {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        });
        
        // Добавляем небольшую задержку для мобильных устройств
        setTimeout(() => {
          setFile(selectedFile);
          handleUpload(selectedFile);
        }, 300);
      } else {
        setFile(selectedFile);
        handleUpload(selectedFile);
      }
    }
  };

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setFileError(null);
    setUploadStatus('idle');
    // Reset the input value to allow uploading the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleUpload = async (file: File) => {
    setUploadStatus('uploading');
    
    // Simulate upload with a timeout
    setTimeout(() => {
      // Simulate a 95% success rate
      const isSuccess = Math.random() < 0.95;
      
      if (isSuccess) {
        setUploadStatus('success');
        if (onFileUploaded) {
          onFileUploaded(file);
        }
        toast({
          title: "Resume uploaded",
          description: `Your resume "${file.name}" has been successfully uploaded.`,
        });
      } else {
        setUploadStatus('error');
        setFileError('Failed to upload. Please try again.');
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error uploading your resume. Please try again.",
        });
      }
    }, 2000);
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  // If we already have a file and it's uploaded successfully, let's not render the dropzone
  if (file && uploadStatus === 'success' && onFileUploaded) {
    return null;
  }

  return (
    <div className={cn("w-full mx-auto", className)}>
      <div
        className={cn(
          "resume-dropzone flex flex-col items-center justify-center p-8 h-64",
          isDragging ? "drag-active animate-pulse-light" : "",
          fileError ? "border-red-300 bg-red-50 shadow-[0_5px_25px_-5px_rgba(255,200,200,0.4)]" : "",
          isMobile ? "mobile-dropzone" : "",
          className
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.rtf"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload resume"
          // Для мобильных устройств мы не используем capture, так как это может вызвать проблемы
        />

        {!file && !fileError && (
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
        )}

        {file && !fileError && (
          <div className="flex flex-col items-center space-y-4 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <File className="h-8 w-8 text-indigo-600" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
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
        )}

        {fileError && (
          <div className="flex flex-col items-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-red-500">{fileError}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-xs text-blue-500 mt-2 hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDropzone;
