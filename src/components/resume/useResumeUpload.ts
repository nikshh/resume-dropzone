
import { useState, useRef, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import { UploadStatus } from './types';
import { useFileValidation } from './useFileValidation';

export const useResumeUpload = (onFileUploaded?: (file: File) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const { fileError, setFileError, validateFile } = useFileValidation();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      handleUpload(selectedFile);
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
  }, [setFileError]);

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

  return {
    isDragging,
    file,
    fileError,
    uploadStatus,
    inputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    handleRemoveFile,
    openFileDialog
  };
};
