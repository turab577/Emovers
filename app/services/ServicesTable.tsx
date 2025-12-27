import { useState } from "react";
import SharedTable, { Column } from "../shared/SharedTable";
import ConfirmationModal from "../shared/ConfirmationModal";
// import ActionDropdown from "../shared/ActionDropdown";
import Image from "next/image";
// import LightBtn from "../ui/buttons/LightButton";
// import PrimaryBtn from "../ui/buttons/PrimaryBtn";
import { motion , AnimatePresence } from "framer-motion";
import DetailDrawer from "./AddServiceDrawer";
import EditDrawer from "./EditDrawer";
import { Pencil } from "lucide-react";

const ServicesTable = ({
  setIsDrawerOpen,
}: {
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLeadsToDelete, setSelectedLeadsToDelete] = useState<any[]>([]);
  const [ DrawerOpen , setDrawerOpen ] = useState(false);
  const [ editDrawerOpen , setEditDrawerOpen ] = useState(false);


  const openDetail = ()=> {
    setDrawerOpen(true)
  }

  const openEdit = ()=> {
    setEditDrawerOpen(true)
  }

  // Define columns with explicit Column[] type
  const columns: Column[] = [
  {
    key: "leadName",
    label: "Service name",
    type: "text",
    linkUrlKey: "leadName_url",
    // onLinkClick: openDetail  
  },
  { key: "contact", label: "Contact", type: "text" },
  { key: "address", label: "Address", type: "text" },
];
  const peopleData = [
    {
      leadName: "Floyd Miles",
      leadName_image: "https://i.pravatar.cc/150?img=1",
      leadName_url: "/leads/floyd-miles",
      contact: "floyd.miles@gmail.com",
      source: "LinkedIn",
      role: "CEO",
      company: "Google",
      company_image: "https://logo.clearbit.com/google.com",
      address: "Silicon Valley, California",
      status: "New",
    },
    {
      leadName: "Leslie Alexander",
      leadName_image: "https://i.pravatar.cc/150?img=2",
      leadName_url: "/leads/floyd-miles",

      contact: "leslie.alexander@outlook.com",
      source: "Apollo",
      role: "Marketing Manager",
      company: "Microsoft",
      company_image: "https://logo.clearbit.com/microsoft.com",
      address: "Seattle, Washington",
      status: "Contacted",
    },
    {
      leadName: "Courtney Henry",
      leadName_image: "https://i.pravatar.cc/150?img=3",
      leadName_url: "/leads/floyd-miles",

      contact: "courtney.henry@yahoo.com",
      source: "Outreach",
      role: "Product Manager",
      company: "Meta",
      company_image: "https://logo.clearbit.com/meta.com",

      address: "Menlo Park, California",
      status: "Engaged",
    },
    {
      leadName: "Wade Warren",
      leadName_image: "https://i.pravatar.cc/150?img=4",
      leadName_url: "/leads/floyd-miles",

      contact: "wade.warren@gmail.com",
      source: "LinkedIn",
      role: "UI/UX Designer",
      company: "Figma",
      company_image: "https://logo.clearbit.com/figma.com",

      address: "San Francisco, California",
      status: "Converted",
    },
    {
      leadName: "Jenny Wilson",
      leadName_image: "https://i.pravatar.cc/150?img=5",

      contact: "jenny.wilson@icloud.com",
      source: "Apollo",
      role: "HR Manager",
      company: "Netflix",
      company_image: "https://logo.clearbit.com/netflix.com",
      leadName_url: "/leads/floyd-miles",

      address: "Los Gatos, California",
      status: "Not interested",
    },
    {
      leadName: "Albert Flores",
      leadName_image: "https://i.pravatar.cc/150?img=6",

      contact: "albert.flores@gmail.com",
      source: "LinkedIn",
      role: "Software Engineer",
      company: "Amazon",
      company_image: "https://logo.clearbit.com/amazon.com",
      leadName_url: "/leads/floyd-miles",

      address: "Seattle, Washington",
      status: "New",
    },
    {
      leadName: "Cameron Williamson",
      leadName_image: "https://i.pravatar.cc/150?img=7",

      contact: "cameron.williamson@protonmail.com",
      source: "Outreach",
      role: "Frontend Developer",
      company: "Vordx Technologies",
      company_image: "https://logo.clearbit.com/vercel.com",
      leadName_url: "/leads/floyd-miles",

      address: "Lahore, Pakistan",
      status: "Engaged",
    },
    {
      leadName: "Brooklyn Simmons",
      leadName_image: "https://i.pravatar.cc/150?img=8",

      contact: "brooklyn.simmons@gmail.com",
      source: "LinkedIn",
      role: "Sales Executive",
      company: "Salesforce",
      company_image: "https://logo.clearbit.com/salesforce.com",
      leadName_url: "/leads/floyd-miles",

      address: "New York, USA",
      status: "Contacted",
    },
    {
      leadName: "Theresa Webb",
      leadName_image: "https://i.pravatar.cc/150?img=9",

      contact: "theresa.webb@gmail.com",
      source: "Apollo",
      role: "Project Manager",
      company: "Trello",
      company_image: "https://logo.clearbit.com/trello.com",
      leadName_url: "/leads/floyd-miles",

      address: "Austin, Texas",
      status: "Converted",
    },
    {
      leadName: "Esther Howard",
      leadName_image: "https://i.pravatar.cc/150?img=10",

      contact: "esther.howard@live.com",
      source: "LinkedIn",
      role: "Data Analyst",
      company: "Spotify",
      company_image: "https://logo.clearbit.com/spotify.com",
      leadName_url: "/leads/floyd-miles",

      address: "Stockholm, Sweden",
      status: "Engaged",
    },
   
  ];

  // Define filters
  const filters = [
    {
      key: "industry",
      label: "Industry",
      options: [
        "All",
        "Technology",
        "Finance",
        "Healthcare",
        "E-commerce",
        "Education",
        "Entertainment",
      ],
    },
    {
      key: "company",
      label: "Company Name",
      options: [
        "Google",
        "Microsoft",
        "Amazon",
        "Meta",
        "Netflix",
        "Apple",
        "Spotify",
      ],
    },
    {
      key: "company_size",
      label: "Company Size",
      options: [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees",
        "201-500 employees",
        "501-1000 employees",
        "1000+ employees",
      ],
    },
    {
      key: "funding_stage",
      label: "Funding Stage",
      options: [
        "Pre-Seed",
        "Seed",
        "Series A",
        "Series B",
        "Series C",
        "Public",
      ],
    },
    {
      key: "location",
      label: "Location",
      options: [
        "San Francisco, USA",
        "New York, USA",
        "London, UK",
        "Berlin, Germany",
        "Sydney, Australia",
        "Lahore, Pakistan",
      ],
    },
    {
      key: "role",
      label: "Role",
      options: ["CEO", "CTO"],
    },
  ];

  // Handle selection
  const handleSelect = (selectedRows: any[]) => {
    console.log("Selected rows:", selectedRows);
  };

  // Handle add to campaign
  const handleAddToCampaign = () => {
    // console.log("Add to campaign:", selectedRows);
    setIsDrawerOpen(true);
  };

  // Handle download CSV
  // const handleDownloadCSV = (selectedRows: any[]) => {
  //   console.log("Download CSV:", selectedRows);
  //   const csv = convertToCSV(selectedRows);
  //   downloadCSV(csv, "people-data.csv");
  // };

  // Handle delete leads - open modal
  const handleDeleteLeads = (selectedRows: any[]) => {
    setSelectedLeadsToDelete(selectedRows);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDeleteLeads = () => {
    console.log("Deleting leads:", selectedLeadsToDelete);
    // Your actual delete logic here
    // For example: API call to delete leads
    // deleteLeadsAPI(selectedLeadsToDelete.map(lead => lead.id));

    // Reset selection
    setSelectedLeadsToDelete([]);
  };

  // Helper function to convert data to CSV
  const convertToCSV = (data: any[]) => {
    const headers = columns.map((col) => col.label).join(",");
    const rows = data.map((row) =>
      columns.map((col) => row[col.key]).join(",")
    );
    return [headers, ...rows].join("\n");
  };

  // Helper function to download CSV
  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDeleteMessage = () => {
    const count = selectedLeadsToDelete.length;
    if (count === 1) {
      return "Are you sure you want to delete this Service? This action will permanently remove all related data.";
    }
    return `Are you sure you want to delete ${count} Services? This action will permanently remove all related data.`;
  };

  return (
    <>
      <div>
        <SharedTable
          columns={columns}
          data={peopleData}
          title={<div className="flex gap-[6px] items-center">
            <p>Services</p>
              <p className="heading-7 font-medium text-[#70747D]">20</p>
          </div>}
          filters={filters}
          searchable={false}
          filterable={true}
          selectable={true}
          onSelect={handleSelect}
          bottomActions={[
            {
              label: "Add to campaign",
              onClick: handleAddToCampaign,
            },
            {
              label: "Delete leads",
              onClick: handleDeleteLeads,
            },
          ]}
          showSelectionCount={true}
          actionsType="inline"
          actions={(row) => (
            <div className="flex">
              
              <button onClick={openEdit} className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg">
               <div className="text-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
               </div>
              </button>
              <button
                className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg"
                onClick={() => handleDeleteLeads([row])}
              >
                <Image
                  src="/images/delete.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                />
              </button>
            </div>
          )}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteLeads}
        title={
          selectedLeadsToDelete.length === 1
            ? "Delete this Service?"
            : `Delete ${selectedLeadsToDelete.length} Services?`
        }
        message={getDeleteMessage()}
        icon="/images/bin.svg"
        confirmText="Delete Service"
        cancelText="Go back"
      />

       <AnimatePresence>
        {editDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditDrawerOpen(false)} // close on overlay click
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0  w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
             <EditDrawer onClose={()=>{setEditDrawerOpen(false)}} onSendEmail={()=>{setEditDrawerOpen(false)}} />
            </motion.div>
          </>
        )}
      </AnimatePresence>





       <AnimatePresence>
        {DrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)} // close on overlay click
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0  w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
             <DetailDrawer onClose={()=>{setDrawerOpen(false)}}/>
            </motion.div>
          </>
        )}
      </AnimatePresence>


    </>
  );
};

export default ServicesTable;
