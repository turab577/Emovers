"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Checkbox from "@/app/ui/Checkbox";
import ActionDropdown from "@/app/shared/ActionDropdown";

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

type NotificationTab = "all" | "read" | "unread";

interface Notification {
  id: string;
  title: string;
  unread: boolean;
  description?: string;
  createdAt?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isMobile }) => {
  const pathname = usePathname();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(15); // Mock: 15 days left
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [profileImg, setProfileImg] = useState<string>("/images/profile.svg");

  // Mock data for notifications
  const mockNotifications: Notification[] = [
    {
      id: "1",
      title: "Welcome to Outreach Platform!",
      description: "Your account has been successfully created",
      unread: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "New Lead Added",
      description: "John Doe has been added to your leads list",
      unread: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: "3",
      title: "Campaign Completed",
      description: "Your email campaign has been sent successfully",
      unread: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "4",
      title: "Meeting Scheduled",
      description: "Meeting with Sarah Johnson at 2:00 PM tomorrow",
      unread: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
    {
      id: "5",
      title: "Subscription Update",
      description: "Your trial period has been extended",
      unread: false,
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    },
  ];

  // Mock subscription data
  const mockSubscription = {
    status: "trialing",
    trialEnd: new Date(Date.now() + 15 * 86400000).toISOString(), // 15 days from now
  };

  // Fetch data when dropdown opens
  useEffect(() => {
    if (isNotificationOpen) {
      fetchNotifications();
    }
    fetchSubscriptionData();
    fetchUserProfile();
  }, [isNotificationOpen]);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      // Mock: Set profile image
      setProfileImg("/images/profile.svg");
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Mock: Use mock notifications
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 300); // Simulate network delay
      
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setLoading(false);
    }
  };

  const fetchSubscriptionData = async () => {
    try {
      // Mock: Use mock subscription data
      setSubscription(mockSubscription);

      // Calculate trial days left from mock data
      if (mockSubscription.status === "trialing" && mockSubscription.trialEnd) {
        const trialEndDate = new Date(mockSubscription.trialEnd);
        const today = new Date();
        const diffTime = trialEndDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setTrialDaysLeft(Math.max(0, diffDays));
      } else {
        setTrialDaysLeft(null);
      }
    } catch (error: any) {
      console.error("Failed to fetch subscription data:", error);
      setTrialDaysLeft(null);
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      // Mock: Mark notification as read locally
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, unread: false } : notif
        )
      );
    } catch (error: any) {
      console.error("Failed to mark as read:", error);
      // Still update UI even if API fails
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, unread: false } : notif
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mock: Mark all notifications as read locally
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, unread: false }))
      );
    } catch (error: any) {
      console.error("Failed to mark all as read:", error);
      // Still update UI even if API fails
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, unread: false }))
      );
    }
  };

  const meetingActions = (notification: Notification) => (
    <ul className="py-1 text-sm text-gray-700">
      <li>
        <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
          View
        </button>
      </li>
      {notification.unread && (
        <li>
          <button
            onClick={() => handleNotificationClick(notification.id)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Mark as Read
          </button>
        </li>
      )}
      <li>
        <button 
          onClick={() => {
            // Mock: Remove notification
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }}
          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
        >
          Delete
        </button>
      </li>
    </ul>
  );

  const segments = pathname.split("/").filter(Boolean);
  const baseModule = segments[0] || "dashboard";

  const routeIcons: { [key: string]: React.ReactNode } = {
    dashboard: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V9.16667C2.5 9.6269 2.8731 10 3.33333 10H7.5C7.96024 10 8.33333 9.6269 8.33333 9.16667V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.6667 2.5H12.5C12.0398 2.5 11.6667 2.8731 11.6667 3.33333V5.83333C11.6667 6.29357 12.0398 6.66667 12.5 6.66667H16.6667C17.1269 6.66667 17.5 6.29357 17.5 5.83333V3.33333C17.5 2.8731 17.1269 2.5 16.6667 2.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.6667 10H12.5C12.0398 10 11.6667 10.3731 11.6667 10.8333V16.6667C11.6667 17.1269 12.0398 17.5 12.5 17.5H16.6667C17.1269 17.5 17.5 17.1269 17.5 16.6667V10.8333C17.5 10.3731 17.1269 10 16.6667 10Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 13.3333H3.33333C2.8731 13.3333 2.5 13.7064 2.5 14.1667V16.6667C2.5 17.1269 2.8731 17.5 3.33333 17.5H7.5C7.96024 17.5 8.33333 17.1269 8.33333 16.6667V14.1667C8.33333 13.7064 7.96024 13.3333 7.5 13.3333Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    people: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M13.3334 17.5V15.8333C13.3334 14.9493 12.9822 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5.00002C4.11597 12.5 3.26812 12.8512 2.643 13.4763C2.01788 14.1014 1.66669 14.9493 1.66669 15.8333V17.5M15.8334 6.66667V11.6667M18.3334 9.16667H13.3334M10.8334 5.83333C10.8334 7.67428 9.34097 9.16667 7.50002 9.16667C5.65907 9.16667 4.16669 7.67428 4.16669 5.83333C4.16669 3.99238 5.65907 2.5 7.50002 2.5C9.34097 2.5 10.8334 3.99238 10.8334 5.83333Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    leads: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M13.3334 17.5V15.8333C13.3334 14.9493 12.9822 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5.00002C4.11597 12.5 3.26812 12.8512 2.643 13.4763C2.01788 14.1014 1.66669 14.9493 1.66669 15.8333V17.5M18.3334 17.4999V15.8332C18.3328 15.0947 18.087 14.3772 17.6345 13.7935C17.182 13.2098 16.5485 12.7929 15.8334 12.6082M13.3334 2.60824C14.0504 2.79182 14.6859 3.20882 15.1397 3.79349C15.5936 4.37817 15.8399 5.09726 15.8399 5.8374C15.8399 6.57754 15.5936 7.29664 15.1397 7.88131C14.6859 8.46598 14.0504 8.88298 13.3334 9.06657M10.8334 5.83333C10.8334 7.67428 9.34097 9.16667 7.50002 9.16667C5.65907 9.16667 4.16669 7.67428 4.16669 5.83333C4.16669 3.99238 5.65907 2.5 7.50002 2.5C9.34097 2.5 10.8334 3.99238 10.8334 5.83333Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    campaigns: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M9.99998 12.4996L7.49998 9.99956M9.99998 12.4996C11.164 12.0568 12.2807 11.4985 13.3333 10.8329M9.99998 12.4996V16.6662C9.99998 16.6662 12.525 16.2079 13.3333 14.9996C14.2333 13.6496 13.3333 10.8329 13.3333 10.8329M7.49998 9.99956C7.94343 8.84908 8.50182 7.74627 9.16665 6.70789C10.1376 5.15538 11.4897 3.8771 13.0941 2.99463C14.6986 2.11217 16.5022 1.65486 18.3333 1.66622C18.3333 3.93289 17.6833 7.91622 13.3333 10.8329M7.49998 9.99956L3.33331 9.99957C3.33331 9.99957 3.79165 7.47457 4.99998 6.66624C6.34998 5.76624 9.16665 6.66624 9.16665 6.66624M3.74998 13.7496C2.49998 14.7996 2.08331 17.9163 2.08331 17.9163C2.08331 17.9163 5.19998 17.4996 6.24998 16.2496C6.84165 15.5496 6.83331 14.4746 6.17498 13.8246C5.85107 13.5155 5.42439 13.3368 4.97683 13.323C4.52928 13.3091 4.09238 13.4611 3.74998 13.7496Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    "ai-outreach": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M11.6665 5.83366L14.1665 8.33366M4.16646 5.00033V8.33366M15.8331 11.667V15.00033M8.33313 1.66699V3.33366M5.83313 6.66699H2.4998M17.4998 13.3337H14.1665M9.16646 2.50033H7.4998M18.0332 3.0337L16.9665 1.96703C16.8727 1.87229 16.7611 1.79709 16.6381 1.74576C16.5151 1.69444 16.3831 1.66801 16.2498 1.66801C16.1165 1.66801 15.9846 1.69444 15.8616 1.74576C15.7385 1.79709 15.6269 1.87229 15.5332 1.96703L1.9665 15.5337C1.87176 15.6275 1.79656 15.7391 1.74523 15.8621C1.69391 15.9851 1.66748 16.1171 1.66748 16.2504C1.66748 16.3837 1.69391 16.5156 1.74523 16.6386C1.79656 16.7617 1.87176 16.8733 1.9665 16.967L3.03317 18.0337C3.12635 18.1295 3.23778 18.2056 3.36087 18.2575C3.48396 18.3095 3.61622 18.3363 3.74983 18.3363C3.88345 18.3363 4.01571 18.3095 4.1388 18.2575C4.26189 18.2056 4.37332 18.1295 4.4665 18.0337L18.0332 4.46703C18.1289 4.37385 18.205 4.26242 18.257 4.13933C18.309 4.01623 18.3358 3.88398 18.3358 3.75036C18.3358 3.61675 18.309 3.48449 18.257 3.3614C18.205 3.23831 18.1289 3.12688 18.0332 3.0337Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    emails: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M18.3334 10.833V4.99967C18.3334 4.55765 18.1578 4.13372 17.8452 3.82116C17.5326 3.5086 17.1087 3.33301 16.6667 3.33301H3.33335C2.89133 3.33301 2.4674 3.5086 2.15484 3.82116C1.84228 4.13372 1.66669 4.55765 1.66669 4.99967V14.9997C1.66669 15.9163 2.41669 16.6663 3.33335 16.6663H10M18.3334 5.83301L10.8584 10.583C10.6011 10.7442 10.3036 10.8297 10 10.8297C9.69642 10.8297 9.39896 10.7442 9.14169 10.583L1.66669 5.83301M15.8334 13.333V18.333M13.3334 15.833H18.3334"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    meetings: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M11.6667 15.0003L15 18.3337M15 18.3337L18.3333 15.0003M15 18.3337V11.667M13.3333 1.66699V5.00033M17.5 9.46199V5.00033C17.5 4.5583 17.3244 4.13437 17.0118 3.82181C16.6993 3.50925 16.2754 3.33366 15.8333 3.33366H4.16667C3.72464 3.33366 3.30072 3.50925 2.98816 3.82181C2.67559 4.13437 2.5 4.5583 2.5 5.00033V16.667C2.5 17.109 2.67559 17.5329 2.98816 17.8455C3.30072 18.1581 3.72464 18.3337 4.16667 18.3337H10.2858M2.5 8.33366H17.5M6.66667 1.66699V5.00033"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    settings: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M17.5 13.3329V6.66626C17.4997 6.37399 17.4225 6.08693 17.2763 5.83389C17.13 5.58086 16.9198 5.37073 16.6667 5.22459L10.8333 1.89126C10.58 1.74498 10.2926 1.66797 10 1.66797C9.70744 1.66797 9.42003 1.74498 9.16667 1.89126L3.33333 5.22459C3.08022 5.37073 2.86998 5.58086 2.72372 5.83389C2.57745 6.08693 2.5003 6.37399 2.5 6.66626V13.3329C2.5003 13.6252 2.57745 13.9122 2.72372 14.1653C2.86998 14.4183 3.08022 14.6285 3.33333 14.7746L9.16667 18.1079C9.42003 18.2542 9.70744 18.3312 10 18.3312C10.2926 18.3312 10.58 18.2542 10.8333 18.1079L16.6667 14.7746C16.9198 14.6285 17.13 14.4183 17.2763 14.1653C17.4225 13.9122 17.4997 13.6252 17.5 13.3329Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 13.333C11.8409 13.333 13.3333 11.8406 13.3333 9.99967C13.3333 8.15872 11.8409 6.66634 10 6.66634C8.15905 6.66634 6.66667 8.15872 6.66667 9.99967C6.66667 11.8406 8.15905 13.333 10 13.333Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    profile: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M15.8337 17.5V15.8333C15.8337 14.9493 15.4825 14.1014 14.8573 13.4763C14.2322 12.8512 13.3844 12.5 12.5003 12.5H7.50033C6.61627 12.5 5.76842 12.8512 5.1433 13.4763C4.51818 14.1014 4.16699 14.9493 4.16699 15.8333V17.5M13.3337 5.83333C13.3337 7.67428 11.8413 9.16667 10.0003 9.16667C8.15938 9.16667 6.66699 7.67428 6.66699 5.83333C6.66699 3.99238 8.15938 2.5 10.0003 2.5C11.8413 2.5 13.3337 3.99238 13.3337 5.83333Z"
          stroke="#111827"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  const currentRoute = baseModule
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const ActiveRouteIcon = routeIcons[baseModule] || null;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs: { id: NotificationTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "read", label: "Read" },
    { id: "unread", label: "Unread" },
  ];

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "read") return !notification.unread;
    if (activeTab === "unread") return notification.unread;
    return true;
  });

  const tabVariants = {
    active: {
      color: "#F87B1B",
    },
    inactive: {
      color: "#00000066",
    },
  };

  const underlineVariants = {
    active: {
      scaleX: 1,
      opacity: 1,
    },
    inactive: {
      scaleX: 0,
      opacity: 0,
    },
  };

  const contentVariants = {
    enter: {
      opacity: 0,
      y: 10,
    },
    center: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -10,
    },
  };

  return (
    <div className="w-full">
      <div className="bg-[#EEEEEE66] border-b border-[#11182714] backdrop-blur-2xl w-full flex items-center justify-between px-5 py-3">
        <div>
          {/* Desktop */}
          <div className=" p-2 rounded-lg hidden xl:flex items-center gap-2 text-[#111827]">
            <div className="flex items-center gap-2">
              {ActiveRouteIcon}
              <p className="heading-5 font-normal text-[#111827]">
                {currentRoute}
              </p>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-4 max-[1280px]:flex min-[1281px]:hidden">
            <button
              onClick={onMenuClick}
              className="cursor-pointer"
              aria-label="Toggle menu"
            >
              <Image
                src="/images/minimize.svg"
                width={24}
                height={24}
                alt="menu"
              />
            </button>

            <Image
              src="/images/mobile-logo.svg"
              width={40}
              height={40}
              alt="logo"
            />

            <div className="text-[14px] p-2 rounded-lg hidden sm:flex xl:hidden items-center gap-2 text-[#111827]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V9.16667C2.5 9.6269 2.8731 10 3.33333 10H7.5C7.96024 10 8.33333 9.6269 8.33333 9.16667V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.6667 2.5H12.5C12.0398 2.5 11.6667 2.8731 11.6667 3.33333V5.83333C11.6667 6.29357 12.0398 6.66667 12.5 6.66667H16.6667C17.1269 6.66667 17.5 6.29357 17.5 5.83333V3.33333C17.5 2.8731 17.1269 2.5 16.6667 2.5Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.6667 10H12.5C12.0398 10 11.6667 10.3731 11.6667 10.8333V16.6667C11.6667 17.1269 12.0398 17.5 12.5 17.5H16.6667C17.1269 17.5 17.5 17.1269 17.5 16.6667V10.8333C17.5 10.3731 17.1269 10 16.6667 10Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 13.3333H3.33333C2.8731 13.3333 2.5 13.7064 2.5 14.1667V16.6667C2.5 17.1269 2.8731 17.5 3.33333 17.5H7.5C7.96024 17.5 8.33333 17.1269 8.33333 16.6667V14.1667C8.33333 13.7064 7.96024 13.3333 7.5 13.3333Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {currentRoute}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
         
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={`p-1 rounded-lg transition cursor-pointer`}
          >
            <Image
              src="/images/notification-icon.svg"
              alt="notifications"
              width={40}
              height={40}
            />
          </button>
          <Link href="/profile">
            <Image
              src={profileImg || "/images/profile.svg"}
              className="rounded-full w-10 h-10 object-cover"
              alt="profile"
              width={40}
              height={40}
            />
          </Link>
        </div>

        <AnimatePresence>
          {isNotificationOpen && (
            <motion.div
              ref={dropdownRef}
              className="absolute h-screen right-0 sm:right-5 top-[76px] max-w-[493px] w-full"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="rounded-xl bg-white border border-[#ECEDEE] h-[88vh] shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-semibold">Notifications</h1>
                  <div className="flex gap-3">
                    <Link
                      href="/notifications"
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-blue-950 underline"
                    >
                      View All
                    </Link>
                    {/* <button
                      className="cursor-pointer"
                      onClick={() => setIsNotificationOpen(false)}
                    >
                      <Image
                        src="/images/cross-notification.svg"
                        width={32}
                        height={32}
                        alt="cross-notification"
                      />
                    </button> */}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <ul className="flex items-center gap-5">
                      {tabs.map((tab) => (
                        <li key={tab.id} className="relative">
                          <button
                            onClick={() => setActiveTab(tab.id)}
                            className="body-4 font-medium transition-colors relative z-10"
                            style={{ padding: "8px 0" }}
                          >
                            <motion.span
                              variants={tabVariants}
                              initial={false}
                              animate={
                                activeTab === tab.id ? "active" : "inactive"
                              }
                            >
                              {tab.label}
                            </motion.span>
                          </button>
                          {activeTab === tab.id && (
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F87B1B]"
                              variants={underlineVariants}
                              initial="inactive"
                              animate="active"
                              layoutId="activeTab"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={handleMarkAllAsRead as any} />
                      <p className="text-[#00000066] body-4 font-medium">
                        Mark all as read
                      </p>
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-[calc(88vh-180px)]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        variants={contentVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-4"
                      >
                        {loading ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F87B1B]"></div>
                          </div>
                        ) : filteredNotifications.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            No notifications found
                          </div>
                        ) : (
                          filteredNotifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              className="border-b border-[#E2E3E5] pb-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                              <div className="p-2 bg-[#F4F4F4] rounded-lg flex items-start justify-between cursor-pointer hover:bg-[#F0F0F0] transition-colors">
                                <div className="flex items-start gap-3">
                                  <div className="rounded-lg shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] bg-white p-1.5">
                                    <Image
                                      src="/images/rocket-yellow.png"
                                      width={20}
                                      height={20}
                                      alt="rocket-yellow"
                                    />
                                  </div>
                                  <div className="space-y-1 max-w-[258px]">
                                    <h1 className="text-[#000000CC] body-3">
                                      {notification.title}
                                    </h1>
                                    <p className="text-[#00000066] body-4">
                                      {notification.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-[#000000CC] body-4">
                                      {notification.createdAt
                                        ? new Date(
                                            notification.createdAt
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : "10m"}
                                    </p>
                                    {notification.unread && (
                                      <motion.div
                                        className="w-2 h-2 rounded-full bg-[#F87B1B]"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                          duration: 0.2,
                                          delay: 0.1,
                                        }}
                                      />
                                    )}
                                  </div>
                                  <ActionDropdown
                                    row={{
                                      id: notification.id,
                                      type: "notification",
                                    }}
                                    actions={() => meetingActions(notification)}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;