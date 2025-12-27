'use client'
import PrimaryBtn from '@/app/ui/buttons/PrimaryBtn'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

// ActionDropdown component (similar to what you have in Emails)
const ActionDropdown = ({ 
  row, 
  actions 
}: { 
  row: any; 
  actions: (row: any) => React.ReactNode 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative h-[36px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" cursor-pointer rounded transition-colors duration-200"
      >
        <Image 
          src="/images/more.svg" 
          alt="More actions" 
          height={36} 
          width={36} 
        />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop to close when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            {actions(row)}
          </div>
        </>
      )}
    </div>
  )
}

export default function SideContent() {
    const [isOpen, setIsOpen] = useState(true)
    const [selectedContact, setSelectedContact] = useState({
        id: 1,
        name: "Floyd Miles",
        company: "Google",
        lastActivity: "Aug 12, 2025"
    })

    const openSection = () => {
        setIsOpen(prev => !prev)
    }

    // Define actions for the dropdown
    const getActions = (row: any): React.ReactNode => (
        <div className="p-2">
            <button 
                type="button"
                className="w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
                onClick={() => console.log('Send email to', row.name)}
            >
                Send Email
            </button>
            <button 
                type="button"
                className="w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
                onClick={() => console.log('Schedule meeting with', row.name)}
            >
                Schedule Meeting
            </button>
            <button 
                type="button"
                className="w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors duration-200"
                onClick={() => console.log('Add note for', row.name)}
            >
                Add Note
            </button>
            <button 
                type="button"
                className="w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors duration-200 text-red-600"
                onClick={() => console.log('Delete contact', row.name)}
            >
                Delete Contact
            </button>
        </div>
    )

    const data = [
        {
            id: 1,
            title: "Email",
            value: "floyd@gmail.com",
            img: '/images/mail-plus.svg'
        },
        {
            id: 2,
            title: "Phone",
            value: "+89-9875-789",
            img: '/images/phone.svg'
        },
        {
            id: 3,
            title: "Role",
            value: "Manager",
            img: '/images/contact.svg'
        },
        {
            id: 4,
            title: "Source",
            value: "LinkedIn",
            img: '/images/linkedin.svg'
        },
    ]

    return (
        <div className='pt-5 h-full flex flex-col'>
            {/* Header section - fixed height */}
            <div className="flex gap-2 items-center text-[#70747D] flex-shrink-0 px-4">
                <Link href="/leads" className="heading-6 font-regular leading-[20px] hover:text-blue-500 hover:underline">Leads</Link>
                <Image src='/images/center-arrow.svg' alt='Arrow' height={20} width={20} />
                <h6 className="heading-6 font-regular leading-[20px]">Floyd Miles</h6>
            </div>

            {/* Scrollable content area */}
            <div className='flex-1 overflow-y-auto hide-scrollbar'>
                <div className='flex flex-col min-h-full'>
                    <div className='flex flex-col items-center pt-[32px] flex-1'>
                        {/* Profile section */}
                        <div className="flex-shrink-0">
                            <Image src='/images/profile-icon.png' alt='profile-image' height={100} width={100} />
                            <h4 className="heading-4 font-medium mt-4">Floyd Miles</h4>
                            <div className="flex gap-2 pt-2 items-center justify-center">
                                <Image src='/images/google2.svg' alt='Google' height={20} width={20} />
                                <p className="heading-7 font-normal text-[#70747D]">Google</p>
                            </div>
                        </div>

                        {/* Icons section - Updated with dropdown */}
                        <div className="flex gap-5 flex-shrink-0 px-4 mt-5">
                            <div className="flex flex-col items-center gap-2">
                                <Image src='/images/email.svg' alt='Email' height={36} width={36} />
                                <p className='heading-7 font-normal text-[#70747D]'>Email</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Image src='/images/meeting.svg' alt='Email' height={36} width={36} />
                                <p className='heading-7 font-normal text-[#70747D]'>Meeting</p>
                            </div>
                            <div className="flex flex-col  items-center gap-2  relative">
                                <ActionDropdown 
                                    row={selectedContact} 
                                    actions={getActions} 
                                />
                                <p className='heading-7 font-normal text-[#70747D]'>More</p>
                            </div>
                        </div>

                        {/* Last activity */}
                        <div className="flex gap-1 pt-5 items-center flex-shrink-0">
                            <div className="bg-[#3DDF85] h-[6px] w-[6px] rounded-full"></div>
                            <p className='heading-7 font-normal text-[#70747D]'>Last activity:</p>
                            <p className="heading-7 font-normal text-[#111827]">Aug 12, 2025</p>
                        </div>

                        {/* Leads info */}
                        <div className='pt-8 w-full flex-shrink-0 px-4'>
                            <div className='flex justify-between'>
                                <p className='heading-7 font-normal'>LEADS INFO</p>
                                <Image
                                    src='/images/arrow-down.svg'
                                    alt='Down arrow'
                                    height={20}
                                    width={20}
                                    onClick={openSection}
                                    className={`cursor-pointer transition-transform duration-300 ease-in-out ${isOpen ? "" : "rotate-180"}`}
                                />
                            </div>
                        </div>

                        {/* Data list with improved transition */}
                        <div className={`
                            w-full px-4 flex-shrink-0
                            transition-all duration-300 ease-in-out
                            ${isOpen
                                ? "max-h-96 opacity-100 pt-3"
                                : "max-h-0 opacity-0 pt-0"
                            }
                            overflow-hidden
                        `}>
                            <div className="flex flex-col gap-2 w-full items-center">
                                {data.map((item) => (
                                    <div key={item.id} className='bg-[#FEF4ED] w-full p-3 rounded-lg flex justify-between'>
                                        <div>
                                            <p className='heading-7 font-normal text-[#70747D]'> {item.title} </p>
                                            <p className='heading-7 font-medium text-[#111827] mt-1'> {item.value}</p>
                                        </div>
                                        <Image src={item.img} alt={item.title} width={20} height={20} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Button at the end - auto adjusts */}
                    <div className='w-full px-4 py-5 flex-shrink-0 mt-auto'>
                        <PrimaryBtn label='Add to campaign' imageSrc='/images/arrow-right.svg' imagePosition='right' />
                    </div>
                </div>
            </div>
        </div>
    )
}