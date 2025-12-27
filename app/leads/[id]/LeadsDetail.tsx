'use client'
import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import SideContent from "./SideContent";
import Funds from "./Funds";
import Content from "./Content";

const LeadsDetail = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const rightSidebarRef = useRef<HTMLDivElement>(null);

  // Animation variants
  const sidebarVariants: Variants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const rightSidebarVariants: Variants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const overlayVariants: Variants = {
    closed: {
      opacity: 0,
      pointerEvents: "none" as const
    },
    open: {
      opacity: 1,
      pointerEvents: "auto" as const
    }
  };

  // Close sidebar when clicking outside
  const handleClickOutside = (event: React.MouseEvent) => {
    const target = event.target as Node;
    
    if (leftSidebarOpen && leftSidebarRef.current && !leftSidebarRef.current.contains(target)) {
      setLeftSidebarOpen(false);
    }
    if (rightSidebarOpen && rightSidebarRef.current && !rightSidebarRef.current.contains(target)) {
      setRightSidebarOpen(false);
    }
  };

  return (
    <div className="w-full hide-scrollbar h-[87vh] hide-scrollbar overflow-hidden">
      {/* Mobile Header Buttons */}
      <div className="xl:hidden flex justify-between p-4 border-b border-[#E2E3E5]">
        <button 
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="p-2 cursor-pointer bg-gray-100 rounded-lg"
        >
          ☰ Leads Info
        </button>
        <button 
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="p-2 cursor-pointer bg-gray-100 rounded-lg"
        >
          ℹ️ Funds Info
        </button>
      </div>

      <div className="flex w-full h-full flex-col xl:flex-row">
        {/* Desktop Left Sidebar */}
        <div className="hidden xl:static xl:block xl:min-w-[260px] h-full overflow-auto border-r-0 xl:border-r-2 border-[#E2E3E5] bg-white order-2 xl:order-1">
          <SideContent/>
        </div>

        {/* Mobile Left Sidebar Overlay */}
        <AnimatePresence>
          {leftSidebarOpen && (
            <motion.div
              className="xl:hidden fixed inset-0 z-50"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={handleClickOutside}
            >
              <motion.div
                ref={leftSidebarRef}
                className="absolute inset-y-0 left-0 w-[85vw] max-w-sm bg-white shadow-xl"
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <button 
                  onClick={() => setLeftSidebarOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 z-10"
                >
                  ✕
                </button>
                <div className="h-full overflow-auto">
                  <SideContent/>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="flex-1 h-full order-1 xl:order-2 min-h-0 p-1 sm:p-4 xl:p-0 overflow-auto hide-scrollbar">
          <Content/>
          {/* Mobile hint text */}
          <div className="xl:hidden text-center text-gray-500 mt-8">
            Use buttons above to toggle sidebars
          </div>
        </div>
        
        {/* Desktop Right Sidebar */}
        <div className="hidden hide-scrollbar xl:static xl:block xl:min-w-[260px] h-full overflow-auto border-l-0 xl:border-l-2 border-[#E2E3E5] bg-white order-3">
          <Funds/>
        </div>

        {/* Mobile Right Sidebar Overlay */}
        <AnimatePresence>
          {rightSidebarOpen && (
            <motion.div
              className="xl:hidden fixed inset-0 z-50"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={handleClickOutside}
            >
              <motion.div
                ref={rightSidebarRef}
                className="absolute inset-y-0 right-0 w-[85vw] max-w-sm bg-white shadow-xl"
                variants={rightSidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <button 
                  onClick={() => setRightSidebarOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 z-10"
                >
                  ✕
                </button>
                <div className="h-full overflow-auto">
                  <Funds/>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeadsDetail;