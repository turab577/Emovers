import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EmailStep1 from './EmailStep1'
import EmailStep2 from './EmailStep2'
import EmailStep3 from './EmailStep3'

// Define props interface
interface EmailDrawerProps {
  onSendEmail?: () => void;
}

export default function EmailDrawer({ onSendEmail }: EmailDrawerProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  const handleNext = () => {
    if (currentStep < 3) {
      setDirection(1)
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle the send email action
  const handleSendEmail = () => {
    console.log('Email sent!')
    onSendEmail?.() // Call the prop function if provided
  }

  // Faster animation variants for step content
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100, // Reduced distance
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100, // Reduced distance
      opacity: 0,
    })
  }

  // Faster animation variants for buttons
  const buttonVariants = {
    hidden: { opacity: 0, y: 10 }, // Reduced y movement
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.15, // Faster duration
        delay: 0.1 // Reduced delay
      }
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <EmailStep1 />
      case 2:
        return <EmailStep2 />
      case 3:
        return <EmailStep3 />
      default:
        return null
    }
  }

  const renderButtons = () => {
    if (currentStep === 1) {
      return (
        <motion.div 
          className="flex gap-3"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <LightBtn
            label="Go back"
            imageSrc="/images/arrow-left.svg"
            imagePosition="left"
            onClick={handleBack}
            disabled={true}
          />
          <PrimaryBtn
            label="Confirm"
            imageSrc="/images/arrow-right.svg"
            imagePosition="right"
            onClick={handleNext}
          />
        </motion.div>
      )
    } else if (currentStep === 2) {
      return (
        <motion.div 
          className="flex gap-3"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <LightBtn
            label="Go back"
            imageSrc="/images/arrow-left.svg"
            imagePosition="left"
            onClick={handleBack}
          />
          <PrimaryBtn
            label="Save"
            imageSrc="/images/arrow-right.svg"
            imagePosition="right"
            onClick={handleNext}
          />
        </motion.div>
      )
    } else if (currentStep === 3) {
      return (
        <motion.div 
          className="flex gap-3"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <LightBtn
            label="Go back"
            imageSrc="/images/arrow-left.svg"
            imagePosition="left"
            onClick={handleBack}
          />
          <PrimaryBtn
            label="Send email"
            imageSrc="/images/arrow-right.svg"
            imagePosition="right"
            onClick={handleSendEmail}
          />
        </motion.div>
      )
    }
  }

  return (
    <div>
      {/* Step Indicator */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: -10 }} // Reduced y movement
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }} // Faster duration
      >
        {/* Add your step indicator here if needed */}
      </motion.div>

      {/* Step Content with Faster Transitions */}
      <div className="relative overflow-hidden min-h-[200px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 }, // Faster spring
              opacity: { duration: 0.15 } // Faster opacity
            }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Buttons with minimal delay */}
      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }} // Faster fade in
      >
        {renderButtons()}
      </motion.div>
    </div>
  )
}