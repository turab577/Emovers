"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  minimized?: boolean;
  onNavigate?: () => void; // Add this
}

const NavLink = ({ href, children, minimized, onNavigate }: NavLinkProps) => {
  const pathname = usePathname();
    const isActive = pathname.includes(href);;

  const handleClick = () => {
    onNavigate?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={
        "text-[14px] py-2 px-3 rounded-full flex items-center gap-2 text-[#111827] hover:text-[#FFFFFF] hover:bg-[#11224E] bg-transparent transition " +
        (minimized ? "justify-center px-1" : "") +
        (isActive ? " bg-[#11224E]! text-[#FFFFFF]!" : "")
      }
    >
      {children}
    </Link>
  );
};

export default NavLink;
