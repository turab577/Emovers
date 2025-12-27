"use client";

import React, { useState, useEffect } from "react";
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
import AuthHeader from "../register/AuthHeader";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(120);


  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      const numericValue = value.replace(/[^0-9]/g, "");
      newOtp[index] = numericValue;
      setOtp(newOtp);
      setError("");
      if (numericValue && index < 5) {
        const nextInput = document.getElementById(
          `otp-${index + 1}`
        ) as HTMLInputElement;
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const showResend = timeLeft <= 0;

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleResend = () => {
    toast.success("OTP has been resent");
    setTimeLeft(120);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpComplete = otp.every((digit) => digit !== "");
    if (!otpComplete) {
      setError("Please enter all 6 digits");
      return;
    }

    console.log("Entered OTP:", otp.join(""));
    toast.success("OTP Verified!");

    setTimeout(() => {
      router.push("/new-password");
    }, 1000);
  };

  return (
    <div className="flex flex-col  w-full">
      <AuthHeader
        rightText="Remember your password?"
        rightLinkText="Login"
        rightLinkHref="/login"
      />

      <div className="w-full  flex flex-col items-center justify-center sm:my-[138px] my-[50px] sm:px-15 px-4 ">
        <div className="text-center ">
          <h1 className="heading-1 mb-3 font-medium text-[#111827]">
            Forgot password{" "}
          </h1>
          <p className="text-[#70747D] body-2 sm:mb-[60px] mb-[30px] w-full max-w-[482px]">
            We've sent a verification code to your email address. Please enter
            it below to continue.{" "}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <div className="flex justify-center sm:gap-3 gap-2 sm:mb-10 mb-5">
            {otp.map((digit, index) => (
              <div key={index} className="relative">
                <input
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  maxLength={1}
                  className={`lg:w-[75px] md:w-[55px] w-10 md:h-11 lg:h-16 h-8 text-center text-lg rounded-[34px] bg-[#F4F4F5] border border-[rgba(255,255,255,0.08)] focus:outline-none focus:ring-2 focus:ring-[#11224E] text-[#111827]`}
                />
                {digit === "" && (
                  <span className="absolute inset-0 flex items-center justify-center text-lg text-[#111827] opacity-50 pointer-events-none">
                    0
                  </span>
                )}
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <p className="text-[#111827] text-center font-semibold text-[18px]">
            {formatTime(timeLeft)}
          </p>

          <div className="text-center mt-10">
            <button
              type="button"
              onClick={handleResend}
              disabled={!showResend}
              className={`underline ${
                showResend
                  ? "text-[#F87B1B] cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Resend Code
            </button>
          </div>

          <div className="sm:mt-[60px] mt-8 ">
            <PrimaryBtn
              variant="filled"
              label="Verify"
              width="100%"
              imageSrc="/images/filled-arrow.svg"
              imagePosition="right"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;