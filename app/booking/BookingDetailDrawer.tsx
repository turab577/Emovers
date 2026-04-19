import React, { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  responsive?: boolean;
}

const CustomDrawer: React.FC<DrawerProps> = ({ open, onClose, title, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "visible" : "invisible pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-xl transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ maxWidth: "100vw" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-lg">{title}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 56px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
};
import { Booking } from "./types";

interface BookingDetailDrawerProps {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const BookingDetailDrawer: React.FC<BookingDetailDrawerProps> = ({ open, booking, onClose, onDelete }) => {
  if (!booking) return null;
  return (
    <CustomDrawer open={open} onClose={onClose} title="Booking Details">
      <div className="p-4 space-y-3">
        <div><b>Type:</b> {booking.type}</div>
        <div><b>Location:</b> {booking.location}</div>
        <div><b>Storage Type:</b> {booking.storageType}</div>
        <div><b>Rental Plan:</b> {booking.rentalPlan}</div>
        <div><b>Storage Size:</b> {booking.storageSize}</div>
        <div><b>Is Business:</b> {booking.isBusiness ? "Yes" : "No"}</div>
        <div><b>Comments:</b> {booking.comments}</div>
        <div><b>Created At:</b> {booking.createdAt}</div>
        <div><b>User:</b> {booking.user?.name} ({booking.user?.email})</div>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => onDelete(booking.id)}
        >
          Delete Booking
        </button>
      </div>
    </CustomDrawer>
  );
};

export default BookingDetailDrawer;
