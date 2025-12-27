import { useState } from "react";
import SharedTable, { Column } from "../shared/SharedTable";
import ConfirmationModal from "../shared/ConfirmationModal";
import Image from "next/image";

const CompaignsTable = ({
  setIsDrawerOpen,
}: {
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedcompaignsToDelete, setSelectedcompaignsToDelete] = useState<
    any[]
  >([]);

  // Define columns with explicit Column[] type
  const columns: Column[] = [
    {
      key: "compaignName",
      label: "Campaign name",
      type: "text",
    },
    { key: "leadsReached", label: "Leads Reached", type: "text" },
    {
      key: "replyRate",
      label: "Reply Rate",
      type: "image",
      imagePosition: "right",
    },
    { key: "createdOn", label: "Created On", type: "text" },
    { key: "lastUpdated", label: "Last Updated", type: "text" },
    { key: "status", label: "Status", type: "status" },
  ];

  const campaignsData = [
    {
      id: 1,
      compaignName: "New product launch",
      leadsReached: "1,250",
      replyRate: "56%",
      replyRate_image: "/images/graph-green.png",
      createdOn: "Aug 12, 2025",
      lastUpdated: "Aug 12, 2025",
      status: "Completed",
      actions: "",
    },
    {
      id: 2,
      compaignName: "Q4 client retention",
      leadsReached: "120",
      replyRate: "23%",
      replyRate_image: "/images/graph-red.png",

      createdOn: "Aug 12, 2025",
      lastUpdated: "Aug 12, 2025",
      status: "Ongoing",
      actions: "",
    },
    {
      id: 3,
      compaignName: "Event invitation 2025",
      leadsReached: "1,250",
      replyRate_image: "/images/graph-green.png",

      replyRate: "56%",
      createdOn: "Aug 12, 2025",
      lastUpdated: "Aug 12, 2025",
      status: "Completed",
      actions: "",
    },
    {
      id: 4,
      compaignName: "New Product Launch",
      leadsReached: "1,250",
      replyRate: "56%",
      replyRate_image: "/images/graph-red.png",

      createdOn: "Aug 12, 2025",
      lastUpdated: "Aug 12, 2025",
      status: "Scheduled",
      actions: "",
    },
    {
      id: 5,
      compaignName: "New Product Launch",
      leadsReached: "220",
      replyRate: "23%",
      createdOn: "Aug 12, 2025",
      lastUpdated: "Aug 12, 2025",
      replyRate_image: "/images/graph-green.png",

      status: "Completed",
      actions: "",
    },
    {
      id: 6,
      compaignName: "Investor outreach",
      leadsReached: "1,250",
      replyRate: "56%",
      createdOn: "Aug 12, 2025",
      lastUpdated: "Aug 12, 2025",
      status: "Ongoing",
      replyRate_image: "/images/graph-red.png",

      actions: "",
    },
    {
      id: 7,
      compaignName: "Event invitation 2025",
      leadsReached: "273",
      replyRate: "23%",
      createdOn: "Aug 12, 2025",
      lastUpdated: "Aug 12, 2025",
      status: "Completed",
      replyRate_image: "/images/graph-green.png",

      actions: "",
    },
  ];

  // Define filters according to screenshot
  const filters = [
    {
      key: "status",
      label: "Status",
      options: ["All", "Completed", "Ongoing", "Scheduled", "Draft", "Paused"],
    },

    {
      key: "dateRange",
      label: "Date",
      options: [
        "All Time",
        "Last 7 days",
        "Last 30 days",
        "Last 90 days",
        "Custom Range",
      ],
    },
  ];

  // Handle selection
  const handleSelect = (selectedRows: any[]) => {
    console.log("Selected rows:", selectedRows);
  };

  // Handle add to campaign
  const handleAddToCompaign = (selectedRows: any[]) => {
    console.log("Add to campaign:", selectedRows);
    setIsDrawerOpen(true);
  };

  // Handle download CSV
  const handleDownloadCSV = (selectedRows: any[]) => {
    console.log("Download CSV:", selectedRows);
    const csv = convertToCSV(selectedRows);
    downloadCSV(csv, "campaigns-data.csv");
  };

  // Handle delete compaigns - open modal
  const handleDeletecompaigns = (selectedRows: any[]) => {
    setSelectedcompaignsToDelete(selectedRows);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDeletecompaigns = () => {
    console.log("Deleting compaigns:", selectedcompaignsToDelete);
    // Your actual delete logic here
    setSelectedcompaignsToDelete([]);
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
    const count = selectedcompaignsToDelete.length;
    if (count === 1) {
      return "Are you sure you want to delete this campaign? This action will permanently remove all related data.";
    }
    return `Are you sure you want to delete ${count} campaigns? This action will permanently remove all related data.`;
  };

  return (
    <>
      <div>
        <SharedTable
          columns={columns}
          data={campaignsData}
          title="Campaigns"
          filters={filters}
          searchable={false}
          filterable={true} 
          selectable={true}
          onSelect={handleSelect}
          bottomActions={[
            // {
            //   label: "Add to campaign",
            //   onClick: handleAddToCompaign,
            // },
            {
              label: "Delete campaigns",
              onClick: handleDeletecompaigns,
            },
          ]}
          showSelectionCount={true}
          actionsType="inline"
          actions={(row) => (
            <div className="flex gap-1">
              <button
                className="cursor-pointer bg-white p-2 hover:bg-gray-100 rounded-lg custom-shadow"
                onClick={() => console.log("Edit campaign")}
              >
                <Image
                  src="/images/edit.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                />
              </button>
              <button
                className="cursor-pointer bg-white p-2 hover:bg-gray-100 rounded-lg custom-shadow"
                onClick={() => handleDeletecompaigns([row])}
              >
                <Image
                  src="/images/delete.svg"
                  alt="Delete"
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
        onConfirm={confirmDeletecompaigns}
        title={
          selectedcompaignsToDelete.length === 1
            ? "Delete this campaign?"
            : `Delete ${selectedcompaignsToDelete.length} campaigns?`
        }
        message={getDeleteMessage()}
        icon="/images/bin.svg"
        confirmText="Delete campaign"
        cancelText="Go back"
      />
    </>
  );
};

export default CompaignsTable;
