"use client";
import React from "react";
import Image from "next/image";
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";

export default function AnimationSection() {
  return (
    <div className="h-full relative flex items-center justify-center w-full">
      {/* 🔹 Video covering full container */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/images/Login-gif.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Main Content - Changed justify-between to justify-center */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-8">
        <div className="w-full max-w-6xl flex flex-col items-center -mt-[5px]">
          {/* Main Card */}
          <div className="relative bg-[rgba(255,255,255,0.12)] shadow-[0_4px_40px_0_rgba(248,123,27,0.20)] rounded-lg p-6 max-w-[449px] h-[272px] flex flex-col justify-between mx-auto">
            {/* Heading */}
            <h2 className="text-white heading-2 font-medium w-full max-w-[300px]">
              Generate AI-powered emails instantly
            </h2>

            {/* Text */}
            <p className="text-[#FFFFFFCC] text-sm leading-relaxed mt-2 w-full max-w-[300px]">
              Create personalized, well-crafted emails in seconds no writing
              experience needed.{" "}
            </p>

            {/* Bottom Row: Button + Image */}
            <div className="flex items-center justify-between mt-auto">
              <div className="mt-8">
                <PrimaryBtn
                  variant="filled"
                  label="Generate Email"
                  width="fit-content"
                  imageSrc="/images/filled-arrow.svg"
                  imagePosition="right"
                />
              </div>
              <Image
                src="/images/auth-image.png"
                alt="Email generation illustration"
                width={220}
                height={220}
                className="object-contain -mt-16 -mr-8"
              />
            </div>
          </div>

          {/* Bottom Text - Added mt-8 for 32px space (close to 30px) */}
          <div className="text-center w-full mt-10">
            <h3 className="text-[32px] leading-9 font-normal text-white  mb-2">
              Grow leads faster and smarter
            </h3>
            <p className="text-[32px] leading-9 font-normal text-white ">
              with intelligent{" "}
              <span className="text-[#F99549]">automation</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}