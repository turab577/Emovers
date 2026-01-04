import { useState, useEffect, useCallback, useRef } from "react";
import SharedTable, { Column } from "../shared/SharedTable";
import ConfirmationModal from "../shared/ConfirmationModal";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import AddServiceDrawer from "./AddServiceDrawer";
import EditDrawer from "./EditDrawer";
import toast from "react-hot-toast";
import { servicesApi } from "../api/services";

const ServicesTable = ({
  setIsDrawerOpen,
}: {
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServicesToDelete, setSelectedServicesToDelete] = useState<any[]>([]);
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(true);

  const handleCloseDrawer = ()=>{
    setAddDrawerOpen(false);
    fetchServices()
  }

  // Get filter configurations
  const getFilterConfigs = () => {
    return [
      {
        key: "type",
        label: getDisplayLabel("type", activeFilters["type"] || ""),
        options: [
          "All",
          "MOVING",
          "STORAGE"
        ],
      },
    ];
  };

  const getDisplayLabel = (filterKey: string, selectedValue: string) => {
    if (!selectedValue || selectedValue === "All") {
      switch (filterKey) {
        case "type":
          return "Type";
        default:
          return filterKey;
      }
    }
    return selectedValue;
  };

  // Fetch services with filters and search
  const fetchServices = useCallback(async (page: number = 1, filters: Record<string, string> = {}, search: string = "") => {
    try {
      setLoading(true);
      
      // Prepare API filters - match the pattern from locationsAPI
      const apiFilters: { type?: string; search?: string } = {};
      
      if (filters.type && filters.type !== "All") {
        apiFilters.type = filters.type;
      }
      
      if (search.trim()) {
        apiFilters.search = search.trim();
      }
      
      console.log('Calling services API with filters:', apiFilters);
      
      const response = await servicesApi.getServices(apiFilters);
      
      console.log('Services API response:', response);
      
      // Check if response exists and has success flag
      if (response && response.success && Array.isArray(response.data)) {
        console.log('Services data array:', response.data);
        
        // Filter by type if active filter is set (client-side filtering as backup)
        let filteredData = response.data;
        if (filters.type && filters.type !== "All") {
          filteredData = response.data.filter((service: any) => 
            service.type === filters.type
          );
        }
        
        // Transform data for table
        const transformedData = filteredData.map((service: any) => ({
          id: service.id,
          serviceName: service.title,
          title: service.title,
          type: service.type,
          shortdescription: service.shortdescription,
          heading: service.heading,
          logo: service.logo,
          bannerImg: service.bannerImg,
          description: service.description,
          features: service.features,
          createdAt: service.createdAt ? new Date(service.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : '',
          updatedAt: service.updatedAt ? new Date(service.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : '',
          originalData: service
        }));
        
        console.log('Transformed services data:', transformedData);
        setServices(transformedData);
        
        // Set pagination based on data length
        setPagination({
          total: transformedData.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(transformedData.length / 10)
        });
      } else {
        console.error('Invalid response format from services API:', response);
        setServices([]);
        toast.error('Failed to load services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
      setServices([]);
    } finally {
      setLoading(false);
      initialLoadRef.current = false;
    }
  }, []);

  // Debounced search function - matching locations pattern
  const debouncedSearch = useCallback((searchValue: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (searchValue.trim().length === 0 || searchValue.trim().length < 3) {
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        fetchServices(1, activeFilters, "");
      } else if (searchValue.trim().length === 0) {
        setCurrentPage(1);
        fetchServices(1, activeFilters, "");
      }
      return;
    }
    
    debounceTimer.current = setTimeout(() => {
      console.log('Debounced search triggered with:', searchValue);
      setCurrentPage(1);
      fetchServices(1, activeFilters, searchValue);
    }, 500);
  }, [fetchServices, activeFilters]);

  // Initial fetch on mount
  useEffect(() => {
    console.log('Initial fetch starting...');
    fetchServices(1, {}, "");
  }, [fetchServices]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterKey: string, value: string) => {
    console.log('Filter changed:', filterKey, value);
    
    const newFilters = { ...activeFilters };
    
    if (value === "All") {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    
    setActiveFilters(newFilters);
    setCurrentPage(1);
    initialLoadRef.current = false;
    fetchServices(1, newFilters, searchTerm);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
    initialLoadRef.current = false;
    fetchServices(1, {}, "");
  };

  // Handle search
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    debouncedSearch(searchValue);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    console.log('Page change requested to:', page);
    setCurrentPage(page);
    initialLoadRef.current = false;
  };

  // Open edit drawer
  const openEdit = (row: any) => {
    setSelectedService(row.originalData);
    setEditDrawerOpen(true);
  };

  // Define columns
  const columns: Column[] = [
    {
      key: "serviceName",
      label: "Service Name",
      type: "text",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          {row.logo && (
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={row.logo}
                alt={row.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/default-service.svg';
                }}
              />
            </div>
          )}
          <span className="font-medium">{row.title}</span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      // type: "badge",
      // badgeVariant: (row: any) => {
      //   if (row.type === 'MOVING') return 'blue';
      //   if (row.type === 'STORAGE') return 'green';
      //   return 'gray';
      // },
    },
    {
      key: "shortdescription",
      label: "Short Description",
      type: "text",
      // truncate: true,
    },
    {
      key: "createdAt",
      label: "Created Date",
      type: "text",
    },
    {
      key: "actions",
      label: "Actions",
      type: "custom",
      render: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(row)}
            className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg hover:bg-gray-50 transition-colors"
            title="Edit Service"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
          <button
            className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => handleDeleteServices([row])}
            title="Delete Service"
          >
            <Image
              src="/images/delete.svg"
              alt="Delete"
              width={16}
              height={16}
            />
          </button>
        </div>
      ),
    },
  ];

  // Handle row selection
  const handleSelect = (selectedRows: any[]) => {
    setSelectedServicesToDelete(selectedRows);
  };

  // Handle add to campaign
  const handleAddToCampaign = () => {
    setIsDrawerOpen(true);
  };

  // Handle delete services
  const handleDeleteServices = (selectedRows: any[]) => {
    setSelectedServicesToDelete(selectedRows);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion - updated to match locations pattern
  const confirmDeleteServices = async () => {
    try {
      setIsDeleting(true);
      
      // Delete services using the API
      const deletePromises = selectedServicesToDelete.map(service => 
        servicesApi.deleteService(service.id)
      );
      
      const results = await Promise.all(deletePromises);
      
      // Check if all deletions were successful
      const allSuccess = results.every(result => result && result.success);
      
      if (allSuccess) {
        const count = selectedServicesToDelete.length;
        toast.success(count === 1 
          ? 'Service deleted successfully' 
          : `${count} services deleted successfully`
        );
        
        // Refresh with current page
        await fetchServices(currentPage, activeFilters, searchTerm);
        
        setSelectedServicesToDelete([]);
      } else {
        // Find failed deletions
        const failedServices = results
          .map((result, index) => (!result || !result.success) ? selectedServicesToDelete[index] : null)
          .filter(Boolean);
        
        if (failedServices.length === selectedServicesToDelete.length) {
          toast.error('Failed to delete services. Please try again.');
        } else {
          toast.error(`Failed to delete ${failedServices.length} service(s). Please try again.`);
          // Still refresh to show current state
          await fetchServices(currentPage, activeFilters, searchTerm);
        }
      }
    } catch (error) {
      console.error('Error deleting services:', error);
      toast.error('Failed to delete services. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const getDeleteMessage = () => {
    const count = selectedServicesToDelete.length;
    if (count === 1) {
      const service = selectedServicesToDelete[0];
      return `Are you sure you want to delete service "${service.serviceName}"? This action cannot be undone.`;
    }
    return `Are you sure you want to delete ${count} services? This action cannot be undone.`;
  };

  const bottomActions = [
    {
      label: "Add Service",
      onClick: () => setAddDrawerOpen(true),
    },
    {
      label: "Delete Services",
      onClick: () => {
        if (selectedServicesToDelete.length === 0) {
          toast.error("Please select at least one service to delete");
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
    return services.slice(startIndex, endIndex);
  };

  // Loading state
  if (loading && initialLoadRef.current) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading services...</div>
      </div>
    );
  }

  return (
    <>
      <div>
        <SharedTable
          columns={columns}
          data={getPaginatedData()}
          title={
            <div className="flex gap-[6px] items-center">
              <p>Services</p>
              <p className="heading-7 font-medium text-[#70747D]">{pagination.total || services.length}</p>
            </div>
          }
          filters={getFilterConfigs()}
          searchable={true}
          filterable={true}
          selectable={true}
          onSelect={handleSelect}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          pagination={{
            total: pagination.total,
            page: currentPage,
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
        onConfirm={confirmDeleteServices}
        title={
          selectedServicesToDelete.length === 1
            ? `Delete Service?`
            : `Delete ${selectedServicesToDelete.length} Services?`
        }
        message={getDeleteMessage()}
        icon="/images/bin.svg"
        confirmText={isDeleting ? "Deleting..." : "Delete Service"}
        cancelText="Go back"
        // isLoading={isDeleting}
        // disabled={isDeleting}
      />

      {/* Add Service Drawer */}
      <AnimatePresence>
        {addDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >

<AddServiceDrawer
  onClose={() => setAddDrawerOpen(false)}
  onSuccess={() => {
    setAddDrawerOpen(false); // Close drawer
    fetchServices(currentPage, activeFilters, searchTerm); // Refresh data
  }}
/>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Service Drawer */}
      <AnimatePresence>
        {editDrawerOpen && selectedService && (
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
                service={selectedService}
                onClose={() => {
                  setEditDrawerOpen(false);
                  setSelectedService(null);
                }}
                onSuccess={() => {
                  setEditDrawerOpen(false);
                  setSelectedService(null);
                  fetchServices(currentPage, activeFilters, searchTerm);
                  toast.success('Service updated successfully');
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServicesTable;