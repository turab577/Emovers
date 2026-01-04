"use client";

import React, { useState, useEffect, useRef } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../ui/Input'
import { Camera, Upload, Edit2, X, Save, ChevronDown, Check, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { servicesApi } from '../api/services'

interface EditDrawerProps {
  service?: any
  onClose: () => void
  onSuccess?: () => void
}

// Reusable Dropdown Component (same as user EditDrawer)
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
            : 'bg-white border-gray-300 hover:border-gray-400  cursor-pointer'
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

export default function EditDrawer({ service, onClose, onSuccess }: EditDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    heading: '',
    shortdescription: '',
    description: '',
    type: 'MOVING',
    features: [] as string[],
  })

  // Image state
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [newFeature, setNewFeature] = useState('')

  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  // Initialize form with service data
  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        heading: service.heading || '',
        shortdescription: service.shortdescription || '',
        description: service.description || '',
        type: service.type || 'MOVING',
        features: service.features || [],
      })
      setLogoPreview(service.logo || null)
      setBannerPreview(service.bannerImg || null)
    }
  }, [service])

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

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle banner upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      setBannerFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setBannerPreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file inputs
  const triggerLogoInput = () => {
    if (logoInputRef.current) {
      logoInputRef.current.click()
    }
  }

  const triggerBannerInput = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click()
    }
  }

  // Remove images
  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }

  const removeBanner = () => {
    setBannerFile(null)
    setBannerPreview(null)
    if (bannerInputRef.current) {
      bannerInputRef.current.value = ''
    }
  }

  // Handle features
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  // Save service data
  const handleSave = async () => {
    setSaving(true)
    
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error('Title is required')
        setSaving(false)
        return
      }

      if (!formData.description.trim()) {
        toast.error('Description is required')
        setSaving(false)
        return
      }

      if (!formData.shortdescription.trim()) {
        toast.error('Short description is required')
        setSaving(false)
        return
      }

      if (!formData.heading.trim()) {
        toast.error('Heading is required')
        setSaving(false)
        return
      }

      // Create FormData
      const formDataObj = new FormData()
      
      // Append text fields
      formDataObj.append('title', formData.title)
      formDataObj.append('description', formData.description)
      formDataObj.append('shortdescription', formData.shortdescription)
      formDataObj.append('heading', formData.heading)
      formDataObj.append('type', formData.type)
      
      // Append features
      formData.features.forEach((feature, index) => {
        formDataObj.append(`features[${index}]`, feature)
      })
      
      // Append logo if changed
      if (logoFile) {
        formDataObj.append('logo', logoFile)
      }
      
      // Append banner if changed
      if (bannerFile) {
        formDataObj.append('bannerImg', bannerFile)
      }

      const response = await servicesApi.updateService(service?.id, formDataObj)
      
      if (response && response.success) {
        // toast.success('Service updated successfully!')
        setEditForm(false)
        
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast.error(response?.message || "Failed to update service")
      }
       
    } catch (error: any) {
      console.error('Error updating service:', error)
      toast.error(error?.message || "Failed to update service")
    } finally {
      setSaving(false)
    }
  }

  // Service type options
  const typeOptions = [
    { value: 'MOVING', label: 'Moving' },
    { value: 'STORAGE', label: 'Storage' }
  ]

  // Loading state
  if (loading) {
    return (
      <div className="right-0 top-0 h-full w-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Update Service</h2>
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
    <div className="right-0 top-0 h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Update Service</h2>
          <p className="text-sm text-gray-500">
            You can update service from here
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
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">Title *</label>
              <Input
                title="Title"
                type="text"
                value={formData.title}
                disabled={!editForm}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter service title"
                className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none  disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-200"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">Type *</label>
              <Dropdown
                options={typeOptions}
                value={formData.type}
                onChange={(value) => handleInputChange('type', value)}
                disabled={!editForm}
                placeholder="Select Type"
              />
            </div>

            {/* Heading */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">Heading *</label>
              <Input
                title="Heading"
                type="text"
                value={formData.heading}
                disabled={!editForm}
                onChange={(e) => handleInputChange('heading', e.target.value)}
                placeholder="Enter main heading"
                className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none  disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-200"
              />
            </div>

            {/* Short Description */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">Short Description *</label>
              <textarea
                value={formData.shortdescription}
                disabled={!editForm}
                onChange={(e) => handleInputChange('shortdescription', e.target.value)}
                placeholder="Enter brief description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none  disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-200 resize-none"
              />
            </div>

            {/* Full Description */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-600">Full Description *</label>
              <textarea
                value={formData.description}
                disabled={!editForm}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter detailed description"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none  disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-200 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold text-gray-700">Features</h3>
            {editForm && (
              <span className="text-xs text-gray-500">
                {formData.features.length} feature(s) added
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {/* Existing Features */}
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
                {editForm && (
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                    type="button"
                    title="Remove feature"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            
            {/* Add New Feature */}
            {editForm && (
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter new feature"
                  className="flex-1 h-11"
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <button
                  onClick={addFeature}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={!newFeature.trim()}
                  type="button"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
       
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