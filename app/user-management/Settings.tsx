"use client";

import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";
import Users from "./users/Users";
import Image from "next/image";
import Admin from "./admin/Admins";
// import PrimaryBtn from "../ui/buttons/PrimaryBtn";
// import { AnimatePresence , motion } from "framer-motion";
// import EditDrawer from "./admin/EditDrawer";
import { userAPI } from "../api/users-management";

interface TabContent {
  label: string;
  component: React.ReactNode;
}

interface StatsData {
  totalUsers: number;
  totalAdmins: number;
  activeUsers: number;
  pendingUsers: number;
  verifiedUsers: number;
  recentUsers: number;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats data on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await userAPI.getStats();
        console.log('Stats API Response:', response);
        
        if (response && response.success) {
          setStats(response.data);
        } else {
          setError('Failed to load statistics');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Error loading statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const openEdit = () => {
    setEditDrawerOpen(true);
  };

  // Default stats in case API fails or is loading
  const defaultStats = [
    {
      id: 1,
      value: "0",
      title: "Total Users",
      img: "/images/card1.svg"
    },
    {
      id: 2,
      value: "0",
      title: "Active Users",
      img: "/images/card1.svg"
    },
    {
      id: 3,
      value: "0",
      title: "Total Admins",
      img: "/images/card3.svg"
    },
    {
      id: 4,
      value: "0",
      title: "Verified Users ",
      img: "/images/card4.svg"
    },
  ];

  const tabContents = [
    {
      label: "Users",
      component: <Users />,
    },
    {
      label: "Admins",
      component: <Admin />,
    },
  ];

  // Format stats for display
  const displayStats = stats ? [
    {
      id: 1,
      value: stats.totalUsers.toString(),
      title: "Total Users",
      img: "/images/card1.svg"
    },
    {
      id: 2,
      value: stats.activeUsers.toString(),
      title: "Active Users",
      img: "/images/card1.svg"
    },
    {
      id: 3,
      value: stats.totalAdmins.toString(),
      title: "Total Admins",
      img: "/images/card3.svg"
    },
    {
      id: 4,
      value: stats.verifiedUsers.toString(),
      title: "Verified Users",
      img: "/images/card4.svg"
    },
    // {
    //   id: 5,
    //   value: `${stats.verifiedUsers}`, // Verified users count
    //   title: "Verified Users",
    //   img: "/images/card2.svg"
    // },
    // {
    //   id: 6,
    //   value: `${stats.pendingUsers}`, // Pending users count
    //   title: "Pending Users",
    //   img: "/images/card1.svg"
    // },
  ] : defaultStats;

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {defaultStats.map((stat) => (
            <div key={stat.id} className="p-3 bg-[#F4F4F4] rounded-lg w-full animate-pulse">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white custom-shadow rounded-lg">
                  <div className="w-6 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center w-full">
          <Tabs
            tabs={tabContents}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleOpenDrawer={openEdit}
          />
        </div>
        <div>{tabContents[activeTab].component}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-yellow-700">{error}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {defaultStats.map((stat) => (
            <div key={stat.id} className="p-3 bg-[#F4F4F4] rounded-lg w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white custom-shadow rounded-lg">
                  <Image src={stat.img} alt={stat.title} height={24} width={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="heading-4 font-regular">{stat.value}</h4>
                  <p className="heading-7 font-regular text-[#70747D]">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center w-full">
          <Tabs
            tabs={tabContents}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleOpenDrawer={openEdit}
          />
        </div>
        <div>{tabContents[activeTab].component}</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {displayStats.map((stat) => (
          <div key={stat.id} className="p-3 bg-[#F4F4F4] rounded-lg w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white custom-shadow rounded-lg">
                <Image src={stat.img} alt={stat.title} height={24} width={24} />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="heading-4 font-regular">{stat.value}</h4>
                <p className="heading-7 font-regular text-[#70747D]">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center w-full">
        <Tabs
          tabs={tabContents}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleOpenDrawer={openEdit}
        />
      </div>
      
      <div>{tabContents[activeTab].component}</div>
    </div>
  );
};

export default Settings;