// app/notifications/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
// import Checkbox from "@/app/ui/Checkbox";
import ActionDropdown from "@/app/shared/ActionDropdown";
// import { notificationsApi } from "@/app/api/notifications";

type NotificationTab = "all" | "read" | "unread";

interface Notification {
  id: string;
  title: string;
  unread: boolean;
  description?: string;
  createdAt?: string;
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications on component mount
  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  // const fetchNotifications = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await notificationsApi.getNotifications();
  //     console.log('Full API Response:', response);
      
  //     const notificationsData = response?.notifications || response?.notifications || [];
      
  //     if (Array.isArray(notificationsData)) {
  //       const transformedNotifications = notificationsData.map((item: any) => {
  //         const inappDelivery = item.deliveries?.find((d: any) => d.channel === 'inapp');
  //         const isUnread = !inappDelivery || !inappDelivery.readAt;
          
  //         return {
  //           id: item.id,
  //           title: item.title,
  //           unread: isUnread,
  //           description: item.body,
  //           createdAt: item.createdAt
  //         };
  //       });
  //       setNotifications(transformedNotifications);
  //     }
  //   } catch (error: any) {
  //     console.error("Error fetching notifications:", error);
  //     setNotifications([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleNotificationClick = async (notificationId: string) => {
  //   try {
  //     await notificationsApi.markAsRead(notificationId);

  //     setNotifications(prev => prev.map(notif => 
  //       notif.id === notificationId 
  //         ? { ...notif, unread: false } 
  //         : notif
  //     ));
  //   } catch (error: any) {
  //     console.error("Failed to mark as read:", error);
  //     console.error("Error details:", error.message, error.response?.data);
  //     setNotifications(prev => prev.map(notif => 
  //       notif.id === notificationId 
  //         ? { ...notif, unread: false } 
  //         : notif
  //     ));
  //   }
  // };

  // const handleMarkAllAsRead = async () => {
  //   try {
  //     const unreadNotifications = notifications.filter(notif => notif.unread);
      
  //     const promises = unreadNotifications.map(notif => 
  //       notificationsApi.markAsRead(notif.id)
  //     );
      
  //     await Promise.all(promises);
      
  //     setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
  //   } catch (error: any) {
  //     console.error("Failed to mark all as read:", error);
  //     console.error("Error details:", error.message, error.response?.data);
  //     setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
  //   }
  // };

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
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Mark as Read
          </button>
        </li>
      )}
      <li>
        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
          Delete
        </button>
      </li>
    </ul>
  );

  const tabs: { id: NotificationTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "read", label: "Read" },
    { id: "unread", label: "Unread" },
  ];

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'read') return !notification.unread;
    if (activeTab === 'unread') return notification.unread;
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
    <div className="">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Manage and view all your notifications in one place</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Tabs and Actions */}
          <div className="p-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Tabs */}
              <ul className="flex items-center gap-4">
                {tabs.map((tab) => (
                  <li key={tab.id} className="relative">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className="body-4 font-medium transition-colors relative z-10 px-2 py-1"
                    >
                      <motion.span
                        variants={tabVariants}
                        initial={false}
                        animate={activeTab === tab.id ? "active" : "inactive"}
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

              {/* Mark All as Read */}
              {notifications.some(n => n.unread) && (
                <div className="flex items-center gap-2">
                  <input type="checkbox"  />
                  <p className="text-[#00000066] body-4 font-medium cursor-pointer" >
                    Mark all as read
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-5">
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
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F87B1B]"></div>
                    <p className="ml-3 text-gray-600">Loading notifications...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                    <p className="text-gray-600">
                      {activeTab === 'all' 
                        ? "You don't have any notifications yet." 
                        : activeTab === 'read' 
                          ? "No read notifications found."
                          : "No unread notifications found."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className="border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="p-4 flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Icon */}
                            <div className={`rounded-lg shadow-sm ${notification.unread ? 'bg-orange-50 border border-orange-100' : 'bg-white border border-gray-200'} p-2.5`}>
                              <Image
                                src="/images/rocket-yellow.png"
                                width={24}
                                height={24}
                                alt="notification"
                                className="w-6 h-6"
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h3 className={`font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                <div className="flex items-center gap-2 ml-2">
                                  <span className="text-sm text-gray-500 whitespace-nowrap">
                                    {notification.createdAt 
                                      ? new Date(notification.createdAt).toLocaleTimeString([], { 
                                          hour: '2-digit', 
                                          minute: '2-digit',
                                          hour12: true 
                                        })
                                      : 'Just now'
                                    }
                                  </span>
                                  {notification.unread && (
                                    <motion.div
                                      className="w-2 h-2 rounded-full bg-[#F87B1B]"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ duration: 0.2, delay: 0.1 }}
                                    />
                                  )}
                                </div>
                              </div>
                              {notification.description && (
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                  {notification.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="ml-4">
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
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Stats */}
            {!loading && filteredNotifications.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#F87B1B]"></span>
                      <span>{notifications.filter(n => n.unread).length} unread</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span>{notifications.filter(n => !n.unread).length} read</span>
                    </span>
                  </div>
                  <span>Total: {notifications.length} notifications</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 flex justify-end">
          <button
            // onClick={fetchNotifications}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Notifications'}
          </button>
        </div>
      </div>
    </div>
  );
}