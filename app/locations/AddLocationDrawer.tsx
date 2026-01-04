import React, { useState, useRef, useEffect } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../ui/Input'
import Image from 'next/image'
import { Camera, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { locationsAPI } from '@/app/api/locations'

interface AddLocationDrawerProps {
  onClose: () => void
  onSuccess?: () => void
}

export default function AddLocationDrawer({ onClose, onSuccess }: AddLocationDrawerProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!title.trim()) {
        toast.error('Please enter a title')
        return
      }
      
      if (!description.trim()) {
        toast.error('Please enter a description')
        return
      }

      setLoading(true)
      
      // Create FormData for multipart request
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      
      // Only append image if selected
      if (imageFile) {
        formData.append('image', imageFile)
      }
      
      // Call the create API
      const response = await locationsAPI.createLocations(formData)
      
      if (response && response.success) {
        toast.success('Location created successfully')
        
        // Reset form
        setTitle('')
        setDescription('')
        setImageFile(null)
        setImageUrl(null)
        setImageName('')
        
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        
        // Call success callback
        onSuccess?.()
        
        // Close drawer
        onClose()
      } else {
        toast.error(response?.message || 'Failed to create location')
      }
    } catch (error: any) {
      console.error('Error creating location:', error)
      toast.error(error?.message || 'Failed to create location')
    } finally {
      setLoading(false)
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

  const handleCancel = () => {
    // Clean up blob URL if exists
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    onClose()
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
      {/* Header - Removed Edit/Save toggle */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Add Location</h2>
        <p className="text-sm text-gray-500">
          Add your location below
        </p>
      </div>

      {/* Form Inputs - Always editable */}
      <div className="flex-1 space-y-4">
        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            title='Title'
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter location title"
            className="w-full h-11 px-4 border rounded-md outline-none"
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            title='Description'
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter location description"
            className="w-full h-11 px-4 border rounded-md outline-none"
          />
        </div>

        {/* Image Upload Section - Always editable */}
        <div className="pt-4">
          <label className="block text-sm font-medium mb-3">Location Image</label>
          
          {/* Full Width Image Preview Container with Orange Dashed Border */}
          <div className="w-full border-2 border-dashed border-orange-500 rounded-lg overflow-hidden bg-orange-50 transition-all duration-200 mb-3">
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
                  
                  {/* Remove Image Button */}
                  <button
                    onClick={removeImage}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove image"
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                  <Camera size={48} className="mb-3" />
                  <p className="text-sm font-medium mb-1">No image uploaded</p>
                  <p className="text-xs text-center">Upload a location image to display here</p>
                </div>
              )}
            </div>

            {/* Upload Controls Section - Always visible */}
            <div className="p-4 bg-orange-50">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                className="hidden"
              />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors shadow-sm"
                  >
                    <Upload size={18} />
                    {imageUrl ? 'Change Image' : 'Upload Image'}
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
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <LightBtn 
          label="Cancel" 
          onClick={handleCancel}
          disabled={loading}
        />
        <PrimaryBtn 
          label={loading ? "Creating..." : "Create Location"} 
          onClick={handleSave}
          disabled={loading || !title.trim() || !description.trim()}
        />
      </div>
    </div>
  )
}