
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  uploadedFile: File | null;
  isUploading: boolean;
  isSkipping: boolean;
  consentChecked: boolean;
  handleContinue: () => void;
  handleSkipResume: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  uploadedFile,
  isUploading,
  isSkipping,
  consentChecked,
  handleContinue,
  handleSkipResume
}) => {
  return (
    <>
      <button
        className={`w-full mt-6 rounded-md px-6 py-3 font-medium text-white transition-colors ${consentChecked && (uploadedFile || !uploadedFile) ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-400 cursor-not-allowed'}`}
        onClick={handleContinue}
        disabled={isUploading || !consentChecked}
      >
        {isUploading ? 'Отправка...' : 'Продолжить'}
      </button>
      
      <div className="mt-4 w-full">
        <Button 
          variant="outline"
          onClick={handleSkipResume}
          disabled={isSkipping}
          className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        >
          {isSkipping ? 'Обработка...' : 'Загрузить резюме позже'}
        </Button>
      </div>
    </>
  );
};

export default ActionButtons;
