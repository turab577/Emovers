import Image from "next/image";
import React, { useState } from "react";

export default function Step3() {
  const [campaignData, setCampaignData] = useState({
    title: "New product launch",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ul",
    totalLeads: "220",
    totalCompanies: "76"
  });

  const [emailData, setEmailData] = useState([
    {
      id: 1,
      value: "June 12, 2025",
      title: "Start date",
      img: "/images/calender.svg"
    },
    {
      id: 2,
      value: "12:00am",
      title: "Time",
      img: "/images/clock-colored.svg"
    },
    {
      id: 3,
      value: "4",
      title: "Follow-ups",
      img: "/images/follow-ups.svg"
    },
    {
      id: 4,
      value: "3 days",
      title: "Follow-up interval",
      img: "/images/interval.svg"
    },
    {
      id: 5,
      value: "Weekly",
      title: "Frequency",
      img: "/images/calender-colored.svg"
    },
  ]);

  const [isCampaignEditing, setIsCampaignEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);

  const handleCampaignChange = (field: string, value: string) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailDataChange = (id: number, value: string) => {
    setEmailData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, value } : item
      )
    );
  };

  const handleCampaignSave = () => {
    setIsCampaignEditing(false);
    console.log("Campaign data saved:", campaignData);
  };

  const handleCampaignCancel = () => {
    setIsCampaignEditing(false);
    // Optionally reset campaign data here
  };

  const handleEmailSave = () => {
    setIsEmailEditing(false);
    console.log("Email data saved:", emailData);
  };

  const handleEmailCancel = () => {
    setIsEmailEditing(false);
    // Optionally reset email data here
  };

  return (
    <div className="pt-8 space-y-8">
      {/* Campaign & Audience Details Section */}
      <div className="bg-[#F6F6F6] border rounded-lg w-full p-3 text-[#111827] border-px border-[#ECEDEE]">
        <div className="flex justify-between w-full">
          <p className="heading-6 font-medium">Campaign & audience details</p>
          <div className="flex gap-2">
            {isCampaignEditing ? (
              <>
                <button 
                  onClick={handleCampaignSave}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button 
                  onClick={handleCampaignCancel}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <Image
                src="/images/pencil.svg"
                alt="Edit"
                width={16}
                height={16}
                className="cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => setIsCampaignEditing(true)}
              />
            )}
          </div>
        </div>
        <div className="bg-white mt-3 p-3 rounded-lg custom-shadow space-y-1">
          {isCampaignEditing ? (
            <input
              type="text"
              value={campaignData.title}
              onChange={(e) => handleCampaignChange('title', e.target.value)}
              className="font-medium body-3 text-[#111827] w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="font-medium body-3 text-[#111827]">
              {campaignData.title}
            </p>
          )}

          {isCampaignEditing ? (
            <textarea
              value={campaignData.description}
              onChange={(e) => handleCampaignChange('description', e.target.value)}
              className="heading-6 font-regular text-[#70747D] w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          ) : (
            <p className="heading-6 font-regular text-[#70747D]">
              {campaignData.description}
            </p>
          )}

          <div className="mt-3 flex gap-2">
            <div className="bg-[#FEF4ED] w-full flex p-3 gap-3">
              <div className="bg-white custom-shadow p-2 rounded-lg">
                <Image
                  src="/images/leads.svg"
                  alt="leads"
                  width={20}
                  height={20}
                />
              </div>
              <div className="space-y-1 w-full">
                {isCampaignEditing ? (
                  <input
                    type="text"
                    value={campaignData.totalLeads}
                    onChange={(e) => handleCampaignChange('totalLeads', e.target.value)}
                    className="heading-6 font-medium text-[#111827] w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="heading-6 font-medium text-[#111827]">
                    {campaignData.totalLeads}
                  </p>
                )}
                <p className="heading-7 font-regular text-[#70747D]">
                  Total leads
                </p>
              </div>
            </div>
            <div className="bg-[#FEF4ED] w-full flex p-3 gap-3">
              <div className="bg-white custom-shadow p-2 rounded-lg">
                <Image
                  src="/images/buildings.svg"
                  alt="companies"
                  width={20}
                  height={20}
                />
              </div>
              <div className="space-y-1 w-full">
                {isCampaignEditing ? (
                  <input
                    type="text"
                    value={campaignData.totalCompanies}
                    onChange={(e) => handleCampaignChange('totalCompanies', e.target.value)}
                    className="heading-6 font-medium text-[#111827] w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="heading-6 font-medium text-[#111827]">
                    {campaignData.totalCompanies}
                  </p>
                )}
                <p className="heading-7 font-regular text-[#70747D]">
                  Total companies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Setup Section */}
      <div className="bg-[#F6F6F6] border rounded-lg w-full p-3 text-[#111827] border-px border-[#ECEDEE]">
        <div className="flex justify-between w-full">
          <p className="heading-6 font-medium">Email setup</p>
          <div className="flex gap-2">
            {isEmailEditing ? (
              <>
                <button 
                  onClick={handleEmailSave}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button 
                  onClick={handleEmailCancel}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <Image
                src="/images/pencil.svg"
                alt="Edit"
                width={16}
                height={16}
                className="cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => setIsEmailEditing(true)}
              />
            )}
          </div>
        </div>
        <div className="bg-white p-3 mt-3 rounded-lg custom-shadow">
          <div className="flex items-center cursor-pointer gap-3 p-3 bg-[#ECFDF2] border border-transparent hover:border-[#f8a86f] rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.10) inset]">
            <div className="bg-white custom-shadow rounded-lg p-3">
              <Image
                src="/images/template.svg"
                width={24}
                height={24}
                alt="check"
              />
            </div>
            <div className="flex justify-between w-full items-start">
              <div className="space-y-1">
                <h2 className="heading-5 text-[#111827]">Welcome email</h2>
                <p className="body-4 text-[#70747D] max-w-[420px]">
                  You are completely free to keep this template as your email
                  template or cancel this template and select a new one.
                </p>
              </div>
              <Image
                src="/images/file-search.svg"
                alt="Search file"
                width={24}
                height={24}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-5">
            {emailData.map((item) => (
              <div key={item.id} className="bg-[#FEF4ED] rounded-lg p-3">
                <div className="flex gap-3 items-center">
                  <div className="bg-white rounded-lg custom-shadow p-3">
                    <Image src={item.img} alt={item.title} height={20} width={20} />
                  </div>
                  <div className="space-y-1 w-full">
                    {isEmailEditing ? (
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => handleEmailDataChange(item.id, e.target.value)}
                        className="heading-6 font-medium text-[#111827] w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="heading-6 font-medium text-[#111827]">
                        {item.value}
                      </p>
                    )}
                    <p className="heading-7 font-regular text-[#70747D]">
                      {item.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}