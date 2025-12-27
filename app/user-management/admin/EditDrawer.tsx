import React, { useState } from 'react'
import LightBtn from '@/app/ui/buttons/LightButton'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Input from '../../ui/Input'

interface EmailDrawerProps {
  onClose?: () => void
  onSendEmail?: (data: { email: string; message: string }) => void
}

export default function DetailDrawer({ onClose, onSendEmail }: EmailDrawerProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [editForm , setEditForm] = useState(false)

  const handleSend = () => {
    if (!email || !message) {
      console.warn('Both fields are required')
      return
    }

    onSendEmail?.({ email, message })
  }

  const handleEdit = ()=>{
    setEditForm(prev=>!prev)
  }
  const handleSave = ()=>{
    setEditForm(false)
  }

  return (
    <div className=" right-0 top-0 h-full w-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex justify-between">
        <div>
        <h2 className="text-lg font-semibold">Update Admin</h2>
        <p className="text-sm text-gray-500">
          You can update Admin from here
        </p>
        </div>
        <p onClick={ editForm ? handleSave : handleEdit} className="text-orange-500 cursor-pointer text-sm underline">{ editForm ? "Save" : "Edit" }</p>
      </div>

      {/* Inputs */}
      <div className="flex-1 space-y-4">
        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
          title='Name'
            type="text"
            value={email}
            disabled={!editForm}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full h-11 px-4 border disabled:cursor-not-allowed rounded-md outline-none "
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            title='Email'
            type='email'
            disabled={!editForm}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="w-full  px-4 py-3 border disabled:cursor-not-allowed rounded-md outline-none resize-none "
          />
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
