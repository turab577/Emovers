import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

interface ActionDropdownProps {
  row: any;
  actions: (row: any) => React.ReactNode;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ row, actions }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update dropdown position when opened
  useEffect(() => {
    if (open && buttonRef.current && dropdownRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 112; // w-28 = 7rem = 112px
      const dropdownHeight = dropdownRef.current.offsetHeight || 150; // estimated
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate initial position
      let top = rect.bottom + window.scrollY + 4;
      let left = rect.left + window.scrollX;
      
      // Check right overflow
      if (left + dropdownWidth > viewportWidth) {
        left = rect.right + window.scrollX - dropdownWidth;
      }
      
      // Check left overflow
      if (left < 0) {
        left = 8; // 8px padding from edge
      }
      
      // Check bottom overflow
      if (rect.bottom + dropdownHeight > viewportHeight) {
        // Position above the button instead
        top = rect.top + window.scrollY - dropdownHeight - 4;
      }
      
      // Check top overflow (if positioned above)
      if (top < window.scrollY) {
        top = rect.bottom + window.scrollY + 4; // fallback to below
      }
      
      setPosition({ top, left });
    }
  }, [open]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on scroll and update position on resize
  useEffect(() => {
    const handleScroll = () => {
      if (open) setOpen(false);
    };

    const handleResize = () => {
      if (open) setOpen(false);
    };

    if (open) {
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="p-2 cursor-pointer rounded-md hover:bg-gray-100"
      >
    <Image className="cursor-pointer" src='/images/menu.svg' alt="Menu" height={14} width={14} />
        
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute bg-white shadow-2xl rounded-lg w-28"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {actions(row)}
          </div>,
          document.body
        )}
    </>
  );
};

export default ActionDropdown;