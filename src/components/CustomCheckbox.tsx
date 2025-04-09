
import React from 'react';
import { Check } from 'lucide-react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ 
  checked, 
  onChange,
  className 
}) => {
  return (
    <div 
      className={`inline-flex items-center cursor-pointer ${className}`} 
      onClick={() => onChange(!checked)}
    >
      <div className={`w-5 h-5 flex items-center justify-center rounded border ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
        {checked && <Check className="h-3.5 w-3.5 text-white" />}
      </div>
    </div>
  );
};

export default CustomCheckbox;
