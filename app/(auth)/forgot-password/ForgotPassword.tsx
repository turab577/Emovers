"use client";

import React, { useState } from "react";
import Input from "../../ui/Input"; 
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
import AuthHeader from "../register/AuthHeader"; 
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: ""
  });
  const [errors, setErrors] = useState({
    email: ""
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
      email: ""
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);
    return !newErrors.email;
  };

  const handleSendLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you can add your forgot password API call logic
      console.log("Sending reset link to:", formData.email);
      router.push('/otp')
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
        <div className="text-center sm:mt-[87px] mt-[50px]">
          <h1 className="heading-1 mb-3 font-medium text-[#111827]">
            Forgot password
          </h1>
          <p className="text-[#70747D] body-2 sm:mb-[60px] mb-[30px]">
            Recover access to your account in a few simple steps.{" "}
          </p>
        </div>
        <form className="flex flex-col gap-8 w-full">
          {/* Email Field */}
          <div className="flex flex-col">
            <Input
              title="Email"
              name="email"
              type="email"
              placeholder="Enter email"
              className="w-full"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email}</span>
            )}
          </div>
          <div className="sm:mt-7 mt-0 sm:mb-[60px] mb-[30px]">
            <PrimaryBtn
              variant="filled"
              label="Send link"
              width="100%"
              imageSrc="/images/filled-arrow.svg"
              imagePosition="right"
              onClick={handleSendLink}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;