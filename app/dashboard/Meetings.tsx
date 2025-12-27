// components/MeetingCards.tsx
"use client";

import React from "react";
import Image from "next/image";
import ActionDropdown from "../shared/ActionDropdown";

interface Meeting {
  id: number;
  title: string;
  description: string;
  time: string;
  duration: string;
  attendees: string;
}

const meetings: Meeting[] = [
  {
    id: 1,
    title: "Meeting by Floyd Miles",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    time: "2:00 am",
    duration: "30 min",
    attendees: "James Hall",
  },
  {
    id: 2,
    title: "Meeting by Floyd Miles",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    time: "2:00 am",
    duration: "30 min",
    attendees: "James Hall",
  },
  {
    id: 3,
    title: "Meeting by Floyd Miles",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    time: "2:00 am",
    duration: "30 min",
    attendees: "James Hall",
  },
  {
    id: 4,
    title: "Meeting by Floyd Miles",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    time: "2:00 am",
    duration: "30 min",
    attendees: "James Hall",
  },
];

const meetingActions = (meeting: Meeting) => (
  <ul className="py-1 text-sm text-gray-700">
    <li>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => alert(`View ${meeting.title}`)}
      >
        View
      </button>
    </li>
    <li>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => alert(`Edit ${meeting.title}`)}
      >
        Edit
      </button>
    </li>
    <li>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
        onClick={() => alert(`Delete ${meeting.title}`)}
      >
        Delete
      </button>
    </li>
  </ul>
);

const Meetings: React.FC = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="p-3 gap-3 rounded-lg border border-[#ECEDEE] bg-[#F6F6F6]"
          >
            {/* Header - Using CSS Grid for better responsive control */}
            <div className="grid grid-cols-[auto_1fr] lg:flex lg:justify-between lg:items-center mb-6 gap-2 lg:gap-0">
              {/* Left: Icon + Title */}
              <div className="flex items-center gap-3 col-span-2 lg:col-span-1">
                <div className="w-10 h-10 p-2 bg-white rounded-4xl flex items-center justify-center shadow-sm">
                  <Image
                    src="/images/calendar-arrow-down.png"
                    width={20}
                    height={20}
                    alt="rocket"
                  />
                </div>
                <span className="text-[#111827] font-medium heading-6">
                  {meeting.title}
                </span>
              </div>

              <div className="col-span-2 lg:col-span-1 flex justify-between items-center lg:items-center lg:gap-3">
                <div className="flex items-center gap-2 lg:hidden">
                  <Image
                    src="/images/calendar.png"
                    alt="Calendar icon"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <span className="text-[#70747D] font-normal heading-7">
                    Today 12:03am
                  </span>
                </div>

                {/* Dropdown - Always visible */}
                <div className="lg:order-last">
                  <ActionDropdown row={meeting} actions={meetingActions} />
                </div>

                {/* Date/Time - Hidden on sm, shown on lg in original position */}
                <div className="hidden lg:flex items-center gap-2">
                  <Image
                    src="/images/calendar.png"
                    alt="Calendar icon"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <span className="text-[#70747D] font-normal heading-7">
                    Today 12:03am
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-3 gap-3 rounded-lg border border-[#ECEDEE] bg-[#FFFFFF]">
              <h3 className="text-[#111827] font-medium body-3 mb-2">
                Lorem ipsum dolor sit amet,
              </h3>
              <p className="text-[#70747D] body-5 font-normal mb-5 w-full max-w-[516px]">
                {meeting.description}
              </p>

              <div className="flex flex-col sm:flex-row text-gray-600 text-sm gap-3">
                {/* Time */}
                <div className="flex items-center gap-3 border border-[#E2E3E5] rounded-lg p-3 flex-1">
                  <Image
                    src="/images/clock-arrow-down.png"
                    width={20}
                    height={20}
                    alt="Time icon"
                    className="shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[#111827] mb-1 heading-6">
                      {meeting.time}
                    </span>
                    <p className="text-[#70747D] body-5 ">Meeting Time</p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3 border border-[#E2E3E5] rounded-lg p-3 flex-1">
                  <Image
                    src="/images/clock.png"
                    width={20}
                    height={20}
                    alt="Duration icon"
                    className="shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[#111827] mb-1 heading-6">
                      {meeting.duration}
                    </span>
                    <p className="text-[#70747D] body-5 ">Duration</p>
                  </div>
                </div>

                {/* Attendees */}
                <div className="flex items-center gap-3 border border-[#E2E3E5] rounded-lg p-3 flex-1">
                  <Image
                    src="/images/users.png"
                    width={20}
                    height={20}
                    alt="Attendees icon"
                    className="shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[#111827] mb-1 heading-6">
                      {meeting.attendees}
                    </span>
                    <p className="text-[#70747D] body-5 ">Attendees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div />
      </div>
    </div>
  );
};

export default Meetings;