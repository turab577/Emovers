import React, { useState } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../../ui/Input'
import { userAPI } from '@/app/api/users-management'
import toast from 'react-hot-toast'

interface AddAdminDrawerProps {
  onClose?: () => void
  onSuccess?: () => void
}

export default function AddAdminDrawer({ onClose, onSuccess }: AddAdminDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    // role: 'ADMIN',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validate form locally
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddAdmin = async () => {
    console.log('=== ADD ADMIN START ===')
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
     
      return
    }

    setLoading(true)
    setErrors({})
    
    try {
      // Prepare payload
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        // role: 'ADMIN'
      }

      console.log('Adding admin with payload:', payload)
      
      const response: any = await userAPI.addAdmins(payload)
      
      console.log('=== ADD ADMIN RESPONSE ===')
      console.log('Full response:', response)

      // Check for success (same pattern as Login)
      const isSuccess = response?.success === true || response?.status === "success"

      if (isSuccess) {
        console.log('=== ADD ADMIN SUCCESS ===')
        toast.success(response?.message || 'Admin added successfully!')

         if (onSuccess) {
          onSuccess()
      }
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
        //   role: 'ADMIN',
        })
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          console.log('=== CALLING ONSUCCESS ===')
          onSuccess()
        }
        
        // Close drawer
        if (onClose) {
          onClose()
        }
      } else {
        console.log('=== ADD ADMIN FAILED ===')
        console.log('Response:', response)
        
        // Handle validation errors from response message
        if (response?.message && typeof response.message === 'object') {
          const validationErrors: Record<string, string> = {}
          
          Object.entries(response.message).forEach(([field, errorMessage]) => {
            if (Array.isArray(errorMessage)) {
              validationErrors[field] = errorMessage[0] || 'Validation error'
            } else if (typeof errorMessage === 'string') {
              validationErrors[field] = errorMessage
            }
          })
          
          setErrors(validationErrors)
          
          // Show first error as toast
          const firstError = Object.values(validationErrors)[0]
          if (firstError) {
            toast.error(firstError)
          } else {
            toast.error("Failed to add admin")
          }
        } else {
          toast.error(response?.message || "Failed to add admin")
        }
      }
       
    } catch (error: any) {
      console.log('=== ERROR CAUGHT ===')
      console.log('Error object:', error)
      console.log('Error response:', error?.response)
      console.log('Error response data:', error?.response?.data)
      
      // CRITICAL FIX: Comprehensive error handling
      let errorMessage = "Failed to add admin"
      const validationErrors: Record<string, string> = {}
      
      // Priority 1: Check for validation errors in response.data.message (object format)
      if (error?.response?.data?.message && typeof error.response.data.message === 'object') {
        Object.entries(error.response.data.message).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            validationErrors[field] = messages[0]
          } else if (typeof messages === 'string') {
            validationErrors[field] = messages
          }
        })
        
        // Set field errors
        setErrors(validationErrors)
        
        // Get first error for toast
        const firstError = Object.values(validationErrors)[0]
        if (firstError) {
          errorMessage = firstError
        }
      }
      // Priority 2: Check for string message in response.data.message
      else if (error?.response?.data?.message && typeof error.response.data.message === 'string') {
        errorMessage = error.response.data.message
        
        // Try to map to specific fields
        const lowerMessage = errorMessage.toLowerCase()
        if (lowerMessage.includes('email')) {
          setErrors({ email: errorMessage })
        } else if (lowerMessage.includes('firstname') || lowerMessage.includes('first name')) {
          setErrors({ firstName: errorMessage })
        } else if (lowerMessage.includes('lastname') || lowerMessage.includes('last name')) {
          setErrors({ lastName: errorMessage })
        } else if (lowerMessage.includes('password')) {
          setErrors({ password: errorMessage })
        } else if (lowerMessage.includes('phone')) {
          setErrors({ phone: errorMessage })
        }
      }
      // Priority 3: Check for error field in response.data
      else if (error?.response?.data?.error && typeof error.response.data.error === 'string') {
        errorMessage = error.response.data.error
      }
      // Priority 4: Check for response.data as string
      else if (error?.response?.data && typeof error.response.data === 'string') {
        errorMessage = error.response.data
      }
      // Priority 5: Check for direct error message
      else if (error?.message && typeof error.message === 'string') {
        errorMessage = error.message
      }
      // Priority 6: Check if error itself is a string
      else if (typeof error === 'string') {
        errorMessage = error
      }
      
      console.log('Final error message:', errorMessage)
      console.log('Validation errors:', validationErrors)
      
      // Show toast
      toast.error(errorMessage)
      
    } finally {
      console.log('=== ADD ADMIN FINISHED ===')
      setLoading(false)
    }
  }

  return (
    <div className="right-0 top-0 h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Add Admin</h2>
        <p className="text-sm text-gray-500">
          You can add a new admin from here
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-600">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              title="First Name"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter first name"
              disabled={loading}
              className={`w-full h-11 px-4 border rounded-md outline-none  disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-gray-600">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              title="Last Name"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter last name"
              disabled={loading}
              className={`w-full h-11 px-4 border rounded-md outline-none  disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-600">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            title="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="admin@example.com"
            disabled={loading}
            className={`w-full h-11 px-4 border rounded-md outline-none  disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-600">
            Password <span className="text-red-500">*</span>
          </label>
          <Input
            title="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter password (min. 8 characters)"
            disabled={loading}
            className={`w-full h-11 px-4 border rounded-md outline-none  disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
            }`}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters long
          </p>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-600">
            Phone Number <span className="text-gray-400">(Optional)</span>
          </label>
          <Input
            title="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1234567890"
            disabled={loading}
            className={`w-full h-11 px-4 border rounded-md outline-none  disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Role (Hidden but included in payload) */}
        {/* <input type="hidden" value={formData.role} /> */}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-4 ">
        <LightBtn 
          label="Cancel" 
          onClick={onClose}
          disabled={loading}
        />
        <PrimaryBtn 
          label={loading ? "Adding..." : "Add Admin"} 
          onClick={handleAddAdmin}
          disabled={loading}
        />
      </div>
    </div>
  )
}