import { useState } from "react";
import SharedTable, { Column } from "../shared/SharedTable";
import ConfirmationModal from "../shared/ConfirmationModal";
import Image from "next/image";

const EmailTable = ({
  setIsDrawerOpen,
}: {
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmilToDelete, setSelectedEmilToDelete] = useState<any[]>([]);
  const [emailData, setEmailData] = useState([
    {
      id: 1, // Added unique IDs for proper deletion
      email_subject: "Monthly newsletter",
      leadName_url: "/leads/floyd-miles",
      leads: "200",
      campaign: "Product launch",
      company: "Google, Apple,...",
      open_rate: "56%",
      open_rate_image: "/images/graph-green.png",
      date_sent: "June 12, 2025",
      status: "Sent",
    },
    {
      id: 2,
      email_subject: "Monthly newsletter",
      leadName_url: "/leads/floyd-miles",
      leads: "200",
      campaign: "Product launch",
      company: " Apple",
      open_rate: "23%",
      open_rate_image: "/images/graph-red.png",
      date_sent: "June 12, 2025",
      status: "Opened",
    },
    {
      id: 3,
      email_subject: "Monthly newsletter",
      leadName_url: "/leads/floyd-miles",
      leads: "200",
      campaign: "Product launch",
      company: "Microsoft",
      open_rate: "56%",
      open_rate_image: "/images/graph-green.png",
      date_sent: "June 12, 2025",
      status: "Sent",
    },
    {
      id: 4,
      email_subject: "Monthly newsletter",
      leadName_url: "/leads/floyd-miles",
      leads: "200",
      campaign: "Product launch",
      company: "Google ",
      open_rate: "23%",
      open_rate_image: "/images/graph-red.png",
      date_sent: "June 12, 2025",
      status: "Opened",
    },
    {
      id: 5,
      email_subject: "Monthly newsletter",
      leadName_url: "/leads/floyd-miles",
      leads: "200",
      campaign: "Product launch",
      company: "Netflix",
      open_rate: "56%",
      open_rate_image: "/images/graph-green.png",
      date_sent: "June 12, 2025",
      status: "Sent",
    },
  ]);

  const [tableKey, setTableKey] = useState(0); // Add this key state

  // Define columns with explicit Column[] type
  const columns: Column[] = [
    {
      key: "email_subject",
      label: "Email subject",
      type: "text",
      linkUrlKey: "leadName_url",
    },
    { key: "leads", label: "Leads", type: "text" },
    { key: "campaign", label: "Campaign", type: "text" },
    { key: "company", label: "Company", type: "text" },
    {
      key: "open_rate",
      label: "Open Rate",
      type: "image",
      imagePosition: "right",
    },
    { key: "date_sent", label: "Date sent", type: "text" },
    { key: "status", label: "Status", type: "status" },
  ];

  // Define filters
  const filters = [
    {
      key: "status",
      label: "Status",
      options: ["All", "Sent", "Opened"],
    },
    {
      key: "company",
      label: "Company Name",
      options: ["Google", "Microsoft", "Netflix", "Apple"],
    },
    {
      key: "date_range",
      label: "Date range",
      options: ["All", "June 12, 2025", "11-50 employees"],
    },
  ];

  // Handle selection
  const handleSelect = (selectedRows: any[]) => {
    console.log("Selected rows:", selectedRows);
  };

  // Handle add to campaign
  const handleAddToCampaign = (selectedRows: any[]) => {
    console.log("Add to campaign:", selectedRows);
    setIsDrawerOpen(true);
  };

  // Handle delete leads - open modal
  const handleDeleteEmail = (selectedRows: any[]) => {
    setSelectedEmilToDelete(selectedRows);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEmail = () => {
    console.log("Deleting email:", selectedEmilToDelete);

    // ACTUAL DELETE LOGIC - Remove selected rows from state
    if (selectedEmilToDelete.length > 0) {
      // Get IDs of rows to delete
      const idsToDelete = selectedEmilToDelete.map((row) => row.id);

      // Filter out the deleted rows
      const updatedData = emailData.filter(
        (row) => !idsToDelete.includes(row.id)
      );

      // Update state with filtered data
      setEmailData(updatedData);
    }

    // Reset selection and close modal
    setSelectedEmilToDelete([]);
    setIsDeleteModalOpen(false);

    // Force table to re-render and clear selections
    setTableKey((prev) => prev + 1);
  };

  // Helper function to convert data to CSV
  // const convertToCSV = (data: any[]) => {
  //   const headers = columns.map((col) => col.label).join(",");
  //   const rows = data.map((row) =>
  //     columns.map((col) => row[col.key]).join(",")
  //   );
  //   return [headers, ...rows].join("\n");
  // };

  // Helper function to download CSV
  // const downloadCSV = (csv: string, filename: string) => {
  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = filename;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // };

  const getDeleteMessage = () => {
    const count = selectedEmilToDelete.length;
    if (count === 1) {
      return "Are you sure you want to delete this email? This action will permanently remove all related data.";
    }
    return `Are you sure you want to delete ${count} emails? This action will permanently remove all related data.`;
  };

  return (
    <>
      <div>
        <SharedTable
          columns={columns}
          key={tableKey} // Add this key to force re-render
          data={emailData}
          title={<div>Emails sent</div>}
          filters={filters}
          searchable={false}
          filterable={true}
          selectable={true}
          hidePagination={true}
          onSelect={handleSelect}
          bottomActions={[
            // {
            //   label: "Add to campaign",
            //   onClick: handleAddToCampaign,
            // },
            {
              label: "Delete email",
              onClick: handleDeleteEmail,
            },
          ]}
          showSelectionCount={true}
          actionsType="inline"
          actions={(row) => (
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
              <button
                className="cursor-pointer"
                onClick={() => handleDeleteEmail([row])}
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
          setSelectedEmilToDelete([]); // Reset selection on cancel
        }}
        onConfirm={confirmDeleteEmail}
        title={
          selectedEmilToDelete.length === 1
            ? "Delete this email?"
            : `Delete ${selectedEmilToDelete.length} emails?`
        }
        message={getDeleteMessage()}
        icon="/images/bin.svg"
        confirmText="Delete email"
        cancelText="Go back"
        type="danger"
      />
    </>
  );
};

export default EmailTable;
