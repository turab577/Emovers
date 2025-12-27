"use client";
import React, { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import Pagination from "./Pagination";
import ActionDropdown from "./ActionDropdown";

export interface BottomAction {
  label: string;
  onClick: (selectedRows: Record<string, unknown>[]) => void;
  className?: string;
}

export type Column = {
  key: string;
  label: string;
  type?: "text" | "image" | "status" | "link";
  linkUrlKey?: string;
  imagePosition?: "left" | "right";
};

interface ExceptionTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  title?: string;
  isBorder?:boolean;
  filters?: { key: string; label: string; options: string[] }[];
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  actions?: (row: Record<string, unknown>) => React.ReactNode;
  onSelect?: (selectedRows: Record<string, unknown>[]) => void;
  bottomActions?: BottomAction[] | false;
  showSelectionCount?: boolean;
  actionsType?: "dropdown" | "inline" | "buttons";
  hidePagination?: boolean;
}

// Custom Checkbox Component
const CustomCheckbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ checked, onChange }) => {
  return (
    <div
      className="relative w-[18px] h-[18px] cursor-pointer"
      onClick={() => onChange(!checked)}
    >
      <div
        className={`w-full h-full rounded border-2 transition-all ${
          checked
            ? "bg-orange-500 border-orange-500"
            : "bg-white border-gray-300"
        }`}
      >
        {checked && (
          <div className="relative w-full h-full">
            {/* Large tick */}
            <svg
              className="absolute top-0.5"
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
            >
              <path
                d="M1 5L4.5 8.5L11 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Small tick */}
            <svg
              className="absolute top-[7px] left-1"
              width="8"
              height="6"
              viewBox="0 0 8 6"
              fill="none"
            >
              <path
                d="M1 3L3 5L7 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "new":
        return "text-[#11224E]";
      case "contacted":
        return "text-[#D2CB15]";
      case "engaged":
        return "text-[#E861F4]";
      case "converted":
        return "text-[#0CD767]";
      case "completed":
        return "text-[#0CD767]";
      case "ongoing":
        return "text-[#E28413]";
      case "scheduled":
        return "text-[#11224E]";
      case "not interested":
        return "text-[#EA3232]";
      case "sent":
        return "text-[#11224E]";
      case "opened":
        return "text-[#0CD767]";
      default:
        return "text-[#11224E] ";
    }
  };

  return (
    <span
      className={`inline-flex bg-[#F6F6F6] items-center px-2 py-1.5 rounded-full text-[12px] font-normal ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

// Image Cell Component
// Image Cell Component
const ImageCell: React.FC<{
  image: string;
  text: string;
  imagePosition?: "left" | "right";
}> = ({ image, text, imagePosition = "left" }) => {
  return (
    <div
      className={`flex items-center gap-2 ${
        imagePosition === "right" ? "justify-start" : ""
      }`}
    >
      {imagePosition === "left" && (
        <img
          src={image}
          alt={text}
          className="w-4 h-4 rounded-full "
        />
      )}
      <span>{text}</span>
      {imagePosition === "right" && (
        <img
          src={image}
          alt={text}
          className="w-4 h-4  "
        />
      )}
    </div>
  );
};
const ExceptionTable: React.FC<ExceptionTableProps> = ({
  columns,
  data,
  title,
  isBorder = true,
  actionsType = "inline",
  filters = [],
  searchable = true,
  filterable = true,
  selectable = true,
  actions,
  onSelect,
  bottomActions,
  showSelectionCount = true,
  hidePagination = false, // Add this with default value
}) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // handle selection
  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? paginatedData : [];
    setSelectedRows(newSelection);
    onSelect?.(newSelection);
  };

  const handleSelectRow = (row: any, checked: boolean) => {
    const newSelection = checked
      ? [...selectedRows, row]
      : selectedRows.filter((r) => r !== row);
    setSelectedRows(newSelection);
    onSelect?.(newSelection);
  };

  // filter & search logic
  const filteredData = data
    .filter((row) =>
      Object.keys(filterValues).every(
        (key) => !filterValues[key] || row[key] === filterValues[key]
      )
    )
    .filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
    );

  // pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  const renderCell = (row: any, col: Column) => {
    const value = row[col.key];

    switch (col.type) {
      case "status":
        return <StatusBadge status={value} />;
      case "image":
        return (
          <ImageCell
            image={row[`${col.key}_image`]}
            text={value}
            imagePosition={col.imagePosition} // Pass the image position
          />
        );
      case "link":
        return (
          <a
            href={col.linkUrlKey ? row[col.linkUrlKey] : "#"}
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            {row[`${col.key}_image`] && (
              <img
                src={row[`${col.key}_image`]}
                alt={value}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            {value}
          </a>
        );

      default:
        return value;
    }
  };

  return (
    <div className={`bg-white  ${isBorder ? "border border-[#ECEDEE]" : ""}  rounded-xl relative`}>
      <div className="flex flex-wrap items-center  mb-3 mt-6">
        <div>
          <h2 className="body-1 font-medium text-[#111827]">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {searchable && (
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-orange-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {filterable && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <FilterDropdown
                  key={filter.key}
                  label={filter.label}
                  options={filter.options}
                  value={filterValues[filter.key] || ""}
                  onChange={(value) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      [filter.key]: value,
                    }))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="min-w-full border-collapse ">
          <thead>
            <tr className="bg-[#F2F2F2] rounded-lg text-left text-[12px] text-[#111827] uppercase">
              {selectable && (
                <th className="p-4">
                  <CustomCheckbox
                    checked={
                      paginatedData.length > 0 &&
                      selectedRows.length === paginatedData.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className="p-3 font-semibold">
                  {col.label}
                </th>
              ))}
              {actions && <th className="p-3">Action</th>}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 border-l text-[12px] font-normal text-[#414652] border-b border-[#cfd1d4]"
              >
                {selectable && (
                  <td className="p-4">
                    <CustomCheckbox
                      checked={selectedRows.includes(row)}
                      onChange={(checked) => handleSelectRow(row, checked)}
                    />
                  </td>
                )}

                {columns.map((col) => (
                  <td key={col.key} className="p-4">
                    {renderCell(row, col)}
                  </td>
                ))}

                {actions && (
                  <td className="p-4 relative">
                    {actionsType === "dropdown" ? (
                      <ActionDropdown actions={actions} row={row} />
                    ) : (
                      actions(row)
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hidePagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {/* Bottom Action Bar */}
      {selectedRows.length > 0 && bottomActions !== false && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#11224E] text-white rounded-sm p-3 flex items-center gap-3 z-50">
          {showSelectionCount && (
            <>
              <span className="font-medium text-[#FFFFFFCC] text-[12px]">
                {selectedRows.length} selected
              </span>
              <div className="w-px h-3 bg-gray-600"></div>
            </>
          )}

          {Array.isArray(bottomActions) &&
            bottomActions.map((action, i) => (
              <React.Fragment key={i}>
                <button
                  onClick={() => action.onClick(selectedRows)}
                  className={
                    action.className ||
                    "hover:text-orange-400 transition-colors text-[12px]"
                  }
                >
                  {action.label}
                </button>
                {i < bottomActions.length - 1 && (
                  <div className="w-px h-3 bg-gray-600"></div>
                )}
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
};

export default ExceptionTable;
