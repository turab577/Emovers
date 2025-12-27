"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Tab {
  label: string;
  icon: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div
      className="
        relative flex p-1.5 items-center gap-3 rounded-xl bg-gray-100 w-full
        overflow-x-auto md:overflow-hidden scrollbar-hide
      "
    >
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className="relative flex shrink-0 px-4 py-2 justify-center items-center rounded-lg cursor-pointer gap-2"
        >
          {/* Animated active background */}
          {activeTab === index && (
            <motion.div
              layoutId="active-tab-bg"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.5,
              }}
            />
          )}

          {/* Tab content */}
          <div className="relative flex items-center gap-2 z-10 transition-all duration-300">
            <Image
              src={tab.icon}
              alt={tab.label}
              width={20}
              height={20}
              className="object-contain"
            />
            <span
              className={` font-normal heading-6  ${
                activeTab === index ? "text-[#111827]" : "text-gray-400"
              }`}
            >
              {tab.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
