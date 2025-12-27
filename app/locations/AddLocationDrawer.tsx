import React, { useState, useRef } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../ui/Input'
import Image from 'next/image'
import { Camera, Upload, X } from 'lucide-react'

interface EmailDrawerProps {
  onClose?: () => void
  onSendEmail?: (data: { email: string; message: string; image?: File }) => void
}

export default function AddlocationDrawer({ onClose, onSendEmail }: EmailDrawerProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!email || !message) {
      console.warn('Both fields are required')
      return
    }
    
    // Send data including the image file if it exists
    const data = { 
      email, 
      message, 
      ...(imageFile && { image: imageFile })
    }
    onSendEmail?.(data)
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter location title"
            className="w-full h-11 px-4 border rounded-md outline-none"
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium mb-1">Discription</label>
          <Input
            title='Discription'
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full px-4 py-3 border rounded-md outline-none "
          />
        </div>

        {/* Image Upload Section - Always editable */}
        <div className="pt-4">
          <label className="block text-sm font-medium mb-3">Lcation Image</label>
          
          {/* Full Width Image Preview Container with Orange Dashed Border */}
          <div className="w-full border-2 border-dashed border-orange-500 rounded-lg overflow-hidden bg-orange-50 transition-all duration-200 mb-3">
            {/* Image Preview Area */}
            <div className="relative w-full aspect-video flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {imageUrl ? (
                <>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={imageUrl}
                      alt="location preview"
                      width={500}
                      height={300}
                      className="max-h-[300px] max-w-full object-contain p-4"
                    />
                  </div>
                  
                  {/* Remove Image Button */}
                  <button
                    onClick={removeImage}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
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
                accept="image/*"
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
                    Supports: JPG, PNG, WebP • Max 5MB
                  </p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Recommended:</p>
                  <p className="text-xs">1200×600px or 16:9 ratio for best quality</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Editable Indicator */}
         
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