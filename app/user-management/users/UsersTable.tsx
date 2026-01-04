import { useState, useEffect, useCallback, useRef } from "react";
import SharedTable, { Column } from "../../shared/SharedTable";
import ConfirmationModal from "../../shared/ConfirmationModal";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DetailDrawer from "./DetailDrawer";
import EditDrawer from "./EditDrawer";
import { userAPI } from "@/app/api/users-management";
import toast from "react-hot-toast";

const UsersTable = ({
  setIsDrawerOpen,
}: {
  setIsDrawerOpen: (value: boolean) => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUsersToDelete, setSelectedUsersToDelete] = useState<any[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 2,
    totalPages: 10
  });

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Track if this is initial load
  const initialLoadRef = useRef(true);

  const getDisplayLabel = (filterKey: string, selectedValue: string) => {
    if (!selectedValue || selectedValue.startsWith("All")) {
      switch (filterKey) {
        case "status":
          return "Status";
        case "role":
          return "Role";
        case "emailVerified":
          return "Email Verified";
        default:
          return filterKey;
      }
    }

    switch (filterKey) {
      case "status":
        return selectedValue.split('_').map(word => 
          word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ');
      case "role":
        return selectedValue.charAt(0) + selectedValue.slice(1).toLowerCase();
      case "emailVerified":
        return selectedValue;
      default:
        return selectedValue;
    }
  };

  const getFilterConfigs = () => {
    return [
      {
        key: "status",
        label: getDisplayLabel("status", activeFilters["status"] || ""),
        options: [
          "All Statuses",
          "ACTIVE",
          "PENDING_VERIFICATION",
          "INACTIVE"
        ],
      },
      {
        key: "role",
        label: getDisplayLabel("role", activeFilters["role"] || ""),
        options: [
          "All Roles",
          "USER",
          "ADMIN"
        ],
      },
    ];
  };

  // Fetch users with filters and pagination
  const fetchUsers = useCallback(async (page: number = 1, filters: Record<string, string> = {}, search: string = "") => {
    try {
      setLoading(true);
      
      const params: any = {
        page,
        limit: 10
      };

      if (filters.status && !filters.status.startsWith("All")) {
        params.status = filters.status;
      }
      
      if (filters.role && !filters.role.startsWith("All")) {
        params.role = filters.role;
      }
      
      // Only add search if it has at least 3 characters
      if (search && search.trim().length >= 3) {
        params.search = search.trim();
      } else if (search && search.trim().length > 0) {
        // If search is less than 3 chars, show all results
        // Or you can choose to not call API at all
        console.log('Search term too short, skipping API call');
        // Clear the search parameter
        delete params.search;
      }

      console.log('Fetching users with params:', params);
      
      const response = await userAPI.getUsers(params);
      
      if (response && response.success && Array.isArray(response.data)) {
        console.log('User data array:', response.data);
        console.log('Pagination from API:', response.pagination);
        
        const transformedData = response.data.map((user: any) => ({
          id: user.id,
          leadName: user.name,
          leadName_image: user.profilePicture || "https://via.placeholder.com/40",
          leadName_url: `/users/${user.id}`,
          email: user.email,
          contact: user.phone,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified ? "Verified" : "Not Verified",
          mfaEnabled: user.mfaEnabled ? "Enabled" : "Disabled",
          lastLogin: user.lastLoginAt ? 
            new Date(user.lastLoginAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : "Never",
          createdAt: new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          firstName: user.firstName,
          lastName: user.lastName,
          isEmail: user.isEmail,
          isNotification: user.isNotification,
          profilePicture: user.profilePicture,
          originalData: user
        }));
        
        setUsers(transformedData);
        
        // Update pagination from API response
        if (response.pagination) {
          console.log('Setting pagination:', response.pagination);
          setPagination({
            total: response.pagination.total,
            page: response.pagination.page,
            limit: response.pagination.limit,
            totalPages: response.pagination.totalPages
          });
        }
      } else {
        console.error('Invalid response format:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((searchValue: string) => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // If search is empty or less than 3 chars, fetch without search param
    if (searchValue.trim().length === 0 || searchValue.trim().length < 3) {
      // If it's initial load, fetch with current filters
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        fetchUsers(1, activeFilters, "");
      } else if (searchValue.trim().length === 0) {
        // If user cleared search, fetch without search
        setCurrentPage(1);
        fetchUsers(1, activeFilters, "");
      }
      // Don't fetch if less than 3 chars (except on initial load or clear)
      return;
    }
    
    // Set new timer for 500ms debounce
    debounceTimer.current = setTimeout(() => {
      console.log('Debounced search triggered with:', searchValue);
      setCurrentPage(1); // Reset to first page when searching
      fetchUsers(1, activeFilters, searchValue);
    }, 500);
  }, [fetchUsers, activeFilters]);

  // Initial fetch on mount
  useEffect(() => {
    fetchUsers(1, {}, "");
  }, [fetchUsers]);

  // Fetch when filters or currentPage changes (but not search)
  useEffect(() => {
    if (!initialLoadRef.current) {
      fetchUsers(currentPage, activeFilters, searchTerm);
    }
  }, [activeFilters, currentPage, fetchUsers]);

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
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchTerm("");
    setCurrentPage(1);
    initialLoadRef.current = false;
    fetchUsers(1, {}, "");
  };

  // Updated search handler with debouncing
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    debouncedSearch(searchValue);
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    console.log('Page change requested to:', page);
    setCurrentPage(page);
    initialLoadRef.current = false;
  };

  const openDetail = (row: any) => {
    setSelectedUser(row.originalData);
    setDrawerOpen(true);
  };

  const openEdit = (row: any) => {
    setSelectedUser(row.originalData);
    setEditDrawerOpen(true);
  };

  const columns: Column[] = [
    {
      key: "leadName",
      label: "User Name",
      type: "text"
    },
    { 
      key: "email", 
      label: "Email", 
      type: "text" 
    },
    { 
      key: "contact", 
      label: "Phone", 
      type: "text" 
    },
    { 
      key: "role", 
      label: "Role", 
      type: "text" 
    },
    { 
      key: "status", 
      label: "Status", 
      type: "text"
    },
    { 
      key: "emailVerified", 
      label: "Email Verified", 
      type: "text"
    },
    { 
      key: "lastLogin", 
      label: "Last Login", 
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </button>
          <button 
            onClick={() => openEdit(row)} 
            className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg hover:bg-gray-50"
            title="Edit User"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
          <button
            className="cursor-pointer bg-[#FFFFFF] border border-[#F6F6F6] custom-shadow p-2 rounded-lg hover:bg-gray-50"
            onClick={() => handleDeleteUsers([row])}
            title="Delete User"
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
    setSelectedUsersToDelete(selectedRows);
  };

  const handleAddToCampaign = () => {
    setIsDrawerOpen(true);
  };

  const handleDeleteUsers = (selectedRows: any[]) => {
    setSelectedUsersToDelete(selectedRows);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUsers = async () => {
    try {
      const deletePromises = selectedUsersToDelete.map(user => 
        userAPI.deleteUser(user.id)
      );
      
      await Promise.all(deletePromises);
      
      // Refresh with current page
      await fetchUsers(currentPage, activeFilters, searchTerm);
      
      setSelectedUsersToDelete([]);
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Failed to delete users. Please try again.');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const getDeleteMessage = () => {
    const count = selectedUsersToDelete.length;
    if (count === 1) {
      const user = selectedUsersToDelete[0];
      return `Are you sure you want to delete user "${user.leadName}" (${user.email})?`;
    }
    return `Are you sure you want to delete ${count} users?`;
  };

  const bottomActions = [
    {
      label: "Delete users",
      onClick: () => {
        if (selectedUsersToDelete.length === 0) {
          toast.error("Please select at least one user to delete");
          return;
        }
        setIsDeleteModalOpen(true);
      },
    },
  ];

  if (loading && initialLoadRef.current) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  console.log('Rendering with pagination:', pagination);
  console.log('Total users:', pagination.total);
  console.log('Current page:', pagination.page);
  console.log('Total pages:', pagination.totalPages);

  return (
    <>
      <div>
        <SharedTable
          columns={columns}
          data={users}
          title={
            <div className="flex gap-[6px] items-center">
              <p>Users</p>
              <p className="heading-7 font-medium text-[#70747D]">{pagination.total || users.length}</p>
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
            page: pagination.page,
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUsers}
        title={
          selectedUsersToDelete.length === 1
            ? `Delete ${selectedUsersToDelete[0]?.leadName || 'User'}?`
            : `Delete ${selectedUsersToDelete.length} Users?`
        }
        message={getDeleteMessage()}
        icon="/images/bin.svg"
        confirmText="Delete User"
        cancelText="Go back"
      />

      <AnimatePresence>
        {editDrawerOpen && selectedUser && (
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
                user={selectedUser}
                userId={selectedUser?.id}
                onClose={() => {
                  setEditDrawerOpen(false);
                }}
                onSuccess={() => {
                  setEditDrawerOpen(false);
                  fetchUsers(currentPage, activeFilters, searchTerm);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {drawerOpen && selectedUser && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <DetailDrawer 
                user={selectedUser} 
                onClose={() => setDrawerOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default UsersTable;