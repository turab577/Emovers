"use client";
// import LightBtn from "@/app/ui/buttons/LightButton";
// import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
import Input from "@/app/ui/Input";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown } from "@/app/shared/Dropdown";
import EmailDrawer from "./email/EmailDrawer";

interface DropdownOption {
  value: string;
  label: string;
}



const Step2 = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  // Dropdown states
  const [followUpsOpen, setFollowUpsOpen] = useState(false);
  const [followUpIntervalOpen, setFollowUpIntervalOpen] = useState(false);
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  
  // Selected values
  const [selectedFollowUps, setSelectedFollowUps] = useState("");
  const [selectedFollowUpInterval, setSelectedFollowUpInterval] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");

  // Refs
  const datePickerRef = useRef<DatePicker | null>(null);
  const timeInputRef = useRef<HTMLInputElement | null>(null);
  const followUpsRef = useRef<HTMLDivElement>(null);
  const followUpIntervalRef = useRef<HTMLDivElement>(null);
  const frequencyRef = useRef<HTMLDivElement>(null);

  // Dropdown options
  const followUpsOptions: DropdownOption[] = [
    { value: "1", label: "1 Follow-up" },
    { value: "2", label: "2 Follow-ups" },
    { value: "3", label: "3 Follow-ups" },
    { value: "4", label: "4 Follow-ups" },
    { value: "5", label: "5 Follow-ups" },
  ];

  const followUpIntervalOptions: DropdownOption[] = [
    { value: "1-day", label: "1 Day" },
    { value: "2-days", label: "2 Days" },
    { value: "3-days", label: "3 Days" },
    { value: "1-week", label: "1 Week" },
    { value: "2-weeks", label: "2 Weeks" },
  ];

  const frequencyOptions: DropdownOption[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (followUpsRef.current && !followUpsRef.current.contains(event.target as Node)) {
        setFollowUpsOpen(false);
      }
      if (followUpIntervalRef.current && !followUpIntervalRef.current.contains(event.target as Node)) {
        setFollowUpIntervalOpen(false);
      }
      if (frequencyRef.current && !frequencyRef.current.contains(event.target as Node)) {
        setFrequencyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateInputClick = () => {
    datePickerRef.current?.setFocus();
  };

  const handleTimeInputClick = () => {
    if (timeInputRef.current) {
      timeInputRef.current.click();
      timeInputRef.current.focus();
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Dropdown component
  // const Dropdown = ({ 
  //   isOpen, 
  //   onToggle, 
  //   options, 
  //   selectedValue, 
  //   onSelect, 
  //   placeholder,
  //   ref 
  // }: {
  //   isOpen: boolean;
  //   onToggle: () => void;
  //   options: DropdownOption[];
  //   selectedValue: string;
  //   onSelect: (value: string) => void;
  //   placeholder: string;
  //   ref: React.RefObject<HTMLDivElement>;
  // }) => {
  //   const selectedOption = options.find(opt => opt.value === selectedValue);

  //   return (
  //     <div ref={ref} className="relative">
  //       <div
  //         onClick={onToggle}
  //         className="cursor-pointer"
  //       >
  //         <Input
  //           title={placeholder}
  //           placeholder={placeholder}
  //           className="w-full cursor-pointer"
  //           value={selectedOption?.label || ""}
  //           readOnly
  //         />
  //       </div>
  //       <Image 
  //         src='/images/dropdown.svg' 
  //         alt="Dropdown" 
  //         width={20} 
  //         height={20} 
  //         className="absolute top-4 right-3 pointer-events-none"
  //       />

  //       {/* Dropdown Menu */}
  //       {isOpen && (
  //         <div className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-lg z-10 mt-1 border border-gray-100">
  //           {options.map((option) => (
  //             <div
  //               key={option.value}
  //               onClick={() => {
  //                 onSelect(option.value);
  //                 onToggle();
  //               }}
  //               className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
  //             >
  //               <span className="text-sm text-gray-900">{option.label}</span>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <div className="space-y-8 pt-8">
      <div className="space-y-6">
        <h1 className="font-medium body-3 text-[#111827]">Email setup</h1>
        <div>
          <div
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center cursor-pointer gap-3 p-3 bg-[#FEEFE4] border border-transparent hover:border-[#f8a86f] rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.10) inset]"
          >
            <Image
              src="/images/select-template.svg"
              width={48}
              height={48}
              alt="check"
            />
            <div className="flex justify-between w-full items-center">
              <div className="space-y-1">
                <h2 className="heading-5 text-[#111827]">Select template</h2>
                <p className="body-4 text-[#70747D]">
                  Choose from your saved email templates to get started quickly.
                </p>
              </div>
              <div className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="#F87B1B"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h1 className="font-medium body-3 text-[#111827]">Schedule</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date Picker */}
          <div className="relative">
            <div onClick={handleDateInputClick} className="cursor-pointer">
              <Input
                title="Start date"
                placeholder="Choose date"
                className="w-full cursor-pointer"
                value={startDate ? startDate.toLocaleDateString() : ""}
                readOnly
              />
            </div>
            <DatePicker
              ref={datePickerRef}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Enter Start date"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              wrapperClassName="w-full"
            />
            <Image
              src="/images/calender.svg"
              alt="Select date"
              height={20}
              width={20}
              className="absolute top-3 right-3 pointer-events-none"
            />
          </div>

          {/* Time Picker */}
          <div onClick={() => timeInputRef.current?.showPicker()} className="relative">
            <div
              
              className="cursor-pointer"
            >
              <Input
                title="Start time"
                placeholder="Choose time"
                className="w-full cursor-pointer"
                value={formatTimeForDisplay(selectedTime)}
                readOnly
              />
            </div>
            <input
              ref={timeInputRef}
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Image
              src="/images/clock.svg"
              alt="Select time"
              height={20}
              width={20}
              className="absolute top-3 right-3 pointer-events-none"
            />
          </div>

          {/* Follow-ups Dropdown */}
          <Dropdown
            isOpen={followUpsOpen}
            onToggle={() => setFollowUpsOpen(!followUpsOpen)}
            options={followUpsOptions}
            selectedValue={selectedFollowUps}
            onSelect={setSelectedFollowUps}
            placeholder="Choose Follow-ups"
            ref={followUpsRef}
          />

          {/* Follow-up Interval Dropdown */}
          <Dropdown
            isOpen={followUpIntervalOpen}
            onToggle={() => setFollowUpIntervalOpen(!followUpIntervalOpen)}
            options={followUpIntervalOptions}
            selectedValue={selectedFollowUpInterval}
            onSelect={setSelectedFollowUpInterval}
            placeholder="Choose Follow-up interval"
            ref={followUpIntervalRef}
          />
        </div>

        {/* Frequency Dropdown */}
        <Dropdown
          isOpen={frequencyOpen}
          onToggle={() => setFrequencyOpen(!frequencyOpen)}
          options={frequencyOptions}
          selectedValue={selectedFrequency}
          onSelect={setSelectedFrequency}
          placeholder="Choose Frequency"
          ref={frequencyRef}
        />
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 w-[91vw] md:w-[40vw] h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg  p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
             <EmailDrawer onSendEmail={()=>setIsDrawerOpen(false)}/>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Step2;