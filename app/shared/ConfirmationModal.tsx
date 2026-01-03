import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import PrimaryBtn from "../ui/buttons/PrimaryBtn";
import Image from "next/image";
import Input from "../ui/Input"; // Import your custom Input component

interface PaymentRecord {
  label: string;
  value: string;
  bgColor?: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  type?: "danger" | "warning" | "info";
  // New props
  showInput?: boolean;
  inputPlaceholder?: string;
  inputLabel?: string;
  inputType?: "text" | "password" | "email" | "number";
  inputAs?: "input" | "select";
  inputOptions?: string[];
  paymentRecords?: PaymentRecord[];
  highlightText?: string;
  // Input props
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputDisabled?: boolean;
  // Close on overlay click
  closeOnOverlayClick?: boolean;
  messageWidth?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Go back",
  icon,
  messageWidth = "",
  showInput = false,
  inputPlaceholder = "Enter details",
  inputLabel = "Card details",
  inputType = "text",
  inputAs = "input",
  inputOptions = [],
  paymentRecords = [],
  highlightText,
  // Input props
  inputValue = "",
  onInputChange,
  inputDisabled = false,
  closeOnOverlayClick = true, // Default to true
}) => {
  const [localInputValue, setLocalInputValue] = useState(inputValue);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle input changes
  const handleInputChange = (value: string) => {
    setLocalInputValue(value);
    onInputChange?.(value);
  };

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;

    // Check if click is on the overlay (not the modal content)
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Function to highlight specific text in message
  const renderMessage = () => {
    if (!highlightText) return message;

    const parts = message.split(highlightText);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="text-[#F87B1B]  heading-7 font-normal">
                {highlightText}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  // Create base input props
  const baseInputProps = {
    title: inputLabel,
    placeholder: inputPlaceholder,
    value: localInputValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      handleInputChange(e.target.value),
    disabled: inputDisabled,
    className: "w-full",
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl max-w-md w-[89%] sm:w-full p-5 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to overlay
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-5">
          {icon && (
            <Image src={`${icon}`} width={140} height={140} alt="icon" />
          )}
        </div>

        {/* Title */}
        <h2 className="heading-5 font-medium text-[#11224E] text-center mb-2">
          {title}
        </h2>

        {/* Message */}
        <p
          className="heading-7 font-normal w-full max-w-[250px] mx-auto  text-[#70747D] text-center mb-6 leading-relaxed"
          style={{ maxWidth: messageWidth || "250px" }}
        >
          {renderMessage()}
        </p>

        {/* Payment Records */}
        {paymentRecords.length > 0 && (
          <div className="mb-5 space-y-3">
            {paymentRecords.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 rounded-lg"
                style={{ backgroundColor: record.bgColor || "#FEE5D1" }}
              >
                <span className="heading-7 font-medium text-[#11224E]">
                  {record.label}
                </span>
                <span className="heading-5 font-medium text-[#11224E]">
                  {record.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Input Field - UPDATED with proper conditional props */}
        {showInput && (
          <div className="mb-6">
            {inputAs === "select" ? (
              <Input as="select" options={inputOptions} {...baseInputProps} />
            ) : (
              <Input as="input" type={inputType} {...baseInputProps} />
            )}
          </div>
        )}

        {/* Action Buttons */}
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {cancelText && (
            <PrimaryBtn
              // fontSize="12px"
              variant="soft"
              label={cancelText}
              imageSrc="/images/back-arrow.svg"
              imagePosition="left"
              onClick={onClose}
            />
          )}
          <PrimaryBtn
            // fontSize="12px"
            variant="filled"
            label={confirmText}
            imageSrc="/images/filled-arrow.svg"
            imagePosition="right"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
