// LocationDetailDrawer.tsx
import React, { useState, useEffect } from 'react'
import { Camera, Calendar } from 'lucide-react'
import { locationsAPI } from '@/app/api/locations'
import toast from 'react-hot-toast'

interface LocationDetailDrawerProps {
  locationId: string
  onClose: () => void
}

export default function LocationDetailDrawer({ locationId, onClose }: LocationDetailDrawerProps) {
  const [location, setLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLocationDetail()
  }, [locationId])

  const fetchLocationDetail = async () => {
    try {
      setLoading(true)
      const response = await locationsAPI.getLocationDetail(locationId)
      
      if (response && response.success) {
        setLocation(response.data)
      } else {
        toast.error('Failed to load location details')
        onClose() // Close drawer if failed to load
      }
    } catch (error: any) {
      console.error('Error fetching location detail:', error)
      toast.error(error?.message || 'Failed to load location details')
      onClose() // Close drawer on error
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="right-0 top-0 h-full w-full flex flex-col ">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Location Details</h2>
          <p className="text-sm text-gray-500">
            View location information
          </p>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading location details...</div>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="right-0 top-0 h-full w-full flex flex-col ">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Location Details</h2>
          <p className="text-sm text-gray-500">
            View location information
          </p>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">Location not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="right-0 top-0 h-full w-full flex flex-col ">
      {/* Header - No Edit button */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Location Details</h2>
        <p className="text-sm text-gray-500">
          View location information
        </p>
      </div>

      {/* Location Details - No borders around sections */}
      <div className="flex-1 space-y-6">
        {/* Image Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Location Image</label>
          <div className="rounded-lg overflow-hidden">
            <div className="relative w-full aspect-video flex items-center justify-center">
              {location.imageUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={location.imageUrl}
                    alt={location.title}
                    className="object-cover w-full h-full rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      const parent = (e.target as HTMLImageElement).parentElement
                      if (parent) {
                        parent.innerHTML = `
                          <div class="flex flex-col items-center justify-center text-gray-400 p-8 w-full h-full">
                            <Camera size={48} class="mb-3" />
                            <p class="text-sm font-medium mb-1">Image not available</p>
                          </div>
                        `
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-8 w-full h-full">
                  <Camera size={48} className="mb-3" />
                  <p className="text-sm font-medium mb-1">No image available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <div className="w-full">
            <p className="text-gray-900 text-base font-medium">{location.title}</p>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <div className="w-full">
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{location.description}</p>
          </div>
        </div>

        {/* Metadata Section - Removed User ID and borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Created At */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar size={14} />
              Created Date
            </label>
            <div className="w-full">
              <p className="text-gray-600">{formatDate(location.createdAt)}</p>
            </div>
          </div>

          {/* Updated At - Always show if exists */}
          {location.updatedAt && (
            <div className="space-y-2">
              <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar size={14} />
                Last Updated
              </label>
              <div className="w-full">
                <p className="text-gray-600">{formatDate(location.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Location ID - Subtle styling */}
        <div className="pt-4">
          <div className="text-xs text-gray-400">
            Location ID: <span className="font-mono text-gray-500">{location.id}</span>
          </div>
        </div>
      </div>

      {/* Actions - Clean button without border */}
      <div className="flex gap-3 mt-6 pt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  )
}