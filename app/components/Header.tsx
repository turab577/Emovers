"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ActionDropdown from "@/app/shared/ActionDropdown";
import { profileAPI } from "@/app/api/profile"; // Import your profile API

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

// Add User interface matching your API response
interface User {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  role?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isMobile }) => {
  const pathname = usePathname();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(15);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Profile states
  const [user, setUser] = useState<User | null>(null);
  const [profileImg, setProfileImg] = useState<string>("/images/profile.svg");
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);

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
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      title: "Campaign Completed",
      description: "Your email campaign has been sent successfully",
      unread: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "4",
      title: "Meeting Scheduled",
      description: "Meeting with Sarah Johnson at 2:00 PM tomorrow",
      unread: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "5",
      title: "Subscription Update",
      description: "Your trial period has been extended",
      unread: false,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  // Mock subscription data
  const mockSubscription = {
    status: "trialing",
    trialEnd: new Date(Date.now() + 15 * 86400000).toISOString(),
  };

  // Fetch data when dropdown opens
  useEffect(() => {
    if (isNotificationOpen) {
      fetchNotifications();
    }
    fetchSubscriptionData();
  }, [isNotificationOpen]);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      setIsLoadingProfile(true);
      const response = await profileAPI.getProfile();

      console.log('Header Profile API Response:', response);
      
      // Check if response exists and has the expected structure
      if (response?.success && response?.data) {
        const userData = response.data;
        
        setUser({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          profilePicture: userData.profilePicture || "/images/profile.svg",
          role: userData.role || ""
        });
        
        if (userData.profilePicture) {
          setProfileImg(userData.profilePicture);
        } else {
          setProfileImg("/images/profile.svg");
        }
      } else if (response?.status === "success" && response?.data) {
        // Handle alternative success structure
        const userData = response.data;
        
        setUser({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          profilePicture: userData.profilePicture || "/images/profile.svg",
          role: userData.role || ""
        });
        
        if (userData.profilePicture) {
          setProfileImg(userData.profilePicture);
        } else {
          setProfileImg("/images/profile.svg");
        }
      } else {
        throw new Error(response?.message || "Failed to fetch profile");
      }
    } catch (error: any) {
      console.error("Failed to fetch profile in Header:", error);
      
      // Don't show toast in header to avoid disrupting UX
      // Use fallback image
      setProfileImg("/images/profile.svg");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Mock: Use mock notifications
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 300);
      
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
  const baseModule = segments[0] || "Services";

  const routeIcons: { [key: string]: React.ReactNode } = {
    Services: (
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
    ),
    "user-management": (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.3327 17.5V15.8333C13.3327 14.9493 12.9815 14.1014 12.3564 13.4763C11.7313 12.8512 10.8834 12.5 9.99935 12.5H4.99935C4.11529 12.5 3.26745 12.8512 2.64233 13.4763C2.01721 14.1014 1.66602 14.9493 1.66602 15.8333V17.5M18.3327 17.4999V15.8332C18.3321 15.0947 18.0863 14.3772 17.6338 13.7935C17.1813 13.2098 16.5478 12.7929 15.8327 12.6082M13.3327 2.60824C14.0497 2.79182 14.6852 3.20882 15.139 3.79349C15.5929 4.37817 15.8392 5.09726 15.8392 5.8374C15.8392 6.57754 15.5929 7.29664 15.139 7.88131C14.6852 8.46598 14.0497 8.88298 13.3327 9.06657M10.8327 5.83333C10.8327 7.67428 9.3403 9.16667 7.49935 9.16667C5.6584 9.16667 4.16602 7.67428 4.16602 5.83333C4.16602 3.99238 5.6584 2.5 7.49935 2.5C9.3403 2.5 10.8327 3.99238 10.8327 5.83333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    locations: (
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
    ),
    posters: (
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
        <path d="M6 14a12 12 0 0 0 2.4 7.2a2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
        <path d="M8 6v8" />
      </svg>
    ),
    services: (
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
    ),
    contact: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-icon lucide-user">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
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
            {isLoadingProfile ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            ) : profileImg.startsWith('http') ? (
              <img
                src={profileImg}
                className="rounded-full w-10 h-10 object-cover"
                alt="profile"
                width={40}
                height={40}
                onError={(e) => {
                  e.currentTarget.src = "/images/profile.svg";
                }}
              />
            ) : (
              <Image
                src={profileImg}
                className="rounded-full w-10 h-10 object-cover"
                alt="profile"
                width={40}
                height={40}
              />
            )}
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
                      <input 
                        type="checkbox" 
                        checked={notifications.every(n => !n.unread)}
                        onChange={handleMarkAllAsRead}
                      />
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