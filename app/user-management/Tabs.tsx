"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion , AnimatePresence } from "framer-motion";
import PrimaryBtn from "../ui/buttons/PrimaryBtn";
import EditDrawer from "./admin/EditDrawer";



interface Tab {
  label: string;
  // icon: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  handleOpenDrawer?: () => void; // Add this prop
}

  


const Tabs: React.FC<TabsProps> = ({ 
  
  tabs, 
  activeTab, 
  setActiveTab, 
  handleOpenDrawer
}) => {

  const [ isEditDrawerOpen , setIsEditDrawerOpen ] = useState(false);


  const openDetail = ()=> {
    setIsEditDrawerOpen(true)
  }



  return (
    <div className="flex justify-between w-full items-center">
      <div
        className="
          relative flex p-1.5 items-center gap-3  max-w-fit  rounded-xl bg-gray-100 w-full
          overflow-x-auto overflow-y-hidden
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
              {/* <Image
                src={tab.icon}
                alt={tab.label}
                width={20}
                height={20}
                className="object-contain"
              /> */}
              {/* {tab.icon} */}
              <span
                className={`font-normal heading-6 ${
                  activeTab === index ? "text-[#111827]" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Button container - only show when activeTab is 1 (2nd tab) */}
      <div className={activeTab === 1 ? "block" : "hidden"}>
        <PrimaryBtn 
          label="Add Admin" 
          onClick={openDetail} 
        />
      </div>

      <AnimatePresence>
        {isEditDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditDrawerOpen(false)} // close on overlay click
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0  w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
             <EditDrawer onClose={()=>{setIsEditDrawerOpen(false)}} onSendEmail={()=>{setIsEditDrawerOpen(false)}} />
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </div>
  );
};

export default Tabs;