import { useState } from "react";
import SharedTable, { Column } from "../shared/SharedTable";
import ConfirmationModal from "../shared/ConfirmationModal";
// import ActionDropdown from "../shared/ActionDropdown";
import Image from "next/image";

const LeadsTable = ({
  setIsDrawerOpen,
}: {
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLeadsToDelete, setSelectedLeadsToDelete] = useState<any[]>([]);

  // Define columns with explicit Column[] type
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
    { key: "company", label: "Company", type: "image" },
    { key: "address", label: "Address", type: "text" },
    { key: "status", label: "Status", type: "status" },
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
    {
      leadName: "Guy Hawkins",
      leadName_image: "https://i.pravatar.cc/150?img=11",

      contact: "guy.hawkins@gmail.com",
      source: "Apollo",
      role: "CTO",
      company: "Apple",
      company_image: "https://logo.clearbit.com/apple.com",
      leadName_url: "/leads/floyd-miles",

      address: "Cupertino, California",
      status: "New",
    },
    {
      leadName: "Dianne Russell",
      leadName_image: "https://i.pravatar.cc/150?img=12",

      contact: "dianne.russell@gmail.com",
      source: "Outreach",
      role: "HR Lead",
      company: "Zoom",
      company_image: "https://logo.clearbit.com/zoom.us",
      leadName_url: "/leads/floyd-miles",

      address: "San Jose, California",
      status: "Not interested",
    },
    {
      leadName: "Eleanor Pena",
      leadName_image: "https://i.pravatar.cc/150?img=13",

      contact: "eleanor.pena@outlook.com",
      source: "LinkedIn",
      role: "Account Executive",
      company: "Slack",
      company_image: "https://logo.clearbit.com/slack.com",
      leadName_url: "/leads/floyd-miles",

      address: "New York, USA",
      status: "Converted",
    },
    {
      leadName: "Marvin McKinney",
      leadName_image: "https://i.pravatar.cc/150?img=14",

      contact: "marvin.mckinney@gmail.com",
      source: "Outreach",
      role: "Software Engineer",
      company: "Atlassian",
      company_image: "https://logo.clearbit.com/atlassian.com",
      leadName_url: "/leads/floyd-miles",

      address: "Sydney, Australia",
      status: "Engaged",
    },
    {
      leadName: "Annette Black",
      leadName_image: "https://i.pravatar.cc/150?img=15",

      contact: "annette.black@gmail.com",
      source: "Apollo",
      role: "Product Designer",
      company: "Dribbble",
      company_image: "https://logo.clearbit.com/dribbble.com",
      leadName_url: "/leads/floyd-miles",

      address: "Toronto, Canada",
      status: "Contacted",
    },
    {
      leadName: "Ralph Edwards",
      leadName_image: "https://i.pravatar.cc/150?img=16",

      contact: "ralph.edwards@gmail.com",
      source: "LinkedIn",
      role: "Marketing Head",
      company: "Canva",
      company_image: "https://logo.clearbit.com/canva.com",
      leadName_url: "/leads/floyd-miles",

      address: "Sydney, Australia",
      status: "New",
    },
    {
      leadName: "Jacob Jones",
      leadName_image: "https://i.pravatar.cc/150?img=17",

      contact: "jacob.jones@gmail.com",
      source: "Outreach",
      role: "Backend Engineer",
      company: "Dropbox",
      company_image: "https://logo.clearbit.com/dropbox.com",
      leadName_url: "/leads/floyd-miles",

      address: "San Francisco, California",
      status: "Engaged",
    },
    {
      leadName: "Kathryn Murphy",
      leadName_image: "https://i.pravatar.cc/150?img=18",
      leadName_url: "/leads/floyd-miles",

      contact: "kathryn.murphy@icloud.com",
      source: "LinkedIn",
      role: "Talent Acquisition Lead",
      company: "Indeed",
      company_image: "https://logo.clearbit.com/indeed.com",

      address: "Austin, Texas",
      status: "Contacted",
    },
    {
      leadName: "Jerome Bell",
      leadName_image: "https://i.pravatar.cc/150?img=19",
      leadName_url: "/leads/floyd-miles",

      contact: "jerome.bell@gmail.com",
      source: "Apollo",
      role: "DevOps Engineer",
      company: "GitHub",
      company_image: "https://logo.clearbit.com/github.com",

      address: "San Francisco, California",
      status: "Converted",
    },
    {
      leadName: "Devon Lane",
      leadName_image: "https://i.pravatar.cc/150?img=20",

      contact: "devon.lane@gmail.com",
      source: "Outreach",
      role: "Data Scientist",
      company: "OpenAI",
      company_image: "https://logo.clearbit.com/openai.com",
      leadName_url: "/leads/floyd-miles",

      address: "San Francisco, California",
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
      return "Are you sure you want to delete this lead? This action will permanently remove all related data.";
    }
    return `Are you sure you want to delete ${count} leads? This action will permanently remove all related data.`;
  };

  return (
    <>
      <div>
        <SharedTable
          columns={columns}
          data={peopleData}
          title={<div>Leads</div>}
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
              <button
                className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg"
                onClick={() => handleAddToCampaign()}
              >
                <Image
                  src="/images/mail-plus-black.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                />
              </button>
              <button className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg">
                <Image
                  src="/images/calender-down.svg"
                  alt="Edit"
                  width={16}
                  height={16}
                />
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
            ? "Delete this lead?"
            : `Delete ${selectedLeadsToDelete.length} leads?`
        }
        message={getDeleteMessage()}
        icon="/images/bin.svg"
        confirmText="Delete lead"
        cancelText="Go back"
      />
    </>
  );
};

export default LeadsTable;
