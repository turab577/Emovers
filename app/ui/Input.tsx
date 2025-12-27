import React, { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Using lucide-react icons

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  spanClassName?: string;
}

const Input: React.FC<InputProps> = ({
  title,
  className,
  spanClassName,
  type,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Determine input type
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      <input
        {...rest}
        type={inputType}
        className={`text-[#222222] text-[12px] font-medium leading-4 border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-orange-500 focus:ring-offset-1 px-3 py-4 bg-white ${
          className || ""
        }`}
      />

      <span
        className={`bg-white absolute left-3 -top-2 py-0 px-1.5 text-[12px] font-normal leading-4 text-[#22222299] ${
          spanClassName || ""
        }`}
      >
        {title}
      </span>

      {/* Show eye icon only for password fields */}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};

export default Input;
