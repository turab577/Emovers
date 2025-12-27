import Input from "@/app/ui/Input";
import React from "react";
import DrawerTable from "./DrawerTable";

export default function Step1() {
  return (
    <div className="w-full pt-8">
      <div className="flex flex-col gap-4 pr-5">
        <Input title="Title" placeholder="Enter title" className="w-full" />
        <Input
          title="Description"
          placeholder="Add short description"
          className="w-full"
        />
      </div>
      <div className="pt-8 pr-5">
        <p className="body-2 font-medium">Select audience</p>
      </div>
      <div>
        <DrawerTable
          setIsDrawerOpen={() => {
            console.log("Drawer opened");
          }}
        />
      </div>
    </div>
  );
}
