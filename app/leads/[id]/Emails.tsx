import ActionDropdown from "@/app/shared/ActionDropdown";
import Image from "next/image";
import React, { useState } from "react";
import ConfirmationModal from "@/app/shared/ConfirmationModal"; // Import the modal

interface Email {
  id: number;
  date: string;
  sender: string;
  recipient: string;
  time: string;
  subject: string;
  content: string;
  img?: string;
}

export default function Emails(): React.JSX.Element {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<Email | null>(null);

  // Define actions for the dropdown with proper typing
  const getActions = (row: Email): React.ReactNode => (
    <div className="p-2">
      <button 
        type="button"
        className="w-full cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
        onClick={() => console.log('Reply to email', row.id)}
      >
        Reply
      </button>
      <button 
        type="button"
        className="w-full cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
        onClick={() => console.log('Forward email', row.id)}
      >
        Forward
      </button>
      <button 
        type="button"
        className="w-full cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
        onClick={() => console.log('Archive email', row.id)}
      >
        Archive
      </button>
      <button 
        type="button"
        className="w-full cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200 text-red-600"
        onClick={() => {
          setEmailToDelete(row);
          setIsDeleteModalOpen(true);
        }}
      >
        Delete
      </button>
    </div>
  );

  const handleDeleteConfirm = () => {
    if (emailToDelete) {
      console.log('Delete email', emailToDelete.id);
      // Add your actual delete logic here
    }
  };

  const emails: Email[] = [
    {
      id: 1,
      date: "Dec 12, 2024",
      sender: "Floyd Miles",
      recipient: "James Hall",
      time: "Yesterday 12:03am",
      img: "/images/profile-icon.png",
      subject: "Monthly newsletter",
      content: "Thank you for your continued support of our monthly newsletter. We appreciate your engagement and feedback on our recent articles about industry trends and best practices.",
    },
    {
      id: 2,
      date: "Dec 12, 2024",
      sender: "Floyd Miles",
      recipient: "James Hall",
      time: "Yesterday 12:03am",
      img: "/images/profile-icon.png",
      subject: "Monthly newsletter",
      content: "We wanted to follow up on our previous email regarding the upcoming webinar series. Please let us know if you'd like to register for any of the sessions we have scheduled for next month.",
    },
    {
      id: 3,
      date: "Aug 13, 2025",
      sender: "Sarah Johnson",
      recipient: "James Hall",
      time: "Today 10:15am",
      img: "/images/profile-icon.png",
      subject: "Project Update",
      content: "The quarterly project review has been scheduled for next Tuesday at 2:00 PM. Please come prepared with your status reports and any blockers you'd like to discuss with the team.",
    },
    {
      id: 4,
      date: "Aug 13, 2025",
      sender: "Mike Chen",
      recipient: "James Hall",
      time: "Today 9:30am",
      img: "/images/profile-icon.png",
      subject: "Meeting Follow-up",
      content: "It was great connecting with you during our meeting yesterday. As discussed, I've attached the documents we reviewed and the action items we agreed upon. Looking forward to our next check-in.",
    },
  ];

  // Group emails by date
  const groupedEmails = emails.reduce((acc, email) => {
    if (!acc[email.date]) {
      acc[email.date] = [];
    }
    acc[email.date].push(email);
    return acc;
  }, {} as Record<string, Email[]>);

  return (
    <div className="space-y-5 overflow-auto">
      {Object.entries(groupedEmails).map(([date, dateEmails]) => (
        <div key={date} className="space-y-3">
          {/* Date Header */}
          <div>
            <h3 className="heading-6 font-medium text-[#111827]">{date}</h3>
          </div>

          {/* Emails for this date */}
          {dateEmails.map((email) => (
            <div key={email.id} className="bg-[#F6F6F6] rounded-lg border border-[#ECEDEE] p-3">
              <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                  <Image 
                    src={email.img || "/images/profile-icon.png"} 
                    alt={email.sender} 
                    height={40} 
                    width={40}
                    className="rounded"
                  />
                  <div className="flex flex-col">
                    <p className="heading-6 capitalize font-medium">
                      {email.sender}
                    </p>
                    <p className="heading-7 capitalize text-[#70747D] font-regular">
                      To : {email.recipient}
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="flex gap-2 items-center">
                    <Image 
                      src="/images/calendar.svg" 
                      alt="Calendar" 
                      height={16} 
                      width={16} 
                    />
                    <p className="heading-7 text-[#70747D] font-regular">{email.time}</p>
                  </div>
                  {/* Replaced menu icon with ActionDropdown */}
                  <ActionDropdown 
                    row={email} 
                    actions={getActions} 
                  />
                </div>
              </div>
              
              <div className="bg-white shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] rounded-lg flex gap-[92px] mt-3 p-3">
                <p className="heading-6 text-[#70747D] font-regular">Subject</p>
                <p className="heading-6 text-[#111827] font-regular">{email.subject}</p>
              </div>
              
              <div className="mt-2 heading-7 text-[#70747D] p-3 bg-white shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] rounded-lg">
                <p>{email.content}</p>
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
          setEmailToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Email?"
        message="Are you sure you want to delete this email? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        icon="/images/delete.png" 
      />
    </div>
  );
}