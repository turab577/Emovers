"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NavLink from "./NavLink";

interface SidebarProps {
  onClose?: () => void;
  isMobile: boolean;
  minimized?: boolean;
  onMinimize?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onClose,
  isMobile,
  minimized: minimizedProp,
  onMinimize,
}) => {
  const [minimizedState, setMinimized] = useState(false);

  const minimized =
    typeof minimizedProp === "boolean" ? minimizedProp : minimizedState;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 641px) and (max-width: 1023px)");
    const handle = (e: MediaQueryListEvent | MediaQueryList) => {
      setMinimized(e.matches);
    };
    handle(mq);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  const handleMinimizeClick = () => {
    if (isMobile && onClose) {
      onClose();
      return;
    }

    if (onMinimize) {
      onMinimize();
      return;
    }

    setMinimized((s) => !s);
  };

  return (
    <div
      className={
        (minimized && !isMobile ? "w-[72px] p-3" : "w-[260px] p-5") +
        " bg-white xl:bg-[#EEEEEE66] border-r border-[#11182714] h-screen overflow-auto transition-all duration-200 hide-scrollbar"
      }
    >
      <div className="flex flex-col gap-7 h-full w-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <Image
              src="/images/movers-logo.svg"
              width={50}
              height={35}
              alt="logo"
              className={minimized && !isMobile ? "hidden" : undefined}
            />
          </Link>

          <button
            aria-pressed={minimized}
            aria-label={
              isMobile
                ? "Close sidebar"
                : minimized
                ? "Expand sidebar"
                : "Minimize sidebar"
            }
            onClick={handleMinimizeClick}
            className="p-1 rounded-md hover:bg-[#1118270A]"
          >
            <Image
              src="/images/minimize.svg"
              width={24}
              height={24}
              alt="menu"
              className={`cursor-pointer ${minimized ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation (single container) */}
        <nav className="flex flex-col space-y-1 pt-6">
          <NavLink href="/posters" minimized={minimized}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
              <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
              <path d="M8 6v8" />
            </svg>
            <span className={minimized ? "hidden" : ""}>Posters</span>
          </NavLink>

          <NavLink href="/locations" minimized={minimized}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className={minimized ? "hidden" : ""}>Locations</span>
          </NavLink>

          <NavLink href="/user-management" minimized={minimized}>
             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3327 17.5V15.8333C13.3327 14.9493 12.9815 14.1014 12.3564 13.4763C11.7313 12.8512 10.8834 12.5 9.99935 12.5H4.99935C4.11529 12.5 3.26745 12.8512 2.64233 13.4763C2.01721 14.1014 1.66602 14.9493 1.66602 15.8333V17.5M18.3327 17.4999V15.8332C18.3321 15.0947 18.0863 14.3772 17.6338 13.7935C17.1813 13.2098 16.5478 12.7929 15.8327 12.6082M13.3327 2.60824C14.0497 2.79182 14.6852 3.20882 15.139 3.79349C15.5929 4.37817 15.8392 5.09726 15.8392 5.8374C15.8392 6.57754 15.5929 7.29664 15.139 7.88131C14.6852 8.46598 14.0497 8.88298 13.3327 9.06657M10.8327 5.83333C10.8327 7.67428 9.3403 9.16667 7.49935 9.16667C5.6584 9.16667 4.16602 7.67428 4.16602 5.83333C4.16602 3.99238 5.6584 2.5 7.49935 2.5C9.3403 2.5 10.8327 3.99238 10.8327 5.83333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            <span className={minimized ? "hidden" : ""}>
              User Management
            </span>
          </NavLink>

          <NavLink href="/services" minimized={minimized}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
              <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
              <line x1="6" x2="6.01" y1="6" y2="6" />
              <line x1="6" x2="6.01" y1="18" y2="18" />
            </svg>
            <span className={minimized ? "hidden" : ""}>Services</span>
          </NavLink>

          <NavLink href="/contact" minimized={minimized}>
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className={minimized ? "hidden" : ""}>Contact Us</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
