import { useState, useEffect, useCallback, useRef } from "react";
import SharedTable, { Column } from "../shared/SharedTable";
import ConfirmationModal from "../shared/ConfirmationModal";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AddLocationDrawer from "./AddLocationDrawer";
import EditDrawer from "./EditDrawer";
import LocationDetailDrawer from "./LocationDetailDrawer";
import toast from "react-hot-toast";
import { Pencil, Eye } from "lucide-react";
import { locationsAPI } from "../api/locations";

const LocationsTable = ({
  setIsDrawerOpen,
}: {
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLocationsToDelete, setSelectedLocationsToDelete] = useState<any[]>([]);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [isDeleting, setIsDeleting] = useState(false); // Add deleting state

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Track if this is initial load
  const initialLoadRef = useRef(true);

  const getDisplayLabel = (filterKey: string, selectedValue: string) => {
    if (!selectedValue || selectedValue.startsWith("All")) {
      switch (filterKey) {
        case "status":
          return "Status";
        default:
          return filterKey;
      }
    }
    return selectedValue;
  };

  // Get filter configurations (if needed for locations)
  const getFilterConfigs = () => {
    return [
      {
        key: "status",
        label: getDisplayLabel("status", activeFilters["status"] || ""),
        options: [
          "All",
          "ACTIVE",
          "INACTIVE"
        ],
      },
    ];
  };

  // Fetch locations with search parameter
  const fetchLocations = useCallback(async (page: number = 1, filters: Record<string, string> = {}, search: string = "") => {
    try {
      setLoading(true);
      
      console.log('Fetching locations with search:', search);
      
      // Pass search term to API
      const response = await locationsAPI.getLocations(search);
      
      if (response && response.success && Array.isArray(response.data)) {
        console.log('Locations data array:', response.data);
        
        // Filter by status if active filter is set
        let filteredData = response.data;
        if (filters.status && filters.status !== "All") {
          filteredData = response.data.filter((location: any) => 
            location.status === filters.status
          );
        }
        
        const transformedData = filteredData.map((location: any) => ({
          id: location.id,
          locationName: location.title,
          locationTitle: location.title,
          description: location.description,
          imageUrl: location.imageUrl,
          createdBy: location.createdBy,
          createdAt: new Date(location.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          updatedAt: new Date(location.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          originalData: location
        }));
        
        setLocations(transformedData);
        
        // Set pagination based on data length
        setPagination({
          total: transformedData.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(transformedData.length / 10)
        });
      } else {
        console.error('Invalid response format:', response);
        setLocations([]);
        toast.error('Failed to load locations');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to fetch locations');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((searchValue: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (searchValue.trim().length === 0 || searchValue.trim().length < 3) {
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        fetchLocations(1, activeFilters, "");
      } else if (searchValue.trim().length === 0) {
        setCurrentPage(1);
        fetchLocations(1, activeFilters, "");
      }
      return;
    }
    
    debounceTimer.current = setTimeout(() => {
      console.log('Debounced search triggered with:', searchValue);
      setCurrentPage(1);
      // Call API with search term
      fetchLocations(1, activeFilters, searchValue);
    }, 500);
  }, [fetchLocations, activeFilters]);

  // Initial fetch on mount
  useEffect(() => {
    fetchLocations(1, {}, "");
  }, [fetchLocations]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters };
    
    if (value.startsWith("All")) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    
    setActiveFilters(newFilters);
    setCurrentPage(1);
    initialLoadRef.current = false;
    fetchLocations(1, newFilters, searchTerm);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
    initialLoadRef.current = false;
    fetchLocations(1, {}, "");
  };

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    debouncedSearch(searchValue);
  };

  const handlePageChange = (page: number) => {
    console.log('Page change requested to:', page);
    setCurrentPage(page);
    initialLoadRef.current = false;
  };

  const openDetail = (row: any) => {
    setSelectedLocation(row.originalData);
    setDetailDrawerOpen(true);
  };

  const openEdit = (row: any) => {
    setSelectedLocation(row.originalData);
    setEditDrawerOpen(true);
  };

  // Define columns
  const columns: Column[] = [
    {
      key: "locationName",
      label: "Location Name",
      type: "text"
    },
    { 
      key: "description", 
      label: "Description", 
      type: "text" 
    },
    { 
      key: "createdAt", 
      label: "Created Date", 
      type: "text"
    },
    {
      key: "actions",
      label: "Actions",
      type: "custom",
      render: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => openDetail(row)} 
            className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg hover:bg-gray-50"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => openEdit(row)} 
            className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg hover:bg-gray-50"
            title="Edit Location"
          >
            <Pencil size={16} />
          </button>
          <button
            className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg hover:bg-gray-50"
            onClick={() => handleDeleteLocations([row])}
            title="Delete Location"
          >
            <Image
              src="/images/delete.svg"
              alt="Delete"
              width={16}
              height={16}
            />
          </button>
        </div>
      )
    }
  ];

  const handleSelect = (selectedRows: any[]) => {
    setSelectedLocationsToDelete(selectedRows);
  };

  const handleAddToCampaign = () => {
    setIsDrawerOpen(true);
  };

  const handleDeleteLocations = (selectedRows: any[]) => {
    setSelectedLocationsToDelete(selectedRows);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteLocations = async () => {
    try {
      setIsDeleting(true);
      
      // Delete locations using the API
      const deletePromises = selectedLocationsToDelete.map(location => 
        locationsAPI.deleteLocation(location.id)
      );
      
      const results = await Promise.all(deletePromises);
      
      // Check if all deletions were successful
      const allSuccess = results.every(result => result && result.success);
      
      if (allSuccess) {
        const count = selectedLocationsToDelete.length;
        toast.success(count === 1 
          ? 'Location deleted successfully' 
          : `${count} locations deleted successfully`
        );
        
        // Refresh with current page
        await fetchLocations(currentPage, activeFilters, searchTerm);
        
        setSelectedLocationsToDelete([]);
      } else {
        // Find failed deletions
        const failedLocations = results
          .map((result, index) => (!result || !result.success) ? selectedLocationsToDelete[index] : null)
          .filter(Boolean);
        
        if (failedLocations.length === selectedLocationsToDelete.length) {
          toast.error('Failed to delete locations. Please try again.');
        } else {
          toast.error(`Failed to delete ${failedLocations.length} location(s). Please try again.`);
          // Still refresh to show current state
          await fetchLocations(currentPage, activeFilters, searchTerm);
        }
      }
    } catch (error) {
      console.error('Error deleting locations:', error);
      toast.error('Failed to delete locations. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const getDeleteMessage = () => {
    const count = selectedLocationsToDelete.length;
    if (count === 1) {
      const location = selectedLocationsToDelete[0];
      return `Are you sure you want to delete location "${location.locationName}"? This action cannot be undone.`;
    }
    return `Are you sure you want to delete ${count} locations? This action cannot be undone.`;
  };

  const bottomActions = [
    {
      label: "Add to campaign",
      onClick: handleAddToCampaign,
    },
    {
      label: "Delete locations",
      onClick: () => {
        if (selectedLocationsToDelete.length === 0) {
          toast.error("Please select at least one location to delete");
          return;
        }
        setIsDeleteModalOpen(true);
      },
    },
  ];

  // Calculate paginated data for client-side pagination
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return locations.slice(startIndex, endIndex);
  };

  if (loading && initialLoadRef.current) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading locations...</div>
      </div>
    );
  }

  return (
    <>
      <div>
        <SharedTable
          columns={columns}
          data={getPaginatedData()} // Use paginated data
          title={
            <div className="flex gap-[6px] items-center">
              <p>Locations</p>
              <p className="heading-7 font-medium text-[#70747D]">{pagination.total || locations.length}</p>
            </div>
          }
          filters={getFilterConfigs()}
          searchable={true}
          filterable={false}
          selectable={true}
          onSelect={handleSelect}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          pagination={{
            total: pagination.total,
            page: currentPage, // Use currentPage state
            limit: pagination.limit,
            totalPages: pagination.totalPages
          }}
          showResetButton={Object.keys(activeFilters).length > 0 || searchTerm !== ""}
          onResetFilters={handleResetFilters}
          bottomActions={bottomActions}
          showSelectionCount={true}
          actionsType="custom"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteLocations}
        title={
          selectedLocationsToDelete.length === 1
            ? `Delete Location?`
            : `Delete ${selectedLocationsToDelete.length} Locations?`
        }
        message={getDeleteMessage()}
        icon="/images/bin.svg"
        confirmText={isDeleting ? "Deleting..." : "Delete Location"}
        cancelText="Go back"
        isLoading={isDeleting}
        disabled={isDeleting}
      />

      {/* Edit Location Drawer */}
      <AnimatePresence>
        {editDrawerOpen && selectedLocation && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <EditDrawer 
                location={selectedLocation}
                locationId={selectedLocation?.id}
                onClose={() => {
                  setEditDrawerOpen(false);
                }}
                onSuccess={() => {
                  setEditDrawerOpen(false);
                  fetchLocations(currentPage, activeFilters, searchTerm);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Location Detail Drawer (Eye icon click) */}
      <AnimatePresence>
        {detailDrawerOpen && selectedLocation && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <LocationDetailDrawer 
                locationId={selectedLocation.id.toString()}
                onClose={() => setDetailDrawerOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LocationsTable;