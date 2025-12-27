"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#F6F6F6] text-[#70747D] text-[12px] font-normal hover:bg-[#e2dddd] focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <span>{value || label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-fit rounded-xl bg-[#FFFFFF99] shadow-2xl z-50">
          <ul className="max-h-56 overflow-y-auto">
            {options.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`px-4 py-2.5 cursor-pointer text-[#222222] body-4 font-medium flex items-center gap-2.5 tracking-[0.42px] bg-white rounded-lg hover:bg-orange-50 hover:text-orange-600 transition ${
                  value === opt
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : ""
                }`}
              >
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
