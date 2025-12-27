import Image from 'next/image'
import React, { useState } from 'react'

export default function EmailStep1() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h2 className="heading-4 font-medium text-[#111827]">
          Select email template
        </h2>
      </div>

      <div>
        <p className="text-[#70747D] body-4 font-normal">
          Choose a saved email template to use for your campaign.
        </p>
      </div>

      <div className="py-8">
        <div className="relative">
          <Image
            src="/images/search-icon.svg"
            width={20}
            height={20}
            alt="search"
            className="absolute left-2 top-2 z-20"
          />
          <input
            type="text"
            placeholder="Search..."
            className="py-2 pr-2 pl-8 flex w-full items-center outline-none rounded-lg bg-white border border-[#11182714] text-[14px] font-normal leading-5"
          />
        </div>
      </div>

      <div className="space-y-5">
        {/* Welcome Email */}
        <div 
          onClick={() => setSelectedTemplate('welcome')}
          className={`flex items-start gap-3 p-3 bg-[#ECFDF2] border rounded-lg shadow-[0_4px_8px_0_rgba(0,112,127,0.04)] cursor-pointer ${
            selectedTemplate === 'welcome' ? 'border-[#0CD767] shadow-lg' : 'border-transparent hover:border-[#0CD767]'
          }`}
        >
          <Image
            src="/images/wellcome-email.svg"
            width={48}
            height={48}
            alt="check"
          />
          <div className="space-y-1 flex-1">
            <h2 className="heading-5 text-[#111827]">Welcome Email</h2>
            <p className="body-4 text-[#70747D]">
              Greet new subscribers with a personalized welcome message.
              Introduce your brand, set expectations, and encourage them
              to explore your platform or latest offerings.
            </p>
          </div>
          <Image
            src="/images/file-search.svg"
            width={24}
            height={24}
            alt="view details"
            className="cursor-pointer"
          />
        </div>

        {/* Monthly Newsletter */}
        <div 
          onClick={() => setSelectedTemplate('newsletter')}
          className={`flex items-start gap-3 p-3 bg-[#FDF5EC] border rounded-lg shadow-[0_4px_8px_0_rgba(0,112,127,0.04)] cursor-pointer ${
            selectedTemplate === 'newsletter' ? 'border-[#f5ad5a] shadow-lg' : 'border-transparent hover:border-[#f5ad5a]'
          }`}
        >
          <Image
            src="/images/monthly-newsletter.svg"
            width={48}
            height={48}
            alt="newsletter"
          />
          <div className="space-y-1 flex-1">
            <h2 className="heading-5 text-[#111827]">
              Monthly Newsletter
            </h2>
            <p className="body-4 text-[#70747D]">
              Keep your audience updated with company news, product
              launches, and helpful insights. Build stronger
              relationships by sharing valuable content every month.
            </p>
          </div>
          <Image
            src="/images/file-search.svg"
            width={24}
            height={24}
            alt="view details"
            className="cursor-pointer"
          />
        </div>

        {/* Invoice Reminder */}
        <div 
          onClick={() => setSelectedTemplate('invoice')}
          className={`flex items-start gap-3 p-3 bg-[#ECFBFD] border rounded-lg shadow-[0_4px_8px_0_rgba(0,112,127,0.04)] cursor-pointer ${
            selectedTemplate === 'invoice' ? 'border-[#5de6f8] shadow-lg' : 'border-transparent hover:border-[#5de6f8]'
          }`}
        >
          <Image
            src="/images/invoice-reminder.svg"
            width={48}
            height={48}
            alt="invoice reminder"
          />
          <div className="space-y-1 flex-1">
            <h2 className="heading-5 text-[#111827]">
              Invoice Reminder
            </h2>
            <p className="body-4 text-[#70747D]">
              Automatically remind customers about pending or upcoming
              payments. Maintain professionalism while ensuring timely
              billing and smooth cash flow.
            </p>
          </div>
          <Image
            src="/images/file-search.svg"
            width={24}
            height={24}
            alt="view details"
            className="cursor-pointer"
          />
        </div>

        {/* Re-engagement Campaign */}
        <div 
          onClick={() => setSelectedTemplate('reengagement')}
          className={`flex items-start gap-3 p-3 bg-[#FDECFB] border rounded-lg shadow-[0_4px_8px_0_rgba(0,112,127,0.04)] cursor-pointer ${
            selectedTemplate === 'reengagement' ? 'border-[#fc5fe9] shadow-lg' : 'border-transparent hover:border-[#fc5fe9]'
          }`}
        >
          <Image
            src="/images/again-wellcom.svg"
            width={48}
            height={48}
            alt="reengagement"
          />
          <div className="space-y-1 flex-1">
            <h2 className="heading-5 text-[#111827]">
              Re-engagement Campaign
            </h2>
            <p className="body-4 text-[#70747D]">
              Win back inactive users with personalized offers, updates,
              or recommendations. Show them what's new and remind them
              why they loved your brand in the first place.
            </p>
          </div>
          <Image
            src="/images/file-search.svg"
            width={24}
            height={24}
            alt="view details"
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}