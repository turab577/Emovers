"use client";

import React, { useState } from "react";
import Input from "../../ui/Input";
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
import AuthHeader from "../register/AuthHeader";
import { useRouter } from "next/navigation";

const NewPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      newPassword: "",
      confirmPassword: ""
    };

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !newErrors.newPassword && !newErrors.confirmPassword;
  };

  const handleResetPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you can add your reset password API call logic
      console.log("Resetting password...");
      router.push('/')
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Auth Header */}
      <AuthHeader
        rightText="Remember your password?"
        rightLinkText="Login"
        rightLinkHref="/login"
      />

      <div className="w-full flex flex-col items-center justify-center lg:px-24 md:px-10 px-4">
        <div className="flex flex-col items-center text-center sm:mt-[87px] mt-[50px]">
          <h1 className="heading-1 mb-3 font-medium text-[#111827] text-center">
            Create new password
          </h1>
          <p className="text-[#70747D] body-2 sm:mb-[60px] mb-[30px] max-w-[334px] text-center">
            Set a strong new password to secure your account and continue.
          </p>
        </div>

        <form className="flex flex-col sm:gap-8 gap-4 w-full">
          {/* New Password Field */}
          <div className="flex flex-col">
            <Input
              title="New password"
              name="newPassword"
              type="password"
              placeholder="Enter password"
              className="w-full"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
            {errors.newPassword && (
              <span className="text-red-500 text-sm mt-1">{errors.newPassword}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col">
            <Input
              title="Confirm new password"
              name="confirmPassword"
              type="password"
              placeholder="Enter confirm password"
              className="w-full"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm mt-1">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="sm:mt-7 mt-0 sm:mb-[60px] mb-5">
            <PrimaryBtn
              variant="filled"
              label="Reset password"
              width="100%"
              imageSrc="/images/filled-arrow.svg"
              imagePosition="right"
              onClick={handleResetPassword}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;