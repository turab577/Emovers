import React from "react";
import SharedTable from "../shared/SharedTable";

const Table = () => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
  ];

  const data = [
    { id: 1, name: "Hussain", email: "hussain@example.com", status: "Active" },
    { id: 2, name: "Ali", email: "ali@example.com", status: "Inactive" },
    { id: 3, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 4, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 5, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 6, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 7, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 8, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 9, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 10, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 11, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 12, name: "Sara", email: "sara@example.com", status: "Active" },
    { id: 13, name: "Sara", email: "sara@example.com", status: "Active" },
  ];

  const filters = [
    { key: "status", label: "Status", options: ["Active", "Inactive"] },
    { key: "role", label: "Role", options: ["Admin", "Manager", "User"] },
    { key: "location", label: "Location", options: ["Lahore", "Karachi"] },
  ];

  return (
    <div>
      <SharedTable
        columns={columns}
        data={data}
        searchable={false}
        filterable
        selectable
        filters={filters}
        actions={(row) => (
          <ul>
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
              Delete
            </li>
          </ul>
        )}
        onSelect={(rows) => console.log("Selected rows:", rows)}
      />
    </div>
  );
};

export default Table;
