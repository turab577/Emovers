"use client";

import React, { useState } from "react";
import PrimaryBtn from "../ui/buttons/PrimaryBtn";
import PeopleTable from "./PeopleTable";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LightBtn from "../ui/buttons/LightButton";

const People = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative space-y-5">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="space-y-2">
          <h1 className="heading-4 text-[#111827]">People dashboard</h1>
          <p className="heading-5 text-[#70747D]">
            Get a clear snapshot of your lead performance and activity.
          </p>
        </div>

        <div className="flex items-end justify-end">
          <PrimaryBtn
            variant="filled"
            label="Add new lead"
            width="fit-content"
            imageSrc="/images/filled-arrow.svg"
            imagePosition="right"
            onClick={() => setIsDrawerOpen(true)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div>
        <PeopleTable setIsDrawerOpen={setIsDrawerOpen} />
      </div>

      {/* Overlay + Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)} // close on overlay click
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0  w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="heading-4 font-medium text-[#111827]">
                  Select email for Floyd Miles
                </h2>
              </div>

              <div>
                <p className="text-[#70747D] body-4 font-normal">
                  Compose and send personalized emails to your selected leads
                  instantly.
                </p>
              </div>

              <div className="py-8">
                <div>
                  <div className="relative">
                    <Image
                      src="/images/search-icon.svg"
                      width={20}
                      height={20}
                      alt="search"
                      className="absolute left-2 top-2 z-20"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      className={
                        "py-2 pr-2 pl-8 flex w-full items-center outline-none rounded-lg bg-white border border-[#11182714] text-[14px] font-normal leading-5"
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Welcome Email */}
                <div className="flex items-start gap-3 p-3 bg-[#ECFDF2] border border-transparent hover:border-[#0CD767] rounded-lg shadow-[0_4px_8px_0_rgba(0,112,127,0.04)]">
                  <Image
                    src="/images/wellcome-email.svg"
                    width={48}
                    height={48}
                    alt="check"
                  />
                  <div className="space-y-1">
                    <h2 className="heading-5 text-[#111827]">Welcome Email</h2>
                    <p className="body-4 text-[#70747D]">
                      Greet new subscribers with a personalized welcome message.
                      Introduce your brand, set expectations, and encourage them
                      to explore your platform or latest offerings.
                    </p>
                  </div>
                  <Image
                    src="/images/file-search.svg"
                    width={24}
                    height={24}
                    alt="view details"
                    className="cursor-pointer"
                  />
                </div>

                {/* Monthly Newsletter */}
                <div className="flex items-start gap-3 p-3 bg-[#FDF5EC] border border-transparent hover:border-[#f5ad5a] rounded-lg shadow-[0_4px_8px_0_rgba(0,112,127,0.04)]">
                  <Image
                    src="/images/monthly-newsletter.svg"
                    width={48}
                    height={48}
                    alt="newsletter"
                  />
                  <div className="space-y-1">
                    <h2 className="heading-5 text-[#111827]">
                      Monthly Newsletter
                    </h2>
                    <p className="body-4 text-[#70747D]">
                      Keep your audience updated with company news, product
                      launches, and helpful insights. Build stronger
                      relationships by sharing valuable content every month.
                    </p>
                  </div>
                  <Image
                    src="/images/file-search.svg"
                    width={24}
                    height={24}
                    alt="view details"
                    className="cursor-pointer"
                  />
                </div>

                {/* Invoice Reminder */}
                <div className="flex items-start gap-3 p-3 bg-[#ECFBFD] border border-transparent hover:border-[#5de6f8] rounded-lg shadow-[0_4px_8px_0_rgba(0,112,127,0.04)]">
                  <Image
                    src="/images/invoice-reminder.svg"
                    width={48}
                    height={48}
                    alt="invoice reminder"
                  />
                  <div className="space-y-1">
                    <h2 className="heading-5 text-[#111827]">
                      Invoice Reminder
                    </h2>
                    <p className="body-4 text-[#70747D]">
                      Automatically remind customers about pending or upcoming
                      payments. Maintain professionalism while ensuring timely
                      billing and smooth cash flow.
                    </p>
                  </div>
                  <Image
                    src="/images/file-search.svg"
                    width={24}
                    height={24}
                    alt="view details"
                    className="cursor-pointer"
                  />
                </div>

                {/* Re-engagement Campaign */}
                <div className="flex items-start gap-3 p-3 bg-[#FDECFB] border border-transparent hover:border-[#fc5fe9] rounded-lg shadow-[0_4px_8px_0_rgba(0,112,127,0.04)]">
                  <Image
                    src="/images/again-wellcom.svg"
                    width={48}
                    height={48}
                    alt="reengagement"
                  />
                  <div className="space-y-1">
                    <h2 className="heading-5 text-[#111827]">
                      Re-engagement Campaign
                    </h2>
                    <p className="body-4 text-[#70747D]">
                      Win back inactive users with personalized offers, updates,
                      or recommendations. Show them what’s new and remind them
                      why they loved your brand in the first place.
                    </p>
                  </div>
                  <Image
                    src="/images/file-search.svg"
                    width={24}
                    height={24}
                    alt="view details"
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex gap-3">
                  <LightBtn label="Go back" imageSrc="/images/arrow-left.svg" imagePosition="left" />
                  <PrimaryBtn label="Send email" imageSrc="/images/arrow-right.svg" imagePosition="right" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default People;
