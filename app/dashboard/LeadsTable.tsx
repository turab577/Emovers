// import { useState } from "react";
// import SharedTable, { Column } from "../shared/SharedTable";
// import ConfirmationModal from "../shared/ConfirmationModal";
// import Image from "next/image";

// interface Lead {
//   id: number;
//   leadName: string;
//   leadName_image: string;
//   leadName_url: string;
//   contact: string;
//   source: string;
//   role: string;
//   company: string;
//   company_image: string;
//   address: string;
//   status: string;
// }

// const LeadsTable = ({
//   setIsDrawerOpen,
// }: {
//   setIsDrawerOpen: (value: boolean) => void;
// }) => {
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedLeadsToDelete, setSelectedLeadsToDelete] = useState<Lead[]>([]);
//   const [tableKey, setTableKey] = useState(0); // Add key for re-render
//   const [leadsData, setLeadsData] = useState([
//     // Move data to state
//     {
//       id: 1, // Added unique IDs
//       leadName: "Floyd Miles",
//       leadName_image: "https://i.pravatar.cc/150?img=1",
//       leadName_url: "/leads/floyd-miles",
//       contact: "floyd.miles@gmail.com",
//       source: "LinkedIn",
//       role: "CEO",
//       company: "Google",
//       company_image: "https://logo.clearbit.com/google.com",
//       address: "Silicon Valley, California",
//       status: "New",
//     },
//     {
//       id: 2,
//       leadName: "Leslie Alexander",
//       leadName_image: "https://i.pravatar.cc/150?img=2",
//       contact: "leslie.alexander@outlook.com",
//       source: "Apollo",
//       role: "Marketing Manager",
//       company: "Microsoft",
//       company_image: "https://logo.clearbit.com/microsoft.com",
//       address: "Seattle, Washington",
//       status: "Contacted",
//     },
//     {
//       id: 3,
//       leadName: "Courtney Henry",
//       leadName_image: "https://i.pravatar.cc/150?img=3",
//       contact: "courtney.henry@yahoo.com",
//       source: "Outreach",
//       role: "Product Manager",
//       company: "Meta",
//       company_image: "https://logo.clearbit.com/meta.com",
//       address: "Menlo Park, California",
//       status: "Engaged",
//     },
//     {
//       id: 4,
//       leadName: "Wade Warren",
//       leadName_image: "https://i.pravatar.cc/150?img=4",
//       contact: "wade.warren@gmail.com",
//       source: "LinkedIn",
//       role: "UI/UX Designer",
//       company: "Figma",
//       company_image: "https://logo.clearbit.com/figma.com",
//       address: "San Francisco, California",
//       status: "Converted",
//     },
//     {
//       id: 5,
//       leadName: "Jenny Wilson",
//       leadName_image: "https://i.pravatar.cc/150?img=5",
//       contact: "jenny.wilson@icloud.com",
//       source: "Apollo",
//       role: "HR Manager",
//       company: "Netflix",
//       company_image: "https://logo.clearbit.com/netflix.com",
//       address: "Los Gatos, California",
//       status: "Converted",
//     },
//   ]);

//   // Define columns with explicit Column[] type
//   const columns: Column[] = [
//     {
//       key: "leadName",
//       label: "Lead name",
//       type: "link",
//       linkUrlKey: "leadName_url",
//     },
//     { key: "contact", label: "Contact", type: "text" },
//     { key: "source", label: "Source", type: "text" },
//     { key: "role", label: "Role", type: "text" },
//     { key: "company", label: "Company", type: "image" },
//     { key: "address", label: "Address", type: "text" },
//     { key: "status", label: "Status", type: "status" },
//   ];

//   // Define filters
//   const filters = [
//     {
//       key: "industry",
//       label: "Industry",
//       options: [
//         "All",
//         "Technology",
//         "Finance",
//         "Healthcare",
//         "E-commerce",
//         "Education",
//         "Entertainment",
//       ],
//     },
//     {
//       key: "company",
//       label: "Company Name",
//       options: [
//         "Google",
//         "Microsoft",
//         "Amazon",
//         "Meta",
//         "Netflix",
//         "Apple",
//         "Spotify",
//       ],
//     },
//     {
//       key: "company_size",
//       label: "Company Size",
//       options: [
//         "1-10 employees",
//         "11-50 employees",
//         "51-200 employees",
//         "201-500 employees",
//         "501-1000 employees",
//         "1000+ employees",
//       ],
//     },
//     {
//       key: "funding_stage",
//       label: "Funding Stage",
//       options: [
//         "Pre-Seed",
//         "Seed",
//         "Series A",
//         "Series B",
//         "Series C",
//         "Public",
//       ],
//     },
//     {
//       key: "location",
//       label: "Location",
//       options: [
//         "San Francisco, USA",
//         "New York, USA",
//         "London, UK",
//         "Berlin, Germany",
//         "Sydney, Australia",
//         "Lahore, Pakistan",
//       ],
//     },
//     {
//       key: "role",
//       label: "Role",
//       options: ["CEO", "CTO"],
//     },
//   ];

