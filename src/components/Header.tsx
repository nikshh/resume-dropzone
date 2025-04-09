
import React from 'react';

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center px-6 sm:px-8 lg:px-12 pt-4">
      <div className="bg-blue-100 px-4 py-1.5 rounded-full flex items-center">
        <span className="text-blue-800 font-medium">Prointerview</span>
      </div>
      <div className="text-gray-600 text-sm font-medium">
        Ответы на вопросы
      </div>
    </header>
  );
};

export default Header;
