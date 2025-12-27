"use client";

import React, { useState } from "react";
import Input from "../../ui/Input";
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
import AuthHeader from "./AuthHeader";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

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
      email: "",
      password: ""
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleCreateAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you can add your registration API call logic
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Auth Header */}
      <AuthHeader
        rightText="Have an account?"
        rightLinkText="Login"
        rightLinkHref="/login"
      />

      <div className="w-full flex flex-col items-center justify-center lg:px-24 md:px-10 px-4">
        <div className="text-center sm:mt-[87px] mt-[9px]">
          <h1 className="heading-1 mb-3 font-medium text-[#111827]">
            Create your account
          </h1>
          <p className="text-[#70747D] body-2 sm:mb-[60px] mb-[30px]">
            Join us today and unlock your personalized experience.
          </p>
        </div>

        <form className="flex flex-col sm:gap-8 gap-4 w-full">
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

          {/* Password Field */}
          <div className="flex flex-col">
            <Input
              title="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              className="w-full"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">{errors.password}</span>
            )}
          </div>

          <div className="sm:mt-7 mt-0 sm:mb-[60px] mb-5">
            <PrimaryBtn
              variant="filled"
              label="Create account"
              width="100%"
              imageSrc="/images/filled-arrow.svg"
              imagePosition="right"
              onClick={handleCreateAccount}
            />
          </div>
        </form>

        <div className="flex items-center w-full sm:mb-[60px] mb-5">
          <hr className="flex-1 border-[#D7D7D7]" />
          <span className="px-5 font-normal text-[#70747D] body-3">
            Or continue with
          </span>
          <hr className="flex-1 border-[#D7D7D7]" />
        </div>

        <div className="flex justify-center sm:gap-6 gap-3 mb-5">
          {/* Google Login */}
          <div className="flex flex-col items-center sm:gap-3 gap-1">
            <button
              onClick={() => signIn("google")}
              className="sm:p-4 p-2 rounded-xl bg-[#F4F4F4] flex items-center justify-center"
            >
              <img
                src="/images/google-auth.svg"
                alt="Google"
                width={24}
                height={24}
              />
            </button>
            <span className="body-3 font-normal text-[#70747D]">Google</span>
          </div>

          {/* Outlook Login */}
          <div className="flex flex-col items-center sm:gap-3 gap-1">
            <button
              onClick={() => signIn("azure-ad")}
              className="sm:p-4 p-2 rounded-xl bg-[#F4F4F4] flex items-center justify-center"
            >
              <img
                src="/images/outlook-auth.svg"
                alt="Outlook"
                width={24}
                height={24}
              />
            </button>
            <span className="body-3 font-normal text-[#70747D]">Outlook</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;