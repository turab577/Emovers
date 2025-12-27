import React, { useState, useRef, useEffect } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../ui/Input'
import Image from 'next/image'
import { Camera, Upload, Edit2, X, Image as ImageIcon } from 'lucide-react'

interface EmailDrawerProps {
  onClose?: () => void
  onSendEmail?: (data: { email: string; message: string }) => void
}

export default function EditDrawer({ onClose, onSendEmail }: EmailDrawerProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [editForm, setEditForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!email || !message) {
      console.warn('Both fields are required')
      return
    }
    onSendEmail?.({ email, message })
  }

  const handleEdit = () => {
    setEditForm(prev => !prev)
  }
  
  const handleSave = () => {
    setEditForm(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.warn('Please upload an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.warn('Image size should be less than 5MB')
        return
      }

      setImageName(file.name)
      setImageFile(file)
      
      // Create blob URL for preview - FIXED
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
    if (imageUrl) {
      // Clean up the blob URL if we were using it
      if (imageUrl.startsWith('blob:')) {
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
        <p 
          onClick={editForm ? handleSave : handleEdit} 
          className="text-orange-500 cursor-pointer text-sm underline flex items-center gap-1"
        >
          {editForm ? (
            <>
              <Edit2 size={14} />
              Save
            </>
          ) : (
            <>
              <Edit2 size={14} />
              Edit
            </>
          )}
        </p>
      </div>

      {/* Form Inputs - Name and Email First */}
      <div className="flex-1 space-y-4">
        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            title='Name'
            type="text"
            // value={name}
            disabled={!editForm}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your name"
            className="w-full h-11 px-4 border disabled:cursor-not-allowed rounded-md outline-none"
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium mb-1">Discription</label>
          <Input
            title='Discription'
            type='text'
          
            disabled={!editForm}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full px-4 py-3 border disabled:cursor-not-allowed rounded-md outline-none resize-none"
          />
        </div>

        {/* Image Upload Section - Moved to bottom of form inputs */}
        <div className="pt-4">
          <label className="block text-sm font-medium mb-3">location Image</label>
          
          {/* Full Width Image Preview Container */}
          <div className={`w-full ${editForm ? 'border-2 border-dashed border-orange-500' : 'border border-gray-200'} rounded-lg overflow-hidden bg-gray-50 transition-all duration-200 mb-3`}>
            {/* Image Preview Area */}
            <div className="relative w-full aspect-video flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {imageUrl ? (
                <>
                  <div className="relative w-full h-full">
                    {/* Using regular img tag instead of Next.js Image for blob URLs */}
                    <Image
                      src={imageUrl}
                      alt="location preview"
                      height={200}
                      width={200}
                      className=" max-h-[300px] !rounded-sm w-full"
                    />
                  </div>
                  
                  {/* Image Info Overlay */}
                  <div className="absolute top-0 left-4 right-4 bg-black/70 text-white py-2 px-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* <ImageIcon size={16} /> */}
                      {/* <span className="text-sm truncate">{imageName}</span> */}
                    </div>
                    
                    {/* {editForm && (
                      <button
                        onClick={removeImage}
                        className="text-red-500 cursor-pointer hover:text-red-300 transition-colors"
                        title="Remove image"
                        type="button"
                      >
                        <X size={18} />
                      </button>
                    )} */}
                  </div>
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
                accept="image/*"
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
                      Supports: JPG, PNG, WebP • Max 5MB
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
                    <span>{imageName ? `Current image: ${imageName}` : 'No image selected'}</span>
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
        <LightBtn label="Cancel" onClick={onClose} />
        <PrimaryBtn label="Send Email" onClick={handleSend} />
      </div>
    </div>
  )
}