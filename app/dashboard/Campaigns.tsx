"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import Tabs from "./Tabs";
import StatusPills from "../ui/StatusPills";

// Define activity card type
interface ActivityCard {
  id: number;
  icon: string;
  iconBg: string;
  status: "green" | "orange" | "blue";
  statusLabel: string;
  title: string;
  description: string;
  time: string;
}



const activityData: ActivityCard[] = [
  {
    id: 1,
    icon: "/images/rocket.png",
    iconBg: "#E6F2FF",
    status: "green",
    statusLabel: "Completed",
    title: "New leads follow-up",
    description: "Your follow-up sequence will start tomorrow at 9:00 AM.",
    time: "30 min ago",
  },
  {
    id: 2,
    icon: "/images/rocket-purple.png",
    iconBg: "#FFF0F6",
    status: "orange",
    statusLabel: "Ongoing",
    title: "New leads follow-up",
    description: "Your follow-up sequence will start tomorrow at 9:00 AM.",
    time: "Yesterday",
  },
  {
    id: 3,
    icon: "/images/rocket-orange.png",
    iconBg: "#FFF9E6",
    status: "blue",
    statusLabel: "Scheduled",
    title: "New leads follow-up",
    description: "Your follow-up sequence will start tomorrow at 9:00 AM.",
    time: "30 min ago",
  },
  {
    id: 4,
    icon: "/images/rocket-green.png",
    iconBg: "#53DE531F",
    status: "blue",
    statusLabel: "Scheduled",
    title: "New leads follow-up",
    description: "Your follow-up sequence will start tomorrow at 9:00 AM.",
    time: "Yesterday",
  },
  {
    id: 5,
    icon: "/images/rocket-yellow.png",
    iconBg: "#E5D5211F",
    status: "blue",
    statusLabel: "Scheduled",
    title: "New leads follow-up",
    description: "Your follow-up sequence will start tomorrow at 9:00 AM.",
    time: "30 min ago",
  },
  {
    id: 6,
    icon: "/images/rocket-blue.png",
    iconBg: "#4FB3D21F",
    status: "blue",
    statusLabel: "Scheduled",
    title: "New leads follow-up",
    description: "Your follow-up sequence will start tomorrow at 9:00 AM.",
    time: "30 min ago",
  },
];

const Campaigns: React.FC = () => {
  return (
    <div className="mt-5">
        

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 rounded-lg bg-[#EEEEEE66] p-4 ">
        {activityData.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-sm p-3 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-5">
              {/* Icon with colored bg */}
              <div
                className="p-2 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.iconBg }}
              >
                <Image
                  src={card.icon}
                  alt="activity icon"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>

              {/* Status pill */}
              <StatusPills label={card.statusLabel} variant={card.status} />
            </div>

            {/* Title and description */}
            <div className=" mb-5">
              <h3 className="font-medium body-3 text-[#111827] mb-1">
                {card.title}
              </h3>
              <p className="text-[#A0A3A9] font-normal heading-7 ">
                {card.description}
              </p>
            </div>

            {/* Timestamp */}
            {/* Bottom row: link on left, time on right */}
            <div className="flex items-center justify-between text-xs mt-auto">
              <Link
                href="/leads"
                className="text-[#111827] body-5 font-normal flex items-center gap-1 hover:text-[#111827] transition-colors"
              >
                View details
                <ChevronRight size={14} />
              </Link>
              <p className="text-gray-400">{card.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
