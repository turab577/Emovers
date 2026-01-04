import React from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../../ui/Input'
import { User, Mail, Phone, Shield, Calendar, CheckCircle, XCircle, Bell } from 'lucide-react'

interface DetailDrawerProps {
  user?: any
  onClose: () => void
}

export default function DetailDrawer({ user, onClose }: DetailDrawerProps) {
  if (!user) {
    return (
      <div className="right-0 top-0 h-full w-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Admin Details</h2>
          <p className="text-sm text-gray-500">
            No admin data available
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <LightBtn label="Close" onClick={onClose} />
        </div>
      </div>
    )
  }

  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PENDING_VERIFICATION': return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED': return 'bg-red-100 text-red-800'
      case 'INACTIVE': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active'
      case 'PENDING_VERIFICATION': return 'Pending Verification'
      case 'SUSPENDED': return 'Suspended'
      case 'INACTIVE': return 'Inactive'
      default: return status
    }
  }

  return (
    <div className="right-0 top-0 h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Admin Details</h2>
        <p className="text-sm text-gray-500">
          View admin information
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        {/* Admin Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white font-semibold text-xl">
              {user.firstName?.charAt(0) || 'A'}{user.lastName?.charAt(0) || 'D'}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {getStatusLabel(user.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600">{user.role || 'ADMIN'}</p>
              <p className="text-xs text-gray-500 mt-1">ID: {user.id}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 flex items-center gap-2">
            <Mail size={16} />
            Contact Information
          </h3>
          
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Email Address</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              {user.emailVerified ? (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle size={12} /> Verified
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <XCircle size={12} /> Not Verified
                </span>
              )}
            </div>

            {/* Phone */}
            {user.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone Number</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 flex items-center gap-2">
            <Shield size={16} />
            Account Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Role */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Role</p>
              <p className="text-sm text-gray-600 capitalize">{user.role?.toLowerCase() || 'admin'}</p>
            </div>

            {/* MFA Status */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Two-Factor Auth</p>
              <span className={`text-sm font-medium ${user.mfaEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                {user.mfaEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {/* Created At */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Created Date</p>
              <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
            </div>

            {/* Last Login */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Last Login</p>
              <p className="text-sm text-gray-600">
                {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 flex items-center gap-2">
            <Bell size={16} />
            Preferences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Email Notifications */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Email Notifications</p>
              <span className={`text-sm font-medium ${user.isEmail ? 'text-green-600' : 'text-gray-600'}`}>
                {user.isEmail ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {/* Push Notifications */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Push Notifications</p>
              <span className={`text-sm font-medium ${user.isNotification ? 'text-green-600' : 'text-gray-600'}`}>
                {user.isNotification ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-4">
        <LightBtn 
          label="Close" 
          onClick={onClose}
          className="flex-1"
        />
      </div>
    </div>
  )
}