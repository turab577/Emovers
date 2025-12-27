"use client";

import React, { useState } from "react";
import Tabs from "./Tabs";
import Campaigns from "./Campaigns";
import EmailTable from "./EmailTable";
import LeadsTable from "./LeadsTable";
import Meetings from "./Meetings";

interface TabContent {
  label: string;
  component: React.ReactNode;
  icon: string;
}

const tabContents: TabContent[] = [
  { label: "Campaigns", component: <Campaigns />, icon: "/images/rocket1.png" },
  { label: "Emails send", component: <EmailTable setIsDrawerOpen={()=>console.log('opened')}/>, icon: "/images/mail-plus.png" },
  { label: "Leads", component: <LeadsTable setIsDrawerOpen={()=>console.log('opened')}/>, icon: "/images/users.png" },
  { label: "Meetings", component: <Meetings />, icon: "/images/calendar-arrow-down.png" },
];

const ActivityFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-[280px]">
          <h2 className="body-1 font-medium mb-1">Activity feed</h2>
          <p className="text-[#A0A3A9] font-normal heading-6">
            A real-time overview of everything happening in your workspace.
          </p>
        </div>

        <div className="flex items-center w-full sm:w-auto">
          <Tabs tabs={tabContents} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

      {/* Render selected tab content */}
      <div className="mt-4">{tabContents[activeTab].component}</div>
    </div>
  );
};

export default ActivityFeed;
