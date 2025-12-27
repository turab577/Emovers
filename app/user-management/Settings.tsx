"use client";

import React, { useState } from "react";
import Tabs from "./Tabs";
import Users from "./users/Users";
import Image from "next/image";
import Admin from "./admin/Admins";
import PrimaryBtn from "../ui/buttons/PrimaryBtn";
import { AnimatePresence , motion } from "framer-motion";
import EditDrawer from "./admin/EditDrawer";
interface TabContent {
  label: string;
  component: React.ReactNode;
  // icon: any;
}

  const stats = [
    {
      id : 1,
      value :"40000",
      title : "Total Users",
      img : "/images/card1.svg"
    },
    {
      id : 2,
      value :"30000",
      title : "Active Users",
      img : "/images/card1.svg"
    },
    {
      id : 3,
      value :"20",
      title : "Total Admins",
      img : "/images/card3.svg"
    },
    {
      id : 4,
      value :"10",
      title : "Active Admins",
      img : "/images/card4.svg"
    },
    // {
    //   id : 5,
    //   value :"60%",
    //   title : "Conversion rate",
    //   img : "/images/card4.svg"
    // },
   
  ]


const tabContents: TabContent[] = [
  {
    label: "Users",
    component: <Users/>,
    // icon: <Users className="text-[10px]"/>,
  },
  {
    label: "Admins",
    component: <Admin/> ,
    // icon: <UserStar/>,
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [ editDrawerOpen , setEditDrawerOpen ] = useState(false);

  const openEdit = ()=> {
    setEditDrawerOpen(true)
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
           {
             stats.map((stat)=>(
               <div key={stat.id} className="p-3 bg-[#F4F4F4] rounded-lg w-full ">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-white custom-shadow rounded-lg ">
                   <Image src={stat.img} alt={stat.title} height={24} width={24}/>
                   </div>
                   <div className="flex flex-col gap-1">
                     <h4 className="heading-4 font-regular">{stat.value}</h4>
                     <p className="heading-7 font-regular text-[#70747D]">{stat.title}</p>
                   </div>
                 </div>
               </div>
             ))
           }
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
