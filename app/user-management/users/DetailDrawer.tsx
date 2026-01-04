"use client";

import React, { useState, useEffect } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import { userAPI } from '@/app/api/users-management'
import toast from 'react-hot-toast'

interface DetailDrawerProps {
  user?: any
  userId?: string
  onClose: () => void
}

export default function DetailDrawer({ user, userId, onClose }: DetailDrawerProps) {
  const [userData, setUserData] = useState<any>(user || null)
  const [loading, setLoading] = useState(!user)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDetail = async () => {
      // If user data is already passed, don't fetch
      if (user) {
        setUserData(user)
        return
      }

      // If userId is provided, fetch user details
      if (userId) {
        try {
          setLoading(true)
          setError(null)
          
          const response = await userAPI.getUserDetail(userId)
          
          if (response && response.success) {
            console.log('User detail fetched:', response.data)
            setUserData(response.data)
          } else {
            setError('Failed to load user details')
            toast.error('Failed to load user details')
          }
        } catch (err) {
          console.error('Error fetching user details:', err)
          setError('Error loading user details')
          toast.error('Error loading user details')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserDetail()
  }, [user, userId])

  // Format date to readable string
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-red-100 text-red-800'
      case 'PENDING_VERIFICATION':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Format role display
  const formatRole = (role: string) => {
    if (!role) return 'N/A'
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }

  if (loading) {
    return (
      <div className="right-0 top-0 h-full w-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">User Detail</h2>
        </div>
        <div className="flex-1 space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <LightBtn label="Cancel" onClick={onClose} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="right-0 top-0 h-full w-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">User Detail</h2>
          <p className="text-sm text-gray-500">
            Following is the detail for user
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-red-600">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="right-0 top-0 h-full w-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">User Detail</h2>
          <p className="text-sm text-gray-500">
            Following is the detail for user
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No user data available</p>
        </div>
        <div className="flex gap-3 mt-6">
          <LightBtn label="Cancel" onClick={onClose} />
        </div>
      </div>
    )
  }

  return (
    <div className="right-0 top-0 h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">User Detail</h2>
        <p className="text-sm text-gray-500">
          Following is the detail for {userData.name || 'User'}
        </p>
      </div>

      {/* User Profile Image */}
      {userData.profilePicture && (
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            <img 
              src={userData.profilePicture} 
              alt={userData.name || 'User'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=random`
              }}
            />
          </div>
        </div>
      )}

      {/* User Details */}
      <div className="flex-1 space-y-5">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-sm font-normal text-gray-800">
                {userData.name || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-sm font-normal text-gray-800">
                {userData.email || 'N/A'}
                {userData.emailVerified && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
              <p className="text-sm font-normal text-gray-800">
                {userData.phone || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
              <p className="text-sm font-normal text-gray-800 font-mono">
                {userData.id || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Account Info */}
       

        {/* Activity Info */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Activity Information</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
              <p className="text-sm font-normal text-gray-800">
                {formatDate(userData.lastLoginAt)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
              <p className="text-sm font-normal text-gray-800">
                {formatDate(userData.createdAt)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-sm font-normal text-gray-800">
                {formatDate(userData.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info (if available) */}
        {(userData.firstName || userData.lastName) && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Additional Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {userData.firstName && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                  <p className="text-sm font-normal text-gray-800">{userData.firstName}</p>
                </div>
              )}
              
              {userData.lastName && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                  <p className="text-sm font-normal text-gray-800">{userData.lastName}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-4 border-t">
        <LightBtn label="Close" onClick={onClose} />
      </div>
    </div>
  )
}