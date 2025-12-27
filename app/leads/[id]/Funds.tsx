'use client'
import Image from 'next/image'
import React, { useState } from 'react'

export default function Funds() {
    const [isOpen, setIsOpen] = useState(true)

    const toggleSection = () => {
        setIsOpen(prev => !prev)
    }

    const funds = [
        {
            id: 1,
            value: "$459B",
            title: "Total funds",
            img: "/images/wallet.svg"
        },
        {
            id: 2,
            value: "Series B",
            title: "Funding stage",
            img: "/images/stage.svg"
        },
    ]

    const company = [
        {
            id: 1,
            img: "/images/building.svg",
            value: "Software Services",
            title: "Industry"
        },
        {
            id: 2,
            img: "/images/user.svg",
            value: "10k - 20k",
            title: "Company size"
        },
        {
            id: 3,
            img: "/images/calendar.svg",
            value: "2001",
            title: "Founded year"
        },
        {
            id: 4,
            img: "/images/location.svg",
            value: "Silicon Valley, USA",
            title: "Headquarters"
        },
    ]

    return (
        <div className='py-5 px-5 w-full '>
            <div className="flex gap-1 items-center">
                <Image src='/images/google2.svg' height={52} width={52} alt='google payment' />
                <div className='flex flex-col gap-1 justify-center'>
                    <p className="body-1 font-medium text-[#111827]">Google</p>
                    <p className="body-3 font-regular text-[#70747D]">google.com</p>
                </div>
            </div>
            <div className='pt-[24px] flex flex-col gap-2'>
                {funds.map((item) => (
                    <div key={item.id} className='bg-[#FEF4ED] rounded-lg w-full flex justify-between items-center p-3'>
                        <div className="flex flex-col gap-[2px]">
                            <h6 className="heading-6 font-medium text-[#111827]">{item.value}</h6>
                            <p className='heading-7 font-regular text-[#70747D]'>{item.title}</p>
                        </div>
                        <Image src={item.img} alt={item.title} height={36} width={36} />
                    </div>
                ))}
            </div>
            <div className='flex justify-between items-center w-full pt-6'>
                <p className="heading-7 text-[#70747D] font-regular">COMPANY DETAILS</p>
                <Image
                    src='/images/arrow-down.svg'
                    alt='Down arrow'
                    height={20}
                    width={20}
                    onClick={toggleSection}
                    className={`cursor-pointer transition-transform duration-300 ease-in-out ${isOpen ? "" : "rotate-180"}`}
                />
            </div>
            
            {/* Company Details with smooth transition */}
            <div className={`
                transition-all duration-300 ease-in-out
                ${isOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }
                overflow-hidden
            `}>
                <div className="flex gap-2 flex-col max-h-[500px] hide-scrollbar overflow-auto  pt-3">
                    {company.map((item) => (
                        <div key={item.id} className='flex items-center gap-4 border-b px-3 py-5 border-[#E2E3E5]'>
                            <Image src={item.img} alt={item.title} height={20} width={20} />
                            <div className="flex flex-col gap-1">
                                <p className="heading-7 font-medium text-[#111827]">{item.value}</p>
                                <p className="heading-7 font-medium text-[#70747D]">{item.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}