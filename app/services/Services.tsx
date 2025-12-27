import React, { useState } from 'react'
import AdminTable from './ServicesTable'
import PrimaryBtn from '../ui/buttons/PrimaryBtn'
import { motion , AnimatePresence } from 'framer-motion'
import AddServiceDrawer from './AddServiceDrawer'

export default function Services() {
  const [openAddService ,setOpenAddService ] = useState(false);

const handleOpenService = ()=>{
  setOpenAddService(true)
}

  return (
    <div>
      <div className='flex items-center justify-between'>
      <div className='space-y-2 mb-5'>
          <h2 className='heading-2 text-[#111827] font-medium'>Services</h2>
          <p className='heading-5 text-[#70747D] font-normal'>Better you provide the services , more you grow.</p>
      </div>
      <div>
      <PrimaryBtn onClick={handleOpenService} label='Add Service'/>
      </div>
      </div>
      <AdminTable setIsDrawerOpen={()=>{}}/>

         <AnimatePresence>
        {openAddService && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenAddService(false)} // close on overlay click
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0  w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
             <AddServiceDrawer onClose={()=>{setOpenAddService(false)}} onSendEmail={()=>{setOpenAddService(false)}} />
            </motion.div>
          </>
        )}
      </AnimatePresence>




    </div>
  )
}
