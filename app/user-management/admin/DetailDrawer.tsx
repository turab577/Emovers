import React, { useState } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'

interface EmailDrawerProps {
  onClose?: () => void
  onSendEmail?: (data: { email: string; message: string }) => void
}

export default function DetailDrawer({ onClose, onSendEmail }: EmailDrawerProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!email || !message) {
      console.warn('Both fields are required')
      return
    }

    onSendEmail?.({ email, message })
  }

  return (
    <div className=" right-0 top-0 h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Admin Detail</h2>
        <p className="text-sm text-gray-500">
          Following is the detail for Admin
        </p>
      </div>

      {/* Inputs */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-md font-medium mb-1">Name</label>
         <p className="text-sm font-normal">Admin123</p>
        </div>

        <div>
          <label className="block text-md font-medium mb-1">Email</label>
         <p className="text-sm font-normal">Admin@gmail.com</p>
        </div>

      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <LightBtn label="Cancel" onClick={onClose} />
        {/* <PrimaryBtn label="Send Email" onClick={handleSend} /> */}
      </div>
    </div>
  )
}
