
import React from 'react';
import ResumeDropzone from './ResumeDropzone';
import UploadedFileInfo from './UploadedFileInfo';
import ActionButtons from './ActionButtons';
import ConsentCheckbox from './ConsentCheckbox';

interface UploadFormCardProps {
  uploadedFile: File | null;
  uploadDate: string | null;
  isUploading: boolean;
  isSkipping: boolean;
  uploadError: string | null;
  consentChecked: boolean;
  setConsentChecked: (checked: boolean) => void;
  handleFileUploaded: (file: File) => void;
  handleContinue: () => void;
  handleSkipResume: () => void;
}

const UploadFormCard: React.FC<UploadFormCardProps> = ({
  uploadedFile,
  uploadDate,
  isUploading,
  isSkipping,
  uploadError,
  consentChecked,
  setConsentChecked,
  handleFileUploaded,
  handleContinue,
  handleSkipResume
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 shadow-[0_10px_35px_-5px_rgba(59,130,246,0.3)]">
      {uploadedFile ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <UploadedFileInfo 
            fileName={uploadedFile.name} 
            uploadDate={uploadDate || ''} 
          />
          
          <ActionButtons 
            uploadedFile={uploadedFile}
            isUploading={isUploading}
            isSkipping={isSkipping}
            consentChecked={consentChecked}
            handleContinue={handleContinue}
            handleSkipResume={handleSkipResume}
          />
          
          {uploadError && (
            <p className="mt-2 text-sm text-red-500">{uploadError}</p>
          )}
          
          <ConsentCheckbox 
            checked={consentChecked} 
            onChange={setConsentChecked}
            className="mt-4"
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <ResumeDropzone onFileUploaded={handleFileUploaded} />
          
          <ActionButtons 
            uploadedFile={uploadedFile}
            isUploading={isUploading}
            isSkipping={isSkipping}
            consentChecked={consentChecked}
            handleContinue={handleContinue}
            handleSkipResume={handleSkipResume}
          />
          
          <ConsentCheckbox 
            checked={consentChecked} 
            onChange={setConsentChecked}
            className="mt-4"
          />
          
          {uploadError && (
            <p className="mt-2 text-sm text-red-500 text-center">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadFormCard;
