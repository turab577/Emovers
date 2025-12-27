import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import HeatMapGraph from "./HeatMapGraph";
import EmailGenerationCard from "./EmailGenerationCard";

const Dashboard = () => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h1 className="heading-2 text-[#111827] ">Welcome, Alex</h1>
        <p className="heading-5 text-[#70747D]">
          Monitor your outreach performance and key engagement metrics.
        </p>
      </div>
      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
        <div className="p-4 bg-[#F4F4F4] rounded-lg space-y-3 w-full">
          <div className="flex items-start justify-between">
            <div className="bg-white rounded-lg p-2 shadow-[0_4px_8px_0_rgba(0,0,0,0.12)]">
              <Image
                src="/images/rocket.svg"
                width={20}
                height={20}
                alt="rocket"
              />
            </div>
            <Link
              href="/campaigns"
              className="text-[#70747D] body-5 font-normal flex items-center gap-1"
            >
              View details
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="heading-4 font-normal text-[#111827] ">24</h1>
            <p className="text-[#70747D] body-5 font-normal">
              Active campaigns
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#F4F4F4] rounded-lg space-y-3 w-full">
          <div className="flex items-start justify-between">
            <div className="bg-white rounded-lg p-2 shadow-[0_4px_8px_0_rgba(0,0,0,0.12)]">
              <Image
                src="/images/mail-plus.svg"
                width={20}
                height={20}
                alt="rocket"
              />
            </div>
            <Link
              href="/emails"
              className="text-[#70747D] body-5 font-normal flex items-center gap-1"
            >
              View details
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="heading-4 font-normal text-[#111827] ">120</h1>
            <p className="text-[#70747D] body-5 font-normal">Emails send</p>
          </div>
        </div>

        <div className="p-4 bg-[#F4F4F4] rounded-lg space-y-3 w-full">
          <div className="flex items-start justify-between">
            <div className="bg-white rounded-lg p-2 shadow-[0_4px_8px_0_rgba(0,0,0,0.12)]">
              <Image
                src="/images/users.svg"
                width={20}
                height={20}
                alt="rocket"
              />
            </div>
            <Link
              href="/leads"
              className="text-[#70747D] body-5 font-normal flex items-center gap-1"
            >
              View details
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="heading-4 font-normal text-[#111827] ">60</h1>
            <p className="text-[#70747D] body-5 font-normal">Leads captured</p>
          </div>
        </div>

        <div className="p-4 bg-[#F4F4F4] rounded-lg space-y-3 w-full">
          <div className="flex items-start justify-between">
            <div className="bg-white rounded-lg p-2 shadow-[0_4px_8px_0_rgba(0,0,0,0.12)]">
              <Image
                src="/images/calendar-arrow-down.svg"
                width={20}
                height={20}
                alt="rocket"
              />
            </div>
            <Link
              href="/meetings"
              className="text-[#70747D] body-5 font-normal flex items-center gap-1"
            >
              View details
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="heading-4 font-normal text-[#111827] ">40</h1>
            <p className="text-[#70747D] body-5 font-normal">
              Meetings scheduled
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#F4F4F4] rounded-lg space-y-3 w-full">
          <div className="flex items-start justify-between">
            <div className="bg-white rounded-lg p-2 shadow-[0_4px_8px_0_rgba(0,0,0,0.12)]">
              <Image
                src="/images/star.svg"
                width={20}
                height={20}
                alt="rocket"
              />
            </div>
            <Link
              href="/campaigns"
              className="text-[#70747D] body-5 font-normal flex items-center gap-1"
            >
              View details
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-1">
            <h1 className="heading-4 font-normal text-[#111827] ">76%</h1>
            <p className="text-[#70747D] body-5 font-normal">Response rate</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 gap-y-4 w-full items-center">
        {/* Left Side - HeatMapGraph */}
        <div className="lg:col-span-7 w-full">
          <div className="overflow-x-auto sm:overflow-visible">
            <div className="min-w-[600px] sm:min-w-0">
              <HeatMapGraph />
            </div>
          </div>
        </div>
        {/* Right Side - EmailGenerationCard */}
        <div className="lg:col-span-5">
          <EmailGenerationCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
