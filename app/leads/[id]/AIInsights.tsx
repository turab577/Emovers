import ActionDropdown from "@/app/shared/ActionDropdown";
import Image from "next/image";
import React, { useState } from "react";
import ConfirmationModal from "@/app/shared/ConfirmationModal";

interface insight {
  id: number;
  date: string;
  update: string;
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

export default function AIInsights(): React.JSX.Element {
  const [expandedContent, setExpandedContent] = useState<{ [key: number]: boolean }>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [insightToDelete, setInsightToDelete] = useState<insight | null>(null);

  const toggleReadMore = (id: number): void => {
    setExpandedContent(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Define actions for the dropdown with proper typing
  const getActions = (row: insight): React.ReactNode => (
    <div className="p-2">
      <button 
        type="button"
        className="w-full  cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
        onClick={() => console.log('Edit', row.id)}
      >
        Edit
      </button>
      <button 
        type="button"
        className="w-full  cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
        onClick={() => {
          setInsightToDelete(row);
          setIsDeleteModalOpen(true);
        }}
      >
        Delete
      </button>
      <button 
        type="button"
        className="w-full  cursor-pointer text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
        onClick={() => console.log('Share', row.id)}
      >
        Share
      </button>
    </div>
  );

  const handleDeleteConfirm = () => {
    if (insightToDelete) {
      console.log('Delete insight', insightToDelete.id);
      // Add your actual delete logic here
    }
  };

  const insights: insight[] = [
    {
      id: 1,
      date: "Aug 12, 2025",
      update: "Company news update",
      recipient: "James Hall",
      time: "2 days ago",
      img: "/images/ai-insights-logo.svg",
      subject: "Monthly newsletter",
      timeValue: "2:00 am",
      duration: "30 min",
      attendees: "James Hall,",
      title: "Linkedin optimization and connection maintenance",
      content: "Our analysis shows that optimizing your LinkedIn profile can increase connection requests by 45%. Focus on adding relevant skills, updating your headline to reflect current expertise, and regularly engaging with industry content to maintain active connections and visibility in your network.",
    },
    {
      id: 2,
      date: "Aug 12, 2025",
      update: "Lead engagement overview",
      recipient: "James Hall",
      time: "2 days ago",
      img: "/images/ai-insights-logo.svg",
      title: "Linkedin optimization and connection maintenance",
      timeValue: "2:00 am",
      duration: "30 min",
      attendees: "James Hall,",
      subject: "Monthly newsletter",
      content: "Recent data indicates that personalized connection messages have a 68% higher acceptance rate. Consider tailoring your outreach by mentioning shared interests, groups, or recent posts. Regular engagement with your connections' content can also significantly improve relationship building and future collaboration opportunities.",
    },
    {
      id: 3,
      date: "June 20, 2025",
      update: "Growth Indicators",
      recipient: "James Hall",
      time: "June 20, 2025",
      img: "/images/ai-insights-logo.svg",
      title: "Linkedin optimization and connection maintenance",
      timeValue: "2:00 am",
      duration: "30 min",
      attendees: "James Hall,",
      subject: "Project Update",
      content: "Your network has grown by 15% this quarter, with particularly strong engagement in the technology sector. The AI insights reveal that posting industry-specific content twice weekly and participating in relevant group discussions has driven this growth. Continue this strategy while exploring new networking opportunities in emerging tech fields.",
    },
    {
      id: 4,
      date: "June 20, 2025",
      update: "Funding update",
      recipient: "James Hall",
      time: "June 20, 2025",
      img: "/images/ai-insights-logo.svg",
      title: "Linkedin optimization and connection maintenance",
      timeValue: "2:00 am",
      duration: "30 min",
      attendees: "James Hall,",
      subject: "insight Follow-up",
      content: "Based on our latest analysis, your connection acceptance rate has improved by 22% since implementing the new outreach strategy. The data suggests that maintaining regular but not excessive engagement (2-3 interactions per week per connection) yields the best results for long-term professional relationships and opportunity generation.",
    },
  ];

  // Group insights by date with proper typing
  const groupedinsights = insights.reduce((acc, insight) => {
    if (!acc[insight.date]) {
      acc[insight.date] = [];
    }
    acc[insight.date].push(insight);
    return acc;
  }, {} as Record<string, insight[]>);

  const truncateContent = (content: string, maxLength: number = 150): string => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <div className="space-y-5 overflow-auto">
      {Object.entries(groupedinsights).map(([date, dateinsights]) => (
        <div key={date} className="space-y-3">
          {/* Date Header */}
          <div>
            <h3 className="heading-6 font-medium text-[#111827]">{date}</h3>
          </div>

          {/* insights for this date */}
          {dateinsights.map((insight) => (
            <div key={insight.id} className="bg-[#F6F6F6] rounded-lg border border-[#ECEDEE] p-3">
              <div className="flex justify-between">
                <div className="flex gap-3 items-center">
                  <Image 
                    src={insight.img || "/images/profile-icon.png"} 
                    alt={insight.update} 
                    height={40} 
                    width={40} 
                    className="rounded"
                  />
                  <div className="flex flex-col">
                    <p className="heading-6 capitalize font-medium">
                      {insight.update}
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 items-center">
                  <div className="flex gap-2 items-center">
                    <Image 
                      src="/images/calender.svg" 
                      alt="Calendar" 
                      height={16} 
                      width={16} 
                    />
                    <p className="heading-7 text-[#70747D] font-regular">{insight.time}</p>
                  </div>
                  {/* Action Dropdown */}
                  <ActionDropdown 
                    row={insight} 
                    actions={getActions} 
                  />
                </div>
              </div>

              <div className="mt-2 p-3 bg-white rounded-lg flex flex-col gap-2 shadow-[0_4px_8px_0_rgba(0,0,0,0.08)]">
                <p className="heading-7 font-regular text-[#70747D]">
                  {expandedContent[insight.id] ? insight.content : truncateContent(insight.content)}
                  {insight.content.length > 150 && (
                    <button
                      type="button"
                      onClick={() => toggleReadMore(insight.id)}
                      className="text-[#f99a51] heading-7 font-medium cursor-pointer self-start transition-all duration-300 hover:opacity-80 ml-1"
                    >
                      {expandedContent[insight.id] ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </p>
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
          setInsightToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Insight?"
        message="Are you sure you want to delete this insight? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        icon="/images/delete.png"
      />
    </div>
  );
}