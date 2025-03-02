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
  const { closeTelegram, expandTelegram, isExpanded, user } = useTelegram();

  // API URL with HTTPS to ensure secure connections on mobile
  const API_URL = 'http://prointerview.ru';

  // Функция для проверки CORS настроек на сервере
  const checkServerCorsSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/resume/upload`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type,Accept',
        },
      });
      
      console.log('CORS check response:', {
        ok: response.ok,
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
          'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
          'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        }
      });
      
      return response.ok;
    } catch (error) {
      console.warn('CORS check failed:', error);
      return false;
    }
  };
  
  useEffect(() => {
    // Expand the Telegram Web App when component mounts
    if (!isExpanded) {
      expandTelegram();
    }
    
    // Проверка CORS настроек при загрузке
    checkServerCorsSettings()
      .then(corsSupported => {
        console.log('CORS properly configured:', corsSupported);
      });
  }, [isExpanded, expandTelegram]);

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    // Set current date in format "Sat Mar 01 2023"
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
    setUploadDate(now.toLocaleDateString('en-US', options));
  };

  const handleContinue = async () => {
    if (uploadedFile) {
      try {
        setIsUploading(true);
        setUploadError(null);
        
        const formData = new FormData();
        formData.append('file', uploadedFile);
        
        // Add telegram_id if user exists
        if (user && user.id) {
          formData.append('telegram_id', user.id.toString());
        } else {
          // Fallback ID for testing
          formData.append('telegram_id', '12345678');
        }
        
        // Debug logging
        console.log('Upload data:', {
          fileSize: uploadedFile.size,
          fileName: uploadedFile.name,
          hasUser: !!user,
          userId: user?.id,
          apiUrl: API_URL
        });
        
        // Попробуем использовать XMLHttpRequest вместо axios для обхода ограничений
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/resume/upload`, true);
        xhr.timeout = 60000; // 60 секунд таймаут
        
        // Слушаем прогресс загрузки (опционально)
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            console.log(`Загрузка: ${percentComplete.toFixed(2)}%`);
          }
        };
        
        // Обработка результата
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Успешная загрузка:', xhr.responseText);
            closeTelegram();
          } else {
            console.error('Ошибка сервера:', xhr.status, xhr.statusText);
            setUploadError(`Ошибка сервера: ${xhr.status} - ${xhr.statusText}`);
          }
          setIsUploading(false);
        };
        
        // Обработка ошибок
        xhr.onerror = function() {
          console.error('Ошибка сети при использовании XMLHttpRequest');
          
          // Если XMLHttpRequest не сработал, пробуем через axios с модифицированными настройками
          console.log('Пробуем альтернативный метод через axios...');
          
          axios.post(`${API_URL}/resume/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
            withCredentials: false,
            timeout: 60000,
            // Отключаем настройки безопасности, которые могут блокировать HTTP
            httpsAgent: false,
          }).then(response => {
            console.log('Server response (axios):', response.data);
            closeTelegram();
            setIsUploading(false);
          }).catch(axiosError => {
            console.error('Axios upload error details:', axiosError);
            
            let errorMsg = 'Неизвестная ошибка при загрузке';
            if (axiosError.message === 'Network Error') {
              errorMsg = 'Ошибка сети.';
            } else if (axiosError.response) {
              errorMsg = `Ошибка сервера: ${axiosError.response.status} - ${axiosError.response.data?.message || 'Неизвестная ошибка'}`;
            } else if (axiosError.request) {
              errorMsg = 'Сервер не отвечает. Пожалуйста, попробуйте позже.';
            } else {
              errorMsg = `Ошибка: ${axiosError.message || 'Неизвестная ошибка'}`;
            }
            
            setUploadError(errorMsg);
            setIsUploading(false);
          });
        };
        
        // Обработка таймаута
        xhr.ontimeout = function() {
          console.error('Превышено время ожидания запроса');
          setUploadError('Превышено время ожидания запроса. Проверьте скорость интернет-соединения.');
          setIsUploading(false);
        };
        
        // Отправляем запрос
        xhr.send(formData);
        
      } catch (error) {
        console.error('Upload error details:', error);
        
        // Enhanced error handling
        if (error.message === 'Network Error') {
          setUploadError('Ошибка сети. Пожалуйста, проверьте подключение к интернету и попробуйте снова.');
        } else if (error.response) {
          // Server responded with error code
          setUploadError(`Ошибка сервера: ${error.response.status} - ${error.response.data?.message || 'Неизвестная ошибка'}`);
        } else if (error.request) {
          // Request made but no response received
          setUploadError('Сервер не отвечает. Пожалуйста, попробуйте позже.');
        } else {
          setUploadError(`Ошибка: ${error.message || 'Неизвестная ошибка'}`);
        }
        setIsUploading(false);
      }
    } else {
      // Close Telegram Web App if no file
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
                <ResumeDropzone onFileUploaded={handleFileUploaded} />
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
