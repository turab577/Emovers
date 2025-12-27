"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthHeaderProps {
  rightText: string;
  rightLinkText: string;
  rightLinkHref: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  rightText,
  rightLinkText,
  rightLinkHref,
}) => {
  return (
    <div className="w-full flex flex-wrap justify-between items-center sm:p-5 p-3 bg-white">
      {/* Left Side: Logo + Text */}
      <div className="flex items-center gap-2">
        <Image
          src="/images/full-logo.svg"
          alt="AppointMe Logo"
          width={160}
          height={35}
        />
      </div>

      {/* Right Side: Text + Link */}
      <div className="heading-5 text-[#70747D] -mt-[17px] whitespace-nowrap sm:whitespace-normal sm:mt-0 mt-2">
        {rightText}{" "}
        <Link href={rightLinkHref} className="text-[#F87B1B] hover:underline">
          {rightLinkText}
        </Link>
      </div>
    </div>
  );
};

export default AuthHeader;