//   // Handle selection
//   const handleSelect = (selectedRows: Lead[]) => {
//     console.log("Selected rows:", selectedRows);
//   };

//   // Handle add to campaign
//   const handleAddToCampaign = (selectedRows: Lead[]) => {
//     console.log("Add to campaign:", selectedRows);
//     setIsDrawerOpen(true);
//   };

//   // Handle download CSV
//   const handleDownloadCSV = (selectedRows: Lead[]) => {
//     console.log("Download CSV:", selectedRows);
//     const csv = convertToCSV(selectedRows);
//     downloadCSV(csv, "people-data.csv");
//   };

//   const handleDeleteLeads = (selectedRows: Lead[]) => {
//     setSelectedLeadsToDelete(selectedRows);
//     setIsDeleteModalOpen(true);
//   };

//   const confirmDeleteLeads = () => {
//     console.log("Deleting leads:", selectedLeadsToDelete);

//     if (selectedLeadsToDelete.length > 0) {
//       const idsToDelete = selectedLeadsToDelete.map((row) => row.id);

//       const updatedData = leadsData.filter(
//         (row) => !idsToDelete.includes(row.id)
//       );

//       setLeadsData(updatedData);
//     }

//     setSelectedLeadsToDelete([]);
//     setIsDeleteModalOpen(false);

//     setTableKey((prev) => prev + 1);
//   };

//   const convertToCSV = (data: any[]) => {
//     const headers = columns.map((col) => col.label).join(",");
//     const rows = data.map((row) =>
//       columns.map((col) => row[col.key]).join(",")
//     );
//     return [headers, ...rows].join("\n");
//   };

