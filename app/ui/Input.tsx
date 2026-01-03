import React, {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  useState,
  useRef
} from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

// Create separate interfaces for input and select
interface BaseInputProps {
title?: string;
  className?: string;
  spanClassName?: string;
}

interface InputOnlyProps extends BaseInputProps {
  as?: "input";
  type?: HTMLInputElement["type"];
  options?: never;
}

interface SelectOnlyProps extends BaseInputProps {
  as: "select";
  options: string[];
  type?: never;
}

type InputProps =
  | (InputOnlyProps & InputHTMLAttributes<HTMLInputElement>)
  | (SelectOnlyProps & SelectHTMLAttributes<HTMLSelectElement>);

const Input: React.FC<InputProps> = ({
  title,
  className,
  spanClassName,
  as = "input",
  options = [],
  type,
  disabled = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[0] || "");
  const selectRef = useRef<HTMLSelectElement>(null);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const commonClasses = `text-[#222] text-[12px] font-medium leading-4 border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-offset-1 px-3 py-4 bg-white appearance-none w-full ${
    disabled ? "bg-gray-100 text-gray-500" : "cursor-text"
  } ${className || ""}`;

  const handleSelectChange = (value: string) => {
    if (disabled) return;
    setSelectedValue(value);
    setIsDropdownOpen(false);

    // Trigger the actual select change
    if (selectRef.current) {
      selectRef.current.value = value;
      selectRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const handleDropdownToggle = () => {
    if (disabled) return;
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative w-full">
      {as === "input" ? (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          type={inputType}
          className={commonClasses}
          disabled={disabled}
        />
      ) : (
        <div className="relative">
          {/* Hidden native select for form submission */}
          <select
            ref={selectRef}
            {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
            className="hidden"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            disabled={disabled}
          >
            {options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {/* Custom dropdown trigger */}
          <button
            type="button"
            className={`${commonClasses} pr-3 text-left flex items-center justify-between ${
              disabled ? "" : "cursor-pointer"
            }`}
            onClick={handleDropdownToggle}
            disabled={disabled}
          >
            <span className="truncate">{selectedValue}</span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              } ${disabled ? "text-gray-400" : ""}`}
            />
          </button>

          {/* Custom dropdown menu */}
          {isDropdownOpen && !disabled && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DDDDDD] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
              {options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className={`w-full px-3 py-2 text-left text-[12px] hover:bg-gray-50 cursor-pointer ${
                    selectedValue === opt
                      ? "bg-orange-50 text-orange-500"
                      : "text-[#222]"
                  } ${i === 0 ? "rounded-t-xl" : ""} ${
                    i === options.length - 1 ? "rounded-b-xl" : ""
                  }`}
                  onClick={() => handleSelectChange(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <span
        className={`bg-white absolute left-3 -top-2 py-0 px-1.5 text-[12px] font-normal leading-4 ${
          disabled ? "text-gray-400" : "text-[#22222299]"
        } z-10 ${spanClassName || ""}`}
      >
        {title}
      </span>

      {type === "password" && !disabled && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};

export default Input;