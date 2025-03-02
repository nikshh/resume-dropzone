import React, { useState, useEffect } from 'react';
import ResumeDropzone from '@/components/ResumeDropzone';
import { Upload } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import axios from 'axios';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { closeTelegram, expandTelegram, isExpanded, user } = useTelegram();

  // Базовый URL API (без https)
  const API_URL = 'http://prointerview.ru';

  useEffect(() => {
    // Определяем, является ли устройство мобильным
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
    // Expand the Telegram Web App when component mounts
    if (!isExpanded) {
      expandTelegram();
    }
  }, [isExpanded, expandTelegram]);

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    // Set current date in format "Sat Mar 01 2023"
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    setUploadDate(now.toLocaleDateString('en-US', options));
  };

  // Обработчик изменения файла для fallback input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFileUploaded(event.target.files[0]);
    }
  };

  const handleContinue = async () => {
    if (uploadedFile) {
      try {
        setIsUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', uploadedFile);

        // Добавляем telegram_id, если у нас есть доступ к пользователю
        if (user && user.id) {
          formData.append('telegram_id', user.id.toString());
        } else {
          // Временное решение - используем mock ID если нет доступа к пользователю
          formData.append('telegram_id', '12345678');
        }

        console.log('Отправляемые данные:', {
          fileSize: uploadedFile.size,
          fileName: uploadedFile.name,
          hasUser: !!user,
          userId: user?.id
        });

        const response = await axios.post(`${API_URL}/resume/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          withCredentials: false,
          timeout: 30000,
        });

        console.log('Ответ сервера:', response.data);

        closeTelegram();
      } catch (error: any) {
        console.error('Error uploading file:', error);
        if (error.message === 'Network Error') {
          setUploadError('Ошибка сети. Пожалуйста, попробуйте позже.');
        } else if (error.response) {
          setUploadError(`Ошибка сервера: ${error.response.status} - ${error.response.data.message || 'Неизвестная ошибка'}`);
        } else {
          setUploadError(`Ошибка: ${error.message}`);
        }
      } finally {
        setIsUploading(false);
      }
    } else {
      closeTelegram();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with branding and info block */}
      <header className="w-full flex justify-between items-center px-6 sm:px-8 lg:px-12 pt-4">
        <div className="bg-blue-100 px-4 py-1.5 rounded-full flex items-center">
          <span className="text-blue-800 font-medium">Prointerview</span>
        </div>
        <div className="text-gray-600 text-sm font-medium">
          Ответы на вопросы
        </div>
      </header>
      
      {/* Main content with reduced top padding */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center py-2 sm:py-4 md:py-6 px-6 sm:px-8 lg:px-12 gap-8 md:gap-20">
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

        {/* Right side upload card with blue shadow */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 shadow-[0_10px_35px_-5px_rgba(59,130,246,0.3)]">
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
                  disabled={isUploading}
                >
                  {isUploading ? 'Отправка...' : 'Продолжить'}
                </button>
                {uploadError && (
                  <p className="mt-2 text-sm text-red-500">{uploadError}</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                {isMobile ? (
                  <input type="file" accept="*/*" onChange={handleInputChange} className="border p-2 rounded-md" />
                ) : (
                  <ResumeDropzone onFileUploaded={handleFileUploaded} />
                )}
                <button
                  className="mt-6 rounded-md bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 transition-colors self-center"
                  onClick={handleContinue}
                  disabled={isUploading}
                >
                  {isUploading ? 'Отправка...' : 'Продолжить'}
                </button>
                {uploadError && (
                  <p className="mt-2 text-sm text-red-500 text-center">{uploadError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
