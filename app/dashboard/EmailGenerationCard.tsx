"use client";
import React from "react";
import Image from "next/image";
import PrimaryBtn from "../ui/buttons/PrimaryBtn";

const EmailGenerationCard = () => {
  return (
    <div className="bg-gray-50 flex items-center justify-center">
      <div className="w-full h-auto min-h-[272px] bg-[#11224E] rounded-lg p-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          <div className="flex flex-col justify-between h-full flex-1 z-10 w-full md:w-auto">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="heading-4 text-white mb-1 font-medium w-full md:max-w-[217px] mx-auto md:mx-0">
                Generate professional emails instantly with AI assistance
              </h1>
              <p className="text-[#FFFFFFCC] heading-7 mb-4 md:mb-15 w-full md:whitespace-nowrap">
                Create personalized, well-crafted emails{" "}
                <br className="hidden md:block" /> 
                in seconds — no writing experience{" "}
                <br className="hidden md:block" /> 
                needed.
              </p>
            </div>
            <div className="max-w-fit mx-auto md:mx-0">
              <PrimaryBtn
                variant="outlined"
                label="Generate email"
                width="100%"
                imageSrc="/images/outlined-arrow.svg"
                imagePosition="right"
                color="#FFFFFF"
              />
            </div>
          </div>

          <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto mt-4 md:mt-0">
            <Image
              src="/images/email-illustration.png"
              alt="Email generation illustration"
              width={272}
              height={188}
              className="max-w-[280px] md:max-w-[118%] h-auto md:h-[234px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailGenerationCard;