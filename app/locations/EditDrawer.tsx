import React, { useState, useRef, useEffect } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../ui/Input'
import Image from 'next/image'
import { Camera, Upload, Edit2, X, Image as ImageIcon, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { locationsAPI } from '@/app/api/locations'

interface EditDrawerProps {
  location: any
  locationId: number
  onClose: () => void
  onSuccess: () => void
}

export default function EditDrawer({ location, locationId, onClose, onSuccess }: EditDrawerProps) {
  const [editForm, setEditForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(location?.imageUrl || null)
  const [imageName, setImageName] = useState<string>('')
  const [title, setTitle] = useState(location?.title || '')
  const [description, setDescription] = useState(location?.description || '')
  const [loading, setLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (location) {
      setTitle(location.title || '')
      setDescription(location.description || '')
      setImageUrl(location.imageUrl || null)
    }
  }, [location])

  const handleEdit = () => {
    setEditForm(true)
  }
  
  const handleSave = async () => {
    try {
      setLoading(true)
      
      // Create FormData for multipart request
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      
      // Only append image if a new one is selected
      if (imageFile) {
        formData.append('image', imageFile)
      }
      
      // Call the update API
      const response = await locationsAPI.updateLocations(locationId, formData)
      
      if (response && response.success) {
        toast.success('Location updated successfully')
        setEditForm(false)
        onSuccess() // Refresh the table
      } else {
        toast.error(response?.message || 'Failed to update location')
      }
    } catch (error: any) {
      console.error('Error updating location:', error)
      toast.error(error?.message || 'Failed to update location')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (editForm) {
      // Reset to original values
      setTitle(location?.title || '')
      setDescription(location?.description || '')
      setImageUrl(location?.imageUrl || null)
      setImageFile(null)
      setImageName('')
      
      // Clear file input if exists
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    setEditForm(false)
    if (!editForm) {
      onClose()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPG, PNG, WebP, GIF)')
        return
      }

      // Validate file size (max 1MB)
      const maxSize = 1 * 1024 * 1024 // 1MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size should be less than 1MB')
        return
      }

      setImageName(file.name)
      setImageFile(file)
      
      // Create blob URL for preview
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeImage = () => {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    setImageUrl(null)
    setImageFile(null)
    setImageName('')
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  return (
    <div className="right-0 top-0 h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">Update location</h2>
          <p className="text-sm text-gray-500">
            You can update location from here
          </p>
        </div>
        {!editForm ? (
          <p 
            onClick={handleEdit} 
            className="text-orange-500 cursor-pointer text-sm underline flex items-center gap-1"
          >
            <Edit2 size={14} />
            Edit
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
              Editing
            </span>
          </div>
        )}
      </div>

      {/* Form Inputs */}
      <div className="flex-1 space-y-4">
        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            title='Name'
            type="text"
            value={title}
            disabled={!editForm}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter location name"
            className="w-full h-11 px-4 border disabled:cursor-not-allowed rounded-md outline-none"
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            title='Description'
            type='text'
            value={description}
            disabled={!editForm}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter location description"
            className="w-full h-11 px-4 border disabled:cursor-not-allowed rounded-md outline-none"
          />
        </div>

        {/* Image Upload Section */}
        <div className="pt-4">
          <label className="block text-sm font-medium mb-3">Location Image</label>
          
          {/* Image Preview Container */}
          <div className={`w-full ${editForm ? 'border-2 border-dashed border-orange-500' : 'border border-gray-200'} rounded-lg overflow-hidden bg-gray-50 transition-all duration-200 mb-3`}>
            {/* Image Preview Area */}
            <div className="relative w-full aspect-video flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {imageUrl ? (
                <>
                  <div className="relative w-full h-full">
                    <img
                      src={imageUrl}
                      alt="location preview"
                      className="object-cover w-full h-full max-h-[300px]"
                    />
                  </div>
                  
                  {/* Image Info Overlay */}
                  {editForm && (
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={removeImage}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Remove image"
                        type="button"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                  <Camera size={48} className="mb-3" />
                  <p className="text-sm font-medium mb-1">No image uploaded</p>
                  <p className="text-xs text-center">Upload a location image to display here</p>
                </div>
              )}
            </div>

            {/* Upload Controls Section */}
            <div className={`p-4 ${editForm ? 'bg-orange-50' : 'bg-gray-50'}`}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={!editForm}
              />
              
              {editForm ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={!editForm}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <Upload size={18} />
                      {imageUrl ? 'Change Image' : 'Choose Image'}
                    </button>
                    
                    <p className="mt-2 text-xs text-gray-500">
                      Supports: JPG, PNG, WebP, GIF • Max 1MB
                    </p>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Recommended:</p>
                    <p className="text-xs">1200×600px or 16:9 ratio for best quality</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Camera size={16} />
                    <span>{imageName || 'No image selected'}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Click Edit to change
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Edit Mode Indicator */}
          {editForm && (
            <div className="mt-2 flex items-center gap-2 text-sm text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>Image editing enabled</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <LightBtn 
          label={editForm ? "Cancel" : "Close"} 
          onClick={handleCancel}
          disabled={loading}
        />
        {editForm && (
          <PrimaryBtn 
            label={loading ? "Saving..." : "Save Changes"}
            onClick={handleSave}
            disabled={loading || !title.trim() || !description.trim()}
          />
        )}
      </div>
    </div>
  )
}