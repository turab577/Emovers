"use client";
import LightBtn from "@/app/ui/buttons/LightButton";
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
// import SecondaryBtn from '@/app/ui/buttons/SecondaryBtn'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ConfirmationModal from "@/app/shared/ConfirmationModal";

// Define props interface
interface ParentProps {
  onLaunchCampaign?: () => void;
}

export default function Parent({ onLaunchCampaign }: ParentProps) {
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, or 3
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Campaign setup",
      description:
        "Set up your campaign name, objectives, and basic configuration",
    },
    {
      id: 2,
      title: "Schedule campaign",
      description: "Choose your target audience and create email content",
    },
    {
      id: 3,
      title: "Review & Launch",
      description: "Review all settings and launch your campaign",
    },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // This is the last step - open confirmation modal
      setIsConfirmationModalOpen(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle launch campaign action
  const handleLaunchCampaign = () => {
    setIsConfirmationModalOpen(false);
  
    onLaunchCampaign?.(); // Call the prop function if provided
  };

  // Handle cancel launch
  const handleCancelLaunch = () => {
    setIsConfirmationModalOpen(false);
    // You can add any additional cancel logic here
  };

  const getStepState = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  const getStepStyles = (stepId: number) => {
    const state = getStepState(stepId);
    switch (state) {
      case "completed":
        return {
          bg: "bg-[#11224E]",
          border: "border-[#ECEDF1]",
          textColor: "text-[#11224E]",
        };
      case "active":
        return {
          bg: "bg-[#F87B1B]",
          border: "border-[#FEF4ED]",
          textColor: "text-[#11224E]",
        };
      case "pending":
        return {
          bg: "bg-[#A0A3A9]",
          border: "border-[#E2E3E5]",
          textColor: "text-[#A0A3A9]",
        };
      default:
        return {
          bg: "bg-[#A0A3A9]",
          border: "border-[#E2E3E5]",
          textColor: "text-[#A0A3A9]",
        };
    }
  };

  // Animation for content - using direct props instead of variants
  const contentAnimation = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex justify-center"
          >
            <Step1 />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Step2 />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className=" "
          >
            <Step3/>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full h-screen py-5 px-5 ">
      {/* Header Section */}
      <div className="space-y-8">
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="body-1 font-medium text-[#111827]">Add new campaign</p>
          <p className="body-4 font-regular text-[#70747D] max-w-[540px]">
            Create and launch a new campaign to reach your leads with
            personalized AI-powered emails.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center gap-5 pr-5">
          {steps.map((step, index) => {
            const styles = getStepStyles(step.id);
            const isLastStep = index === steps.length - 1;
            const state = getStepState(step.id);

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-3 flex-1">
                  <motion.div
                    className={`rounded-full ${styles.bg} w-[30px] h-[30px] border-[6px] ${styles.border}`}
                    initial={{ scale: 1 }}
                    animate={
                      state === "active" ? { scale: [1, 1.1, 1] } : { scale: 1 }
                    }
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  <motion.p
                    className={`heading-7 font-medium w-[124%] text-center ${styles.textColor}`}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.title}
                  </motion.p>
                </div>
                {!isLastStep && (
                  <div className="h-0.5 w-full bg-[#E2E3E5] relative overflow-hidden">
                    {step.id < currentStep && (
                      <motion.div
                        className="h-full bg-[#11224E] absolute top-0 left-0"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isConfirmationModalOpen}
        onConfirm={handleLaunchCampaign}
        onClose={handleCancelLaunch}
        confirmText="Launch campaign"
        cancelText="Go back"
        icon="/images/delete.png"
        title="Launch this campaign?"
        message="This campaign will be launched and will not be editable"
      />

      {/* Content Area */}
      <div className=" flex flex-col justify-center max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
      </div>

      {/* Buttons Section */}
      <motion.div 
        className="flex gap-3 pt-6 pr-5 pb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <LightBtn
          label="Go back"
          imagePosition="left"
          imageSrc="/images/arrow-left.svg"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        />
        <PrimaryBtn
          label={currentStep === 3 ? "Launch Campaign" : "Next"}
          imagePosition="right"
          imageSrc="/images/arrow-right.svg"
          onClick={handleNext}
        />
      </motion.div>
    </div>
  );
}