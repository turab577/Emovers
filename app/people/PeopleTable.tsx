import SharedTable, { Column } from "../shared/SharedTable";

const PeopleTable = ({ setIsDrawerOpen }: { setIsDrawerOpen: (value: boolean) => void }) => {
  // Sample data with images and statuses
  // Define columns with explicit Column[] type
  const columns: Column[] = [
    { key: "name", label: "Name", type: "image" }, // Will show image + text
    { key: "contact", label: "Contact", type: "text" },
    { key: "source", label: "Source", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "company", label: "Company", type: "image" }, // Will show logo + text
    { key: "address", label: "Address", type: "text" },
    { key: "status", label: "Status", type: "status" }, // Will show status badge
  ];

  const peopleData = [
    {
      name: "Floyd Miles",
      name_image: "https://i.pravatar.cc/150?img=1",
      contact: "floyd.miles@gmail.com",
      source: "LinkedIn",
      role: "CEO",
      company: "Google",
      company_image: "https://logo.clearbit.com/google.com",
      address: "Silicon Valley, California",
      status: "New",
    },
    {
      name: "Leslie Alexander",
      name_image: "https://i.pravatar.cc/150?img=2",
      contact: "leslie.alexander@outlook.com",
      source: "Apollo",
      role: "Marketing Manager",
      company: "Microsoft",
      company_image: "https://logo.clearbit.com/microsoft.com",
      address: "Seattle, Washington",
      status: "Contacted",
    },
    {
      name: "Courtney Henry",
      name_image: "https://i.pravatar.cc/150?img=3",
      contact: "courtney.henry@yahoo.com",
      source: "Outreach",
      role: "Product Manager",
      company: "Meta",
      company_image: "https://logo.clearbit.com/meta.com",
      address: "Menlo Park, California",
      status: "Engaged",
    },
    {
      name: "Wade Warren",
      name_image: "https://i.pravatar.cc/150?img=4",
      contact: "wade.warren@gmail.com",
      source: "LinkedIn",
      role: "UI/UX Designer",
      company: "Figma",
      company_image: "https://logo.clearbit.com/figma.com",
      address: "San Francisco, California",
      status: "Converted",
    },
    {
      name: "Jenny Wilson",
      name_image: "https://i.pravatar.cc/150?img=5",
      contact: "jenny.wilson@icloud.com",
      source: "Apollo",
      role: "HR Manager",
      company: "Netflix",
      company_image: "https://logo.clearbit.com/netflix.com",
      address: "Los Gatos, California",
      status: "Not interested",
    },
    {
      name: "Albert Flores",
      name_image: "https://i.pravatar.cc/150?img=6",
      contact: "albert.flores@gmail.com",
      source: "LinkedIn",
      role: "Software Engineer",
      company: "Amazon",
      company_image: "https://logo.clearbit.com/amazon.com",
      address: "Seattle, Washington",
      status: "New",
    },
    {
      name: "Cameron Williamson",
      name_image: "https://i.pravatar.cc/150?img=7",
      contact: "cameron.williamson@protonmail.com",
      source: "Outreach",
      role: "Frontend Developer",
      company: "Vordx Technologies",
      company_image: "https://logo.clearbit.com/vercel.com",
      address: "Lahore, Pakistan",
      status: "Engaged",
    },
    {
      name: "Brooklyn Simmons",
      name_image: "https://i.pravatar.cc/150?img=8",
      contact: "brooklyn.simmons@gmail.com",
      source: "LinkedIn",
      role: "Sales Executive",
      company: "Salesforce",
      company_image: "https://logo.clearbit.com/salesforce.com",
      address: "New York, USA",
      status: "Contacted",
    },
    {
      name: "Theresa Webb",
      name_image: "https://i.pravatar.cc/150?img=9",
      contact: "theresa.webb@gmail.com",
      source: "Apollo",
      role: "Project Manager",
      company: "Trello",
      company_image: "https://logo.clearbit.com/trello.com",
      address: "Austin, Texas",
      status: "Converted",
    },
    {
      name: "Esther Howard",
      name_image: "https://i.pravatar.cc/150?img=10",
      contact: "esther.howard@live.com",
      source: "LinkedIn",
      role: "Data Analyst",
      company: "Spotify",
      company_image: "https://logo.clearbit.com/spotify.com",
      address: "Stockholm, Sweden",
      status: "Engaged",
    },
    {
      name: "Guy Hawkins",
      name_image: "https://i.pravatar.cc/150?img=11",
      contact: "guy.hawkins@gmail.com",
      source: "Apollo",
      role: "CTO",
      company: "Apple",
      company_image: "https://logo.clearbit.com/apple.com",
      address: "Cupertino, California",
      status: "New",
    },
    {
      name: "Dianne Russell",
      name_image: "https://i.pravatar.cc/150?img=12",
      contact: "dianne.russell@gmail.com",
      source: "Outreach",
      role: "HR Lead",
      company: "Zoom",
      company_image: "https://logo.clearbit.com/zoom.us",
      address: "San Jose, California",
      status: "Not interested",
    },
    {
      name: "Eleanor Pena",
      name_image: "https://i.pravatar.cc/150?img=13",
      contact: "eleanor.pena@outlook.com",
      source: "LinkedIn",
      role: "Account Executive",
      company: "Slack",
      company_image: "https://logo.clearbit.com/slack.com",
      address: "New York, USA",
      status: "Converted",
    },
    {
      name: "Marvin McKinney",
      name_image: "https://i.pravatar.cc/150?img=14",
      contact: "marvin.mckinney@gmail.com",
      source: "Outreach",
      role: "Software Engineer",
      company: "Atlassian",
      company_image: "https://logo.clearbit.com/atlassian.com",
      address: "Sydney, Australia",
      status: "Engaged",
    },
    {
      name: "Annette Black",
      name_image: "https://i.pravatar.cc/150?img=15",
      contact: "annette.black@gmail.com",
      source: "Apollo",
      role: "Product Designer",
      company: "Dribbble",
      company_image: "https://logo.clearbit.com/dribbble.com",
      address: "Toronto, Canada",
      status: "Contacted",
    },
    {
      name: "Ralph Edwards",
      name_image: "https://i.pravatar.cc/150?img=16",
      contact: "ralph.edwards@gmail.com",
      source: "LinkedIn",
      role: "Marketing Head",
      company: "Canva",
      company_image: "https://logo.clearbit.com/canva.com",
      address: "Sydney, Australia",
      status: "New",
    },
    {
      name: "Jacob Jones",
      name_image: "https://i.pravatar.cc/150?img=17",
      contact: "jacob.jones@gmail.com",
      source: "Outreach",
      role: "Backend Engineer",
      company: "Dropbox",
      company_image: "https://logo.clearbit.com/dropbox.com",
      address: "San Francisco, California",
      status: "Engaged",
    },
    {
      name: "Kathryn Murphy",
      name_image: "https://i.pravatar.cc/150?img=18",
      contact: "kathryn.murphy@icloud.com",
      source: "LinkedIn",
      role: "Talent Acquisition Lead",
      company: "Indeed",
      company_image: "https://logo.clearbit.com/indeed.com",
      address: "Austin, Texas",
      status: "Contacted",
    },
    {
      name: "Jerome Bell",
      name_image: "https://i.pravatar.cc/150?img=19",
      contact: "jerome.bell@gmail.com",
      source: "Apollo",
      role: "DevOps Engineer",
      company: "GitHub",
      company_image: "https://logo.clearbit.com/github.com",
      address: "San Francisco, California",
      status: "Converted",
    },
    {
      name: "Devon Lane",
      name_image: "https://i.pravatar.cc/150?img=20",
      contact: "devon.lane@gmail.com",
      source: "Outreach",
      role: "Data Scientist",
      company: "OpenAI",
      company_image: "https://logo.clearbit.com/openai.com",
      address: "San Francisco, California",
      status: "Engaged",
    },
  ];

  // Define filters
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
  const handleAddToCampaign = (selectedRows: any[]) => {
    console.log("Add to campaign:", selectedRows);
    setIsDrawerOpen(true);
  };

  // Handle download CSV
  const handleDownloadCSV = (selectedRows: any[]) => {
    console.log("Download CSV:", selectedRows);
    // Your CSV download logic here
    const csv = convertToCSV(selectedRows);
    downloadCSV(csv, "people-data.csv");
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

  return (
    <div>
      <SharedTable
        columns={columns}
        data={peopleData}
        title={
          <div>
            People <span className="text-orange-500 text-sm">11.3M</span>
          </div>
        }
        filters={filters}
        searchable={false}
        filterable={true}
        selectable={true}
        onSelect={handleSelect}
        // Dynamic bottom actions - pass array of actions or false to hide
        bottomActions={[
          {
            label: "Add to campaign",
            onClick: handleAddToCampaign,
          },
          {
            label: "Download as CSV",
            onClick: handleDownloadCSV,
          },
        ]}
        showSelectionCount={true}
      />
    </div>
  );
};

export default PeopleTable;
