"use client";

import React, { useState, useEffect, useRef } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../../ui/Input'
import { userAPI } from '@/app/api/users-management'
import toast from 'react-hot-toast'
import { ChevronDown, Check } from 'lucide-react'

interface EditDrawerProps {
  user?: any
  userId?: string
  onClose: () => void
  onSuccess?: () => void
}

// Improved Dropdown Component
const Dropdown = ({ 
  options, 
  value, 
  onChange, 
  disabled = false,
  placeholder = "Select..."
}: { 
  options: Array<{ value: string, label: string }>
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full h-11 px-4 border rounded-md outline-none flex items-center justify-between transition-all
          ${disabled 
            ? 'bg-gray-50 cursor-not-allowed opacity-60 border-gray-200' 
            : 'bg-white border-gray-300 hover:border-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer'
          }
          ${isOpen && !disabled ? 'border-orange-500 ring-2 ring-orange-200' : ''}
        `}
      >
        <span className={`text-sm truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md z-50 mt-1 border border-gray-200 max-h-60 hide-scrollbar overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors
                ${option.value === value ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}
              `}
            >
              <span className="text-sm font-medium">{option.label}</span>
              {option.value === value && (
                <Check className="w-4 h-4 text-orange-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function EditDrawer({ user, userId, onClose, onSuccess }: EditDrawerProps) {
  const [loading, setLoading] = useState(!user)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: 'USER',
    status: 'ACTIVE',
    emailVerified: false,
    isEmail: true,
    isNotification: true,
    mfaEnabled: false,
  })

  // Fetch user data if only userId is provided
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        populateForm(user)
        return
      }

      if (userId) {
        try {
          setLoading(true)
          const response: any = await userAPI.getUserDetail(userId)
          
          const isSuccess = response?.success === true || response?.status === "success"

          if (isSuccess) {
            populateForm(response.data || response)
          } else {
            toast.error(response?.message || "Failed to load user data")
          }
        } catch (error: any) {
          console.error('Error fetching user data:', error)
          
          if (error?.message) {
            toast.error(error.message)
          } else if (error?.response?.data?.message) {
            toast.error(error.response.data.message)
          } else {
            toast.error("Something went wrong. Please try again.")
          }
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [user, userId])

  // Populate form with user data
  const populateForm = (userData: any) => {
    setFormData({
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      role: userData.role || 'USER',
      status: userData.status || 'ACTIVE',
      emailVerified: userData.emailVerified || false,
      isEmail: userData.isEmail !== undefined ? userData.isEmail : true,
      isNotification: userData.isNotification !== undefined ? userData.isNotification : true,
      mfaEnabled: userData.mfaEnabled || false,
    })
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Toggle edit mode
  const handleEditToggle = () => {
    setEditForm(!editForm)
  }

  // Save user data - FIXED ERROR HANDLING
  const handleSave = async () => {
    setSaving(true)
    console.log('=== UPDATE START ===');
    
    try {
      // Prepare payload according to DTO
      const payload: any = {}
      
      // Only include fields that have changed or are being updated
      if (formData.firstName !== (user?.firstName || '')) {
        payload.firstName = formData.firstName
      }
      if (formData.lastName !== (user?.lastName || '')) {
        payload.lastName = formData.lastName
      }
      if (formData.phone !== (user?.phone || '')) {
        payload.phone = formData.phone
      }
      if (formData.role !== (user?.role || 'USER')) {
        payload.role = formData.role.toUpperCase()
      }
      if (formData.status !== (user?.status || 'ACTIVE')) {
        payload.status = formData.status.toUpperCase()
      }
      if (formData.emailVerified !== (user?.emailVerified || false)) {
        payload.emailVerified = formData.emailVerified
      }
      if (formData.isEmail !== (user?.isEmail !== undefined ? user.isEmail : true)) {
        payload.isEmail = formData.isEmail
      }
      if (formData.isNotification !== (user?.isNotification !== undefined ? user.isNotification : true)) {
        payload.isNotification = formData.isNotification
      }
      if (formData.mfaEnabled !== (user?.mfaEnabled || false)) {
        payload.mfaEnabled = formData.mfaEnabled
      }

      // If no changes, just close edit mode
      if (Object.keys(payload).length === 0) {
        setEditForm(false)
        toast.success('No changes detected')
        setSaving(false)
        return
      }

      console.log('Updating user with payload:', payload)
      
      const targetId = userId || user?.id
      if (!targetId) {
        toast.error('User ID is required')
        setSaving(false)
        return
      }

      const response: any = await userAPI.updateUserDetail(targetId, payload)
      
      console.log('=== UPDATE RESPONSE ===')
      console.log('Full response:', response)

      // FIXED: Check for both success formats (same as Login)
      const isSuccess = response?.success === true || response?.status === "success"

      if (isSuccess) {
        toast.success('User updated successfully!')
        setEditForm(false)
        
        // Update local form data with response
        if (response.data) {
          populateForm(response.data)
        }
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess()
        }
      } else {
        console.log('=== UPDATE FAILED ===')
        // Handle validation errors from message object
        if (response?.message && typeof response.message === 'object') {
          // Extract first error message from object
          const errorMessages = Object.values(response.message)
          const firstError = errorMessages[0]
          toast.error(Array.isArray(firstError) ? firstError[0] : firstError || "Failed to update user")
        } else {
          toast.error(response?.message || "Failed to update user")
        }
      }
       
    } catch (error: any) {
      console.log('=== ERROR CAUGHT ===')
      console.log('Error object:', error)
      console.log('Error response:', error?.response)
      console.log('Error response data:', error?.response?.data)

      // toast.error(error.message.status)
      
      // CRITICAL FIX: Handle all possible error formats
      let errorMessage = error.message.status
      
      // Priority 1: Check for validation errors in response.data.message (object format)
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  // FIXED: Updated status options to match API validation
  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'SUSPENDED', label: 'Suspended' },
    { value: 'PENDING_VERIFICATION', label: 'Pending Verification' }
  ]

  // Role options
  const roleOptions = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' }
  ]

  if (loading) {
    return (
      <div className="right-0 top-0 h-full w-full flex flex-col ">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Update User</h2>
        </div>
        <div className="flex-1 space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <LightBtn label="Cancel" onClick={onClose} />
        </div>
      </div>
    )
  }

  return (
    <div className="right-0 top-0 h-full w-full flex flex-col ">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Update Admin data</h2>
          <p className="text-sm text-gray-500">
            You can update admin data from here
          </p>
        </div>
        <button
          onClick={editForm ? handleSave : handleEditToggle}
          disabled={saving}
          className="text-orange-500 cursor-pointer text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : editForm ? 'Save Changes' : 'Edit'}
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">First Name</label>
              <Input
                title="First Name"
                type="text"
                value={formData.firstName}
                disabled={!editForm}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-200"
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">Last Name</label>
              <Input
                title="Last Name"
                type="text"
                value={formData.lastName}
                disabled={!editForm}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-200"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">Phone Number</label>
              <Input
                title="Phone"
                type="tel"
                value={formData.phone}
                disabled={!editForm}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700">Account Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">Role</label>
              <Dropdown
                options={roleOptions}
                value={formData.role}
                onChange={(value) => handleInputChange('role', value)}
                disabled={!editForm}
                placeholder="Select Role"
              />
            </div>

            {/* Status - FIXED options */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">Status</label>
              <Dropdown
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleInputChange('status', value)}
                disabled={!editForm}
                placeholder="Select Status"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-4">
        <LightBtn 
          label="Cancel" 
          onClick={onClose}
          disabled={saving}
        />
        {editForm && (
          <PrimaryBtn 
            label={saving ? "Saving..." : "Save Changes"} 
            onClick={handleSave}
            disabled={saving}
          />
        )}
      </div>
    </div>
  )
}