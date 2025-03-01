
import React, { useState, useEffect } from 'react';
import ResumeDropzone from '@/components/ResumeDropzone';
import { Upload } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);
  const { closeTelegram } = useTelegram();

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    // Set current date in format "Sat Mar 01 2023"
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    setUploadDate(now.toLocaleDateString('en-US', options));
  };

  const handleContinue = () => {
    // Handle continue action
    closeTelegram();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content with reduced top padding */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center py-6 px-6 sm:px-8 lg:px-12 gap-8 md:gap-20">
        {/* Left side content */}
        <div className="w-full max-w-lg space-y-5 md:space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Первый шаг к работе мечты.
            </h1>
            <p className="text-xl text-gray-600">
              Загрузите ваше резюме и мы сможем начать интервью.
            </p>
          </div>
        </div>

        {/* Right side upload card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {uploadedFile ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-800 break-all">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500 mt-1">Uploaded {uploadDate}</p>
                </div>
                <button
                  className="mt-4 flex items-center justify-center rounded-md bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700 transition-colors"
                  onClick={handleContinue}
                >
                  Продолжить
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <ResumeDropzone onFileUploaded={handleFileUploaded} />
                <button
                  className="mt-6 rounded-md bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 transition-colors self-center"
                  onClick={handleContinue}
                >
                  Продолжить
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
