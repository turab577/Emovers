"use client";

import { useState } from "react";
import PrimaryBtn from "../ui/buttons/PrimaryBtn";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CompaignsTable from "./CompaignsTable";
import Drawer from "./drawer/page";

const Compaigns = () => {

  const stats = [
    {
      id : 1,
      value :"20",
      title : "Total campaigns",
      img : "/images/card1.svg"
    },
    {
      id : 2,
      value :"12",
      title : "Active campaigns",
      img : "/images/card1.svg"
    },
    {
      id : 3,
      value :"4,998",
      title : "Leads reached",
      img : "/images/card3.svg"
    },
    {
      id : 4,
      value :"76%",
      title : "Reply rate",
      img : "/images/card4.svg"
    },
    {
      id : 5,
      value :"60%",
      title : "Conversion rate",
      img : "/images/card4.svg"
    },
   
  ]


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative space-y-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="space-y-2">
          <h1 className="heading-4 text-[#111827]">Campaigns dashboard</h1>
          <p className="heading-5 text-[#70747D]">
            Track your campaign performance and key engagement insights.
          </p>
        </div>

        <div className="flex mt-3 sm:mt-0 sm:items-end sm:justify-end">
          <PrimaryBtn
            variant="filled"
            label="Add new campaign"
            width="fit-content"
            imageSrc="/images/filled-arrow.svg"
            imagePosition="right"
            onClick={() => setIsDrawerOpen(true)}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {
          stats.map((stat)=>(
            <div key={stat.id} className="p-3 bg-[#F4F4F4] rounded-lg w-full ">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white custom-shadow rounded-lg ">
                <Image src={stat.img} alt={stat.title} height={24} width={24}/>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="heading-4 font-regular">{stat.value}</h4>
                  <p className="heading-7 font-regular text-[#70747D]">{stat.title}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {/* Table Section */}
      <div>
        <CompaignsTable setIsDrawerOpen={setIsDrawerOpen} />
      </div>

      {/* Overlay + Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 min-h-screen bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)} // close on overlay click
            />

      {/* Drawer */}
      <motion.div
        className="bg-white w-[91vw] md:w-[40vw] top-0 overflow-auto hide-scrollbar fixed right-0 h-full z-50 pb-5 rounded-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      >
        <Drawer />
      </motion.div>
    </>
  )}
</AnimatePresence>
    </div>
  );
};

export default Compaigns;
