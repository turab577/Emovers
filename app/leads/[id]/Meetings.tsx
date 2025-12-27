import ActionDropdown from "@/app/shared/ActionDropdown";
import Image from "next/image";
import React, { useState } from "react";
import ConfirmationModal from "@/app/shared/ConfirmationModal";

interface Meeting {
  id: number;
  date: string;
  sender: string;
  recipient: string;
  time: string;
  subject: string;
  content: string;
  img?: string;
  title?: string;
  timeValue?: string;
  duration?: string;
  attendees?: string;
}

export default function Meetings(): React.JSX.Element {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  // Define actions for the dropdown with proper typing
  // Define actions for the dropdown with proper typing
const getActions = (row: Meeting): React.ReactNode => (
  <div className="p-2">
    <button 
      type="button"
      className="w-full cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
      onClick={() => console.log('Edit meeting', row.id)}
    >
      Edit
    </button>
    <button 
      type="button"
      className="w-full cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
      onClick={() => console.log('Reschedule meeting', row.id)}
    >
      Reschedule
    </button>
    <button 
      type="button"
      className="w-full cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
      onClick={() => console.log('Cancel meeting', row.id)}
    >
      Cancel
    </button>
    <button 
      type="button"
      className="w-full text-left cursor-pointer px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200 text-red-600"
      onClick={() => {
        setMeetingToDelete(row);
        setIsDeleteModalOpen(true);
      }}
    >
      Delete
    </button>
  </div>
);

  const handleDeleteConfirm = () => {
    if (meetingToDelete) {
      console.log('Delete meeting', meetingToDelete.id);
      // Add your actual delete logic here
    }
  };

  const meetings: Meeting[] = [
    {
      id: 1,
      date: "Upcoming meetings",
      sender: "Floyd Miles",
      recipient: "James Hall",
      time: "Yesterday 12:03am",
      img: "/images/calendar-down.svg",
      subject: "Monthly newsletter",
      timeValue: "2:00 am",
      duration: "30 min",
      attendees: "James Hall,",
      title: "Linkedin optimization and connection maintenance",
      content: "Thank you for your continued support of our monthly newsletter. We appreciate your engagement and feedback on our recent articles about industry trends and best practices.",
    },
    {
      id: 2,
      date: "Upcoming meetings",
      sender: "Floyd Miles",
      recipient: "James Hall",
      time: "Yesterday 12:03am",
      img: "/images/calendar-down.svg",
      title: "Linkedin optimization and connection maintenance",
      timeValue: "2:00 am",
      duration: "30 min",
      attendees: "James Hall,",
      subject: "Monthly newsletter",
      content: "We wanted to follow up on our previous meeting regarding the upcoming webinar series. Please let us know if you'd like to register for any of the sessions we have scheduled for next month.",
    },
    {
      id: 3,
      date: "Meeting history",
      sender: "Sarah Johnson",
      recipient: "James Hall",
      time: "Today 10:15am",
      img: "/images/calendar-down.svg",
      title: "Linkedin optimization and connection maintenance",
      timeValue: "2:00 am",
      duration: "30 min",
      attendees: "James Hall,",
      subject: "Project Update",
      content: "The quarterly project review has been scheduled for next Tuesday at 2:00 PM. Please come prepared with your status reports and any blockers you'd like to discuss with the team.",
    },
    {
      id: 4,
      date: "Meeting history",
      sender: "Mike Chen",
      recipient: "James Hall",
      time: "Today 9:30am",
      img: "/images/calendar-down.svg",
      title: "Linkedin optimization and connection maintenance",
      timeValue: "2:00 am",
      duration: "30 min",
      attendees: "James Hall,",
      subject: "Meeting Follow-up",
      content: "It was great connecting with you during our meeting yesterday. As discussed, I've attached the documents we reviewed and the action items we agreed upon. Looking forward to our next check-in.",
    },
  ];

  // Group meetings by date
  const groupedMeetings = meetings.reduce((acc, meeting) => {
    if (!acc[meeting.date]) {
      acc[meeting.date] = [];
    }
    acc[meeting.date].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

  return (
    <div className="space-y-5 overflow-auto">
      {Object.entries(groupedMeetings).map(([date, dateMeetings]) => (
        <div key={date} className="space-y-3">
          {/* Date Header */}
          <div>
            <h3 className="heading-6 font-medium text-[#111827]">{date}</h3>
          </div>

          {/* meetings for this date */}
          {dateMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-[#F6F6F6] rounded-lg border border-[#ECEDEE] p-3">
              <div className="flex justify-between">
                <div className="flex sm:gap-3 items-center">
                  <Image 
                    src={meeting.img || "/images/profile-icon.png"} 
                    alt={meeting.sender} 
                    height={40} 
                    width={40}
                    className="rounded"
                  />
                  <div className="flex flex-col">
                    <p className="heading-6 capitalize font-medium">
                      Meeting by {meeting.sender}
                    </p>
                  </div>
                </div>
                <div className="flex sm:gap-5 items-center">
                  <div className="flex gap-1 sm:gap-2 items-center">
                    <Image 
                      src="/images/calender.svg" 
                      alt="Calendar" 
                      height={16} 
                      width={16} 
                    />
                    <p className="heading-7 text-[#70747D] font-regular">{meeting.time}</p>
                  </div>
                  {/* Replaced menu icon with ActionDropdown */}
                  <ActionDropdown 
                    row={meeting} 
                    actions={getActions} 
                  />
                </div>
              </div>
              
              <div className="mt-2 p-3 bg-white shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] rounded-lg flex flex-col gap-2">
                <p className="heading-5 font-medium">{meeting.title}</p>
                <p className="heading-7 font-regular text-[#70747D]">{meeting.content}</p>

                <div className="flex gap-2 flex-col sm:flex-row w-full">
                  <div className="pt-5 w-full flex gap-2 p-3 border border-[#E2E3E5] rounded-lg">
                    <div className="flex gap-3 items-center">
                      <Image 
                        src="/images/clock-arrow-down.png" 
                        alt="meeting time" 
                        height={20} 
                        width={20} 
                      />
                      <div className="flex flex-col gap-1">
                        <p className="heading-6 font-medium">
                          {meeting.timeValue}
                        </p>
                        <p className="text-[#70747D] font-regular heading-7">Meeting time</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-5 w-full flex gap-2 p-3 border border-[#E2E3E5] rounded-lg">
                    <div className="flex gap-3 items-center">
                      <Image 
                        src="/images/clock.png" 
                        alt="Duration" 
                        height={20} 
                        width={20} 
                      />
                      <div className="flex flex-col gap-1">
                        <p className="heading-6 font-medium">
                          {meeting.duration}
                        </p>
                        <p className="text-[#70747D] font-regular heading-7">Duration</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-5 w-full flex gap-2 p-3 border border-[#E2E3E5] rounded-lg">
                    <div className="flex gap-3 items-center">
                      <Image 
                        src="/images/persons.svg" 
                        alt="Attendees" 
                        height={20} 
                        width={20} 
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex">
                          <p className="heading-6 font-medium">
                            {meeting.attendees}
                          </p>
                          <p className="text-[#F87B1B] heading-7 font-regular">+ 2 more</p>  
                        </div>
                        <p className="text-[#70747D] font-regular heading-7">Attendees</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMeetingToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Meeting?"
        message="Are you sure you want to delete this meeting? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        icon="/images/delete.png"
      />
    </div>
  );
}