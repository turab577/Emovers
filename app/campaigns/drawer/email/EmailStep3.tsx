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
// import EmailDrawer from "./email/EmailDrawer";

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

  // New state to control template section visibility
  const [showTemplateSection, setShowTemplateSection] = useState(true);

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

  const handleCancelTemplate = () => {
    setShowTemplateSection(false);
  };

  return (
    <div className="space-y-8">
        <div className="space-y-1">
            <p className="body-1 font-medium text-[#111827]">Add new campaign</p>
            <p className="heading-6 font-regular text-[#70747D]">Create and launch a new campaign to reach your leads with personalized AI-powered emails.</p>
        </div>
      
      {/* Template Section with AnimatePresence for smooth disappearance */}
      <AnimatePresence>
        {showTemplateSection && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            <div className="flex w-full justify-between">
              <h1 className="font-medium body-3 text-[#111827]">Email setup</h1>
              <p className="heading-6 font-regular text-[#F87B1B] underline cursor-pointer">Replace template</p>
            </div>
            <div className="relative">
              <div
                className="flex items-center cursor-pointer gap-3 p-3 bg-[#ECFDF2] border border-transparent hover:border-[#f8a86f] rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.10) inset]"
              >
                <div className="bg-white custom-shadow rounded-lg p-3">
                  <Image
                    src="/images/template.svg"
                    width={24}
                    height={24}
                    alt="check"
                  />
                </div>
                <div className="flex justify-between w-full items-start">
                  <div className="space-y-1">
                    <h2 className="heading-5 text-[#111827]">Welcome email</h2>
                    <p className="body-4 text-[#70747D] max-w-[420px]">
                      You are completely free to keep this template as your email template or cancel this template and select a new one.
                    </p>
                  </div>
                  <Image src='/images/file-search.svg' alt="Search file" width={24} height={24} />
                </div>
                {/* Cancel Button */}
                <button 
                  onClick={handleCancelTemplate}
                  className="absolute -right-1 -top-3 p-1 cursor-pointer rounded-full z-9999 transition-colors"
                >
                  <Image 
                    src='/images/cancel.svg' 
                    alt="Cancel" 
                    height={23} 
                    width={23} 
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
};

export default Step2;