import React, { useState, useRef } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../ui/Input'
import Image from 'next/image'
import { Camera, Upload, X } from 'lucide-react'
import { servicesApi } from '../api/services'
import toast from 'react-hot-toast'

interface AddServiceDrawerProps {
  onClose?: () => void
  onSuccess?: () => void
}

export default function AddServiceDrawer({ onClose, onSuccess }: AddServiceDrawerProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [shortdescription, setShortDescription] = useState('')
  const [heading, setHeading] = useState('')
  const [type, setType] = useState('MOVING')
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    if (!shortdescription.trim()) newErrors.shortdescription = 'Short description is required'
    if (!heading.trim()) newErrors.heading = 'Heading is required'
    if (features.length === 0) newErrors.features = 'At least one feature is required'
    if (!logoFile) newErrors.logo = 'Logo image is required'
    if (!bannerFile) newErrors.banner = 'Banner image is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    // Clear previous errors
    setErrors({})
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Create FormData for the service
      const formData = new FormData()
      
      // Append text fields
      formData.append('title', title)
      formData.append('description', description)
      formData.append('shortdescription', shortdescription)
      formData.append('heading', heading)
      formData.append('type', type)
      
      // Append features (required by API)
      features.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature)
      })
      
      // Append logo (required)
      formData.append('logo', logoFile!)
      
      // Append banner (required)
      formData.append('bannerImg', bannerFile!)
      
      console.log('FormData created, calling API...')
      
      // CALL THE API HERE
      const response = await servicesApi.createService(formData)
      
      if (response && response.success) {
        toast.success('Service created successfully!')
        
        // Reset form
        setTitle('')
        setDescription('')
        setShortDescription('')
        setHeading('')
        setType('MOVING')
        setFeatures([])
        setNewFeature('')
        setLogoFile(null)
        setLogoPreview(null)
        setBannerFile(null)
        setBannerPreview(null)
        
        // Call success callback
        if (onSuccess) {
          onSuccess()
        }
        
        // Close drawer
        if (onClose) {
          onClose()
        }
      } else {
        toast.error(response?.message || "Failed to create service")
      }
      
    } catch (error: any) {
      console.error('Error creating service:', error)
      toast.error(error?.message || "Failed to create service")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: 'Please upload an image file' }))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Image size should be less than 5MB' }))
        return
      }

      setLogoFile(file)
      setErrors(prev => ({ ...prev, logo: '' }))
      
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
        setErrors(prev => ({ ...prev, banner: 'Please upload an image file' }))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, banner: 'Image size should be less than 5MB' }))
        return
      }

      setBannerFile(file)
      setErrors(prev => ({ ...prev, banner: '' }))
      
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
    setErrors(prev => ({ ...prev, logo: 'Logo image is required' }))
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }

  const removeBanner = () => {
    setBannerFile(null)
    setBannerPreview(null)
    setErrors(prev => ({ ...prev, banner: 'Banner image is required' }))
    if (bannerInputRef.current) {
      bannerInputRef.current.value = ''
    }
  }

  // Handle features
  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
      setErrors(prev => ({ ...prev, features: '' }))
    }
  }

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index)
    setFeatures(newFeatures)
    if (newFeatures.length === 0) {
      setErrors(prev => ({ ...prev, features: 'At least one feature is required' }))
    }
  }

  return (
    <div className="right-0 top-0 h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Add Service</h2>
        <p className="text-sm text-gray-500">
          Add your service below
        </p>
      </div>

      {/* Form Inputs */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-600">Title *</label>
              <Input
                title='Title'
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, title: '' }))
                  }
                }}
                placeholder="Enter service title"
                className="w-full h-11 px-4 border rounded-md outline-none"
                disabled={isSubmitting}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-600">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <option value="MOVING">Moving</option>
                <option value="STORAGE">Storage</option>
              </select>
            </div>

            {/* Heading */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-600">Heading *</label>
              <Input
                title='Heading'
                type="text"
                value={heading}
                onChange={(e) => {
                  setHeading(e.target.value)
                  if (e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, heading: '' }))
                  }
                }}
                placeholder="Enter main heading"
                className="w-full h-11 px-4 border rounded-md outline-none"
                disabled={isSubmitting}
              />
              {errors.heading && <p className="text-red-500 text-xs mt-1">{errors.heading}</p>}
            </div>

            {/* Short Description */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-600">Short Description *</label>
              <textarea
                value={shortdescription}
                onChange={(e) => {
                  setShortDescription(e.target.value)
                  if (e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, shortdescription: '' }))
                  }
                }}
                placeholder="Enter brief description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              />
              {errors.shortdescription && <p className="text-red-500 text-xs mt-1">{errors.shortdescription}</p>}
            </div>

            {/* Full Description */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-600">Full Description *</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, description: '' }))
                  }
                }}
                placeholder="Enter detailed description"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold text-gray-700">Features *</h3>
            <span className="text-xs text-gray-500">
              {features.length} feature(s) added
            </span>
          </div>
          
          {errors.features && <p className="text-red-500 text-xs -mt-1">{errors.features}</p>}
          
          <div className="space-y-3">
            {/* Existing Features */}
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
                <button
                  onClick={() => removeFeature(index)}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  title="Remove feature"
                  disabled={isSubmitting}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {/* Add New Feature */}
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter new feature"
                className="flex-1 h-11"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                disabled={isSubmitting}
              />
              <button
                onClick={addFeature}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={!newFeature.trim() || isSubmitting}
                type="button"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Logo Image */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-600">Service Logo *</label>
          {errors.logo && <p className="text-red-500 text-xs">{errors.logo}</p>}
          
          <div className="w-full border-2 border-dashed border-orange-500 rounded-lg overflow-hidden bg-orange-50 transition-all duration-200 mb-3">
            {/* Logo Preview Area */}
            <div className="relative w-full aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {logoPreview ? (
                <>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={logoPreview}
                      alt="Service logo preview"
                      width={200}
                      height={200}
                      className="max-h-[200px] max-w-full object-contain p-4"
                    />
                  </div>
                  
                  {/* Remove Logo Button */}
                  <button
                    onClick={removeLogo}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove logo"
                    type="button"
                    disabled={isSubmitting}
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                  <Camera size={48} className="mb-3" />
                  <p className="text-sm font-medium mb-1">No logo uploaded</p>
                  <p className="text-xs text-center">Upload a service logo to display here</p>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="p-4 bg-orange-50">
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
                disabled={isSubmitting}
              />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <button
                    type="button"
                    onClick={triggerLogoInput}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <Upload size={18} />
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  
                  <p className="mt-2 text-xs text-gray-500">
                    Supports: JPG, PNG, WebP • Max 5MB
                  </p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Recommended:</p>
                  <p className="text-xs">Square ratio (1:1) for best quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Image */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-600">Service Banner *</label>
          {errors.banner && <p className="text-red-500 text-xs">{errors.banner}</p>}
          
          <div className="w-full border-2 border-dashed border-orange-500 rounded-lg overflow-hidden bg-orange-50 transition-all duration-200 mb-3">
            {/* Banner Preview Area */}
            <div className="relative w-full aspect-video flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {bannerPreview ? (
                <>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={bannerPreview}
                      alt="Service banner preview"
                      width={500}
                      height={300}
                      className="max-h-[300px] max-w-full object-contain p-4"
                    />
                  </div>
                  
                  {/* Remove Banner Button */}
                  <button
                    onClick={removeBanner}
                    className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove banner"
                    type="button"
                    disabled={isSubmitting}
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                  <Camera size={48} className="mb-3" />
                  <p className="text-sm font-medium mb-1">No banner uploaded</p>
                  <p className="text-xs text-center">Upload a service banner to display here</p>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="p-4 bg-orange-50">
              <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerUpload}
                accept="image/*"
                className="hidden"
                disabled={isSubmitting}
              />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <button
                    type="button"
                    onClick={triggerBannerInput}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <Upload size={18} />
                    {bannerPreview ? 'Change Banner' : 'Upload Banner'}
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
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-4">
        <LightBtn 
          label="Cancel" 
          onClick={onClose}
          disabled={isSubmitting}
        />
        <PrimaryBtn 
          label={isSubmitting ? "Creating..." : "Create Service"} 
          onClick={handleSave}
          disabled={isSubmitting}
        />
      </div>
    </div>
  )
}