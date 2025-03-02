
import React from 'react';
import { cn } from '@/lib/utils';
import { ResumeDropzoneProps } from './types';
import { useResumeUpload } from './useResumeUpload';
import EmptyState from './EmptyState';
import FilePreview from './FilePreview';
import ErrorState from './ErrorState';

const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({ className, onFileUploaded }) => {
  const {
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
  } = useResumeUpload(onFileUploaded);

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
        />

        {!file && !fileError && <EmptyState />}

        {file && !fileError && (
          <FilePreview
            file={file}
            uploadStatus={uploadStatus}
            onRemoveFile={handleRemoveFile}
          />
        )}

        {fileError && (
          <ErrorState 
            errorMessage={fileError} 
            onTryAgain={handleRemoveFile}
          />
        )}
      </div>
    </div>
  );
};

export default ResumeDropzone;
