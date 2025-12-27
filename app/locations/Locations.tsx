import React, { useState } from 'react'
import AdminTable from './LocationsTable'
import PrimaryBtn from '../ui/buttons/PrimaryBtn'
import { motion , AnimatePresence } from 'framer-motion'
import AddLocationDrawer from './AddLocationDrawer'

export default function Location() {
  const [openAddLocation ,setOpenAddLocation ] = useState(false);

const handleOpenLocation = ()=>{
  setOpenAddLocation(true)
}

  return (
    <div>
      <div className='flex items-center justify-between'>
      <div className='space-y-2 mb-5'>
          <h2 className='heading-2 text-[#111827] font-medium'>Locations</h2>
          <p className='heading-5 text-[#70747D] font-normal'>Give your location and see the clients approaching you</p>
      </div>
      <div>
      <PrimaryBtn onClick={handleOpenLocation} label='Add Location'/>
      </div>
      </div>
      <AdminTable setIsDrawerOpen={()=>{}}/>

         <AnimatePresence>
        {openAddLocation && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 h-[100vh] z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenAddLocation(false)} // close on overlay click
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0  w-full h-[100vh] overflow-auto hide-scrollbar sm:w-[580px] bg-white z-50 rounded-l-lg p-5"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
             <AddLocationDrawer onClose={()=>{setOpenAddLocation(false)}} onSendEmail={()=>{setOpenAddLocation(false)}} />
            </motion.div>
          </>
        )}
      </AnimatePresence>




    </div>
  )
}
