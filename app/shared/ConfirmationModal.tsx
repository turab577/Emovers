import React from "react";
import PrimaryBtn from "../ui/buttons/PrimaryBtn";
import Image from "next/image";

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
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full p-5 relative animate-fadeIn">
        {/* Icon */}

        <div className="flex items-center justify-center mb-5">
          {icon && (
            <Image src={`${icon}`} width={140} height={140} alt="icon" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#111827] text-center mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-[#6B7280] text-center mb-10 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <PrimaryBtn
            variant="soft"
            label={cancelText}
            width="100%"
            imageSrc="/images/back-arrow.svg"
            imagePosition="left"
            onClick={onClose}
          />
          <PrimaryBtn
            variant="filled"
            label={confirmText}
            width="100%"
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
    </div>
  );
};

export default ConfirmationModal;
