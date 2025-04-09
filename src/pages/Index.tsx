
import React, { useState, useEffect } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import axios from 'axios';
import Header from '@/components/Header';
import UploadFormCard from '@/components/UploadFormCard';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(true); // Changed to true for default checked
  const [isSkipping, setIsSkipping] = useState(false);
  const { closeTelegram, expandTelegram, isExpanded, user } = useTelegram();

  // Базовый URL API (можно вынести в env-переменные)
  const API_URL = 'https://prointerview.ru';

  useEffect(() => {
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
          // В реальном приложении это должно быть удалено
          formData.append('telegram_id', '12345678');
        }
        
        // Логгирование формы для отладки
        console.log('Отправляемые данные:', {
          fileSize: uploadedFile.size,
          fileName: uploadedFile.name,
          hasUser: !!user,
          userId: user?.id
        });
        
        // Добавляем настройки для axios, чтобы обойти проблемы с CORS и незащищенными соединениями
        const response = await axios.post(`${API_URL}/resume/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          withCredentials: false,
          timeout: 30000, // 30-секундный таймаут для запроса
        });
        
        console.log('Ответ сервера:', response.data);
        
        // Если успешно, закрываем Telegram Web App
        closeTelegram();
      } catch (error) {
        console.error('Error uploading file:', error);
        
        // Улучшенная обработка ошибок
        if (error.message === 'Network Error') {
          setUploadError('Ошибка сети. Пожалуйста, попробуйте позже.');
        } else if (error.response) {
          // Сервер ответил с кодом ошибки
          setUploadError(`Ошибка сервера: ${error.response.status} - ${error.response.data.message || 'Неизвестная ошибка'}`);
        } else {
          setUploadError(`Ошибка: ${error.message}`);
        }
      } finally {
        setIsUploading(false);
      }
    } else {
      // Если файла нет, просто закрываем Telegram Web App
      closeTelegram();
    }
  };

  const handleSkipResume = async () => {
    try {
      setIsSkipping(true);
      setUploadError(null);
      
      // Данные для отправки на сервер
      const data = {
        telegramUserId: user && user.id ? user.id : '12345678'
      };
      
      // Логгирование для отладки
      console.log('Отправляемые данные для пропуска резюме:', data);
      
      // Отправляем запрос на эндпоинт /resume/pass
      const response = await axios.post(`${API_URL}/resume/pass`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false,
        timeout: 30000,
      });
      
      console.log('Ответ сервера:', response.data);
      
      // Если успешно, закрываем Telegram Web App
      closeTelegram();
    } catch (error) {
      console.error('Error skipping resume upload:', error);
      
      // Обработка ошибок
      if (error.message === 'Network Error') {
        setUploadError('Ошибка сети. Пожалуйста, попробуйте позже.');
      } else if (error.response) {
        setUploadError(`Ошибка сервера: ${error.response.status} - ${error.response.data.message || 'Неизвестная ошибка'}`);
      } else {
        setUploadError(`Ошибка: ${error.message}`);
      }
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
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
          <UploadFormCard 
            uploadedFile={uploadedFile}
            uploadDate={uploadDate}
            isUploading={isUploading}
            isSkipping={isSkipping}
            uploadError={uploadError}
            consentChecked={consentChecked}
            setConsentChecked={setConsentChecked}
            handleFileUploaded={handleFileUploaded}
            handleContinue={handleContinue}
            handleSkipResume={handleSkipResume}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
