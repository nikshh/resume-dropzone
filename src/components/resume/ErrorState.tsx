
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onTryAgain: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onTryAgain }) => {
  return (
    <div className="flex flex-col items-center space-y-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-red-500">{errorMessage}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTryAgain();
          }}
          className="text-xs text-blue-500 mt-2 hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