//   // Helper function to download CSV
//   const downloadCSV = (csv: string, filename: string) => {
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const getDeleteMessage = () => {
//     const count = selectedLeadsToDelete.length;
//     if (count === 1) {
//       return "Are you sure you want to delete this lead? This action will permanently remove all related data.";
//     }
//     return `Are you sure you want to delete ${count} leads? This action will permanently remove all related data.`;
//   };

//   return (
//     <>
//       <div>
//         <SharedTable
//           key={tableKey}
//           columns={columns}
//           data={leadsData}
//           title={<div>Leads</div>}
//           filters={filters}
//           searchable={false}
//           filterable={true}
//           selectable={true}
//           hidePagination={true}
//           onSelect={handleSelect}
//           bottomActions={[
//             {
//               label: "Add to campaign",
//               onClick: handleAddToCampaign,
//             },
//             {
//               label: "Delete leads",
//               onClick: handleDeleteLeads,
//             },
//           ]}
//           showSelectionCount={true}
//           actionsType="inline"
//           actions={(row) => (
//             <div className="flex">
//               <button
//                 className="cursor-pointer"
//                 onClick={() => handleAddToCampaign([row])}
//               >
//                 <Image
//                   src="/images/action1.svg"
//                   alt="Edit"
//                   width={40}
//                   height={40}
//                 />
//               </button>
//               <button className="cursor-pointer">
//                 <Image
//                   src="/images/action2.svg"
//                   alt="Edit"
//                   width={40}
//                   height={40}
//                 />
//               </button>
//               <button
//                 className="cursor-pointer"
//                 onClick={() => handleDeleteLeads([row])}
//               >
//                 <Image
//                   src="/images/action3.svg"
//                   alt="Delete"
//                   width={40}
//                   height={40}
//                 />
//               </button>
//             </div>
//           )}
//         />
//       </div>

//       {/* Delete Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => {
//           setIsDeleteModalOpen(false);
//           setSelectedLeadsToDelete([]);
//         }}
//         onConfirm={confirmDeleteLeads}
//         title={
//           selectedLeadsToDelete.length === 1
//             ? "Delete this lead?"
//             : `Delete ${selectedLeadsToDelete.length} leads?`
//         }
//         message={getDeleteMessage()}
//         icon="/images/bin.svg"
//         confirmText="Delete lead"
//         cancelText="Go back"
//         type="danger"
//       />
//     </>
//   );
// };

// export default LeadsTable;


import { useState } from "react";
import SharedTable, { Column } from "../shared/SharedTable";
import ConfirmationModal from "../shared/ConfirmationModal";
import Image from "next/image";

interface Lead {
  id: number;
  leadName: string;
  leadName_image: string;
  leadName_url: string;
  contact: string;
  source: string;
  role: string;
  company: string;
  company_image: string;
  address: string;
  status: string;
}

const LeadsTable = ({
  setIsDrawerOpen,
}: {
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLeadsToDelete, setSelectedLeadsToDelete] = useState<Record<string, unknown>[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const [leadsData, setLeadsData] = useState<Record<string, unknown>[]>([
    {
      id: 1,
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
      id: 2,
      leadName: "Leslie Alexander",
      leadName_image: "https://i.pravatar.cc/150?img=2",
      contact: "leslie.alexander@outlook.com",
      source: "Apollo",
      role: "Marketing Manager",
      company: "Microsoft",
      company_image: "https://logo.clearbit.com/microsoft.com",
      address: "Seattle, Washington",
      status: "Contacted",
    },
    {
      id: 3,
      leadName: "Courtney Henry",
      leadName_image: "https://i.pravatar.cc/150?img=3",
      contact: "courtney.henry@yahoo.com",
      source: "Outreach",
      role: "Product Manager",
      company: "Meta",
      company_image: "https://logo.clearbit.com/meta.com",
      address: "Menlo Park, California",
      status: "Engaged",
    },
    {
      id: 4,
      leadName: "Wade Warren",
      leadName_image: "https://i.pravatar.cc/150?img=4",
      contact: "wade.warren@gmail.com",
      source: "LinkedIn",
      role: "UI/UX Designer",
      company: "Figma",
      company_image: "https://logo.clearbit.com/figma.com",
      address: "San Francisco, California",
      status: "Converted",
    },
    {
      id: 5,
      leadName: "Jenny Wilson",
      leadName_image: "https://i.pravatar.cc/150?img=5",
      contact: "jenny.wilson@icloud.com",
      source: "Apollo",
      role: "HR Manager",
      company: "Netflix",
      company_image: "https://logo.clearbit.com/netflix.com",
      address: "Los Gatos, California",
      status: "Converted",
    },
  ]);

  // Define columns
  const columns: Column[] = [
    {
      key: "leadName",
      label: "Lead name",
      type: "link",
      linkUrlKey: "leadName_url",
    },
    { key: "contact", label: "Contact", type: "text" },
    { key: "source", label: "Source", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { 
      key: "company", 
      label: "Company", 
      type: "image",
      imageUrlKey: "company_image"
    },
    { key: "address", label: "Address", type: "text" },
    { key: "status", label: "Status", type: "status" },
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
  const handleSelect = (selectedRows: Record<string, unknown>[]) => {
    console.log("Selected rows:", selectedRows);
  };

  // Handle add to campaign
  const handleAddToCampaign = (selectedRows: Record<string, unknown>[]) => {
    console.log("Add to campaign:", selectedRows);
    setIsDrawerOpen(true);
  };

  // Handle download CSV
  const handleDownloadCSV = (selectedRows: Record<string, unknown>[]) => {
    console.log("Download CSV:", selectedRows);
    const csv = convertToCSV(selectedRows);
    downloadCSV(csv, "leads-data.csv");
  };

  // Handle delete leads
  const handleDeleteLeads = (selectedRows: Record<string, unknown>[]) => {
    setSelectedLeadsToDelete(selectedRows);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteLeads = () => {
    console.log("Deleting leads:", selectedLeadsToDelete);

    if (selectedLeadsToDelete.length > 0) {
      const idsToDelete = selectedLeadsToDelete.map((row) => row.id as number);

      const updatedData = leadsData.filter(
        (row) => !idsToDelete.includes(row.id as number)
      );

      setLeadsData(updatedData);
    }

    setSelectedLeadsToDelete([]);
    setIsDeleteModalOpen(false);
    setTableKey((prev) => prev + 1);
  };

  const convertToCSV = (data: Record<string, unknown>[]) => {
    const headers = columns.map((col) => col.label).join(",");
    const rows = data.map((row) =>
      columns.map((col) => String(row[col.key] || "")).join(",")
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
      const leadName = selectedLeadsToDelete[0].leadName as string;
      return `Are you sure you want to delete the lead "${leadName}"? This action will permanently remove all related data.`;
    }
    return `Are you sure you want to delete ${count} leads? This action will permanently remove all related data.`;
  };

  // Helper function to get lead name for single delete
  const getLeadName = (row: Record<string, unknown>) => {
    return row.leadName as string || "this lead";
  };

  return (
    <>
      <div>
        <SharedTable
          key={tableKey}
          columns={columns}
          data={leadsData}
          title={<div>Leads</div>}
          filters={filters}
          searchable={false}
          filterable={true}
          selectable={true}
          hidePagination={true}
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
          actions={(row: Record<string, unknown>) => (
            <div className="flex">
              <button
                className="cursor-pointer"
                onClick={() => handleAddToCampaign([row])}
              >
                <Image
                  src="/images/action1.svg"
                  alt="Edit"
                  width={40}
                  height={40}
                />
              </button>
              <button className="cursor-pointer">
                <Image
                  src="/images/action2.svg"
                  alt="Edit"
                  width={40}
                  height={40}
                />
              </button>
              <button
                className="cursor-pointer"
                onClick={() => handleDeleteLeads([row])}
              >
                <Image
                  src="/images/action3.svg"
                  alt="Delete"
                  width={40}
                  height={40}
                />
              </button>
            </div>
          )}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLeadsToDelete([]);
        }}
        onConfirm={confirmDeleteLeads}
        title={
          selectedLeadsToDelete.length === 1
            ? `Delete ${getLeadName(selectedLeadsToDelete[0])}?`
            : `Delete ${selectedLeadsToDelete.length} leads?`
        }
        message={getDeleteMessage()}
        icon="/images/bin.svg"
        confirmText="Delete lead"
        cancelText="Go back"
        type="danger"
      />
    </>
  );
};

export default LeadsTable;