
import React from 'react';
import CustomCheckbox from './CustomCheckbox';

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({ checked, onChange, className }) => {
  return (
    <div className={`flex items-start space-x-2 ${className}`}>
      <CustomCheckbox 
        checked={checked} 
        onChange={onChange} 
      />
      <span className="text-sm text-gray-600">
        Я согласен(а), с <a href="https://prointerview.ru/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">политикой обработки персональных данных</a> и <a href="https://prointerview.ru/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">офертой</a>
      </span>
    </div>
  );
};

export default ConsentCheckbox;
