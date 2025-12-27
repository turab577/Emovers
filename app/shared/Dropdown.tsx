import React from "react";
import Input from "../ui/Input";
import Image from "next/image";


interface DropdownOption {
  value: string;
  label: string;
}



// Dropdown component with forwardRef
export const Dropdown = React.forwardRef<HTMLDivElement, {
  isOpen: boolean;
  onToggle: () => void;
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder: string;
}>(({ 
  isOpen, 
  onToggle, 
  options, 
  selectedValue, 
  onSelect, 
  placeholder 
}, ref) => {
  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={onToggle}
        className="cursor-pointer"
      >
        <Input
          title={placeholder}
          placeholder={placeholder}
          className="w-full cursor-pointer"
          value={selectedOption?.label || ""}
          readOnly
        />
      </div>
      <Image
        src='/images/dropdown.svg' 
        alt="Dropdown" 
        width={20} 
        height={20} 
        className="absolute top-4 right-3 pointer-events-none"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-lg z-10 mt-1 border border-gray-100">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                onToggle();
              }}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              <span className="text-sm text-gray-900">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Add display name for better debugging
Dropdown.displayName = "Dropdown";