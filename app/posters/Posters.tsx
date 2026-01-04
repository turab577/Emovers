import React, { useState, useEffect } from 'react'
import PrimaryBtn from '../ui/buttons/PrimaryBtn';
import { posterApi, Poster } from '../api/posters';
import ConfirmationModal from '../shared/ConfirmationModal';
import toast from 'react-hot-toast';

// Define API error response type
interface ApiError {
  message?: string;
  error?: string;
  statusCode?: number;
}

export default function Posters() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => Promise<void>;
    type?: 'danger' | 'warning' | 'info';
  }>({
    title: '',
    message: '',
    onConfirm: async () => {},
    type: 'danger'
  });
  const [actionInProgress, setActionInProgress] = useState(false);

  // Fetch posters on component mount
  useEffect(() => {
    fetchPosters();
  }, []);

  // Helper function to extract error message from API response
  const extractErrorMessage = (error: any): string => {
    // If error has response data with our API error format
    if (error?.response?.data) {
      const apiError = error.response.data as ApiError;
      return apiError.message || apiError.error || 'An error occurred';
    }
    
    // If error has message directly
    if (error?.message) {
      return error.message;
    }
    
    // Default fallback
    return 'An unexpected error occurred. Please try again.';
  };

  // Show error toast
  const showErrorToast = (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#FEE2E2',
        color: '#991B1B',
        border: '1px solid #FCA5A5',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  // Show success toast
  const showSuccessToast = (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#DCFCE7',
        color: '#166534',
        border: '1px solid #86EFAC',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  // Fetch all posters from API
  const fetchPosters = async () => {
    try {
      setLoading(true);
      const data = await posterApi.getPosters();
      setPosters(data);
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err);
      showErrorToast(`Failed to load posters: ${errorMessage}`);
      console.error('Error fetching posters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle upload new poster
  const handleUploadPoster = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadPromises = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);

        uploadPromises.push(posterApi.createPoster(formData));
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      showSuccessToast(`Successfully uploaded ${files.length} poster(s)`);
      
      // Refresh the list after upload
      await fetchPosters();
      
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err);
      showErrorToast(`Upload failed: ${errorMessage}`);
      console.error('Error uploading poster:', err);
    } finally {
      setUploading(false);
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (poster: Poster) => {
    setModalConfig({
      title: 'Delete Poster',
      message: `Are you sure you want to delete "${poster.fileName}"? This action cannot be undone.`,
      onConfirm: async () => await handleDeleteConfirmed(poster.id, poster.fileName),
      type: 'danger'
    });
    setShowConfirmModal(true);
  };

  // Show update confirmation modal
  const showUpdateConfirmation = (poster: Poster) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setModalConfig({
        title: 'Update Poster',
        message: `Are you sure you want to replace "${poster.fileName}" with the new image?`,
        onConfirm: async () => await handleUpdateConfirmed(poster.id, file, poster.fileName),
        type: 'warning'
      });
      setShowConfirmModal(true);
    };
    
    input.click();
  };

  // Handle delete after confirmation
  const handleDeleteConfirmed = async (id: number, fileName: string) => {
    try {
      setActionInProgress(true);
      await posterApi.deletePoster(id.toString());
      
      // Update local state immediately for better UX
      setPosters(prev => prev.filter(poster => poster.id !== id));
      
      showSuccessToast(`"${fileName}" deleted successfully`);
      
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err);
      showErrorToast(`Delete failed: ${errorMessage}`);
      console.error('Error deleting poster:', err);
      // Refresh list to ensure consistency
      await fetchPosters();
    } finally {
      setActionInProgress(false);
      setShowConfirmModal(false);
    }
  };

  // Handle update after confirmation
  const handleUpdateConfirmed = async (id: number, file: File, oldFileName: string) => {
    try {
      setActionInProgress(true);
      const formData = new FormData();
      formData.append('image', file);

      await posterApi.updatePoster(id.toString(), formData);
      
      showSuccessToast(`"${oldFileName}" updated successfully`);
      
      // Refresh the list
      await fetchPosters();
      
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err);
      showErrorToast(`Update failed: ${errorMessage}`);
      console.error('Error updating poster:', err);
    } finally {
      setActionInProgress(false);
      setShowConfirmModal(false);
    }
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setShowConfirmModal(false);
    setActionInProgress(false);
  };

  // Format file size to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onCancel={handleModalCancel}
        type={modalConfig.type}
        confirmText={actionInProgress ? 'Processing...' : 'Confirm'}
        cancelText="Cancel"
      />

      {/* Header Section */}
      <div className='flex flex-row mb-8 justify-between items-center'>
        <div className='space-y-2 mb-4 sm:mb-0'>
          <h2 className='heading-2 text-[#111827] font-medium'>Posters</h2>
          <p className='heading-5 text-[#70747D] font-normal'>See and customize your posters</p>
        </div>
        
        {/* Upload Button */}
        <div>
          <PrimaryBtn
            label={uploading ? 'Uploading...' : 'Upload'}
            imageSrc='/images/arrow-right.svg'
            imagePosition='right'
            disabled={uploading || actionInProgress}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = true;
              
              input.onchange = (e) => {
                handleUploadPoster((e.target as HTMLInputElement).files);
              };
              
              input.click();
            }}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        /* Posters Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posters.map((poster) => (
            <div 
              key={poster.id} 
              className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 overflow-hidden">
                <img 
                  src={poster.imageUrl} 
                  alt={poster.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                  }}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Action Buttons */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  {/* Update Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showUpdateConfirmation(poster);
                    }}
                    className="bg-white cursor-pointer hover:bg-gray-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 hover:scale-110"
                    title="Update poster"
                    disabled={uploading || actionInProgress}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showDeleteConfirmation(poster);
                    }}
                    className="bg-white cursor-pointer hover:bg-gray-100 text-red-600 p-2 rounded-full shadow-lg transition-all duration-200 transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 hover:scale-110"
                    title="Delete poster"
                    disabled={uploading || actionInProgress}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Poster Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate" title={poster.fileName}>
                    {poster.fileName}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatFileSize(poster.fileSize)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <div>Uploaded: {formatDate(poster.createdAt)}</div>
                  {poster.createdAt !== poster.updatedAt && (
                    <div className="mt-1">Updated: {formatDate(poster.updatedAt)}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && posters.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No posters found</h3>
          <p className="mt-1 text-sm text-gray-500">Upload some images to get started</p>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = true;
              input.onchange = (e) => handleUploadPoster((e.target as HTMLInputElement).files);
              input.click();
            }}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={uploading || actionInProgress}
          >
            {uploading ? 'Uploading...' : 'Upload First Poster'}
          </button>
        </div>
      )}
    </div>
  )
}