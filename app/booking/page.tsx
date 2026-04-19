'use client'
import React, { useEffect, useState } from "react";
import SharedTable from "../shared/SharedTable";
import DashboardStats from "../dashboard/DashboardStats";
import { dashboardAPI } from "../api/dashboard";
import { Booking } from "./types";
import { bookingAPI } from "../api/booking";

// ─── Custom Drawer ────────────────────────────────────────────────────────────
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const CustomDrawer: React.FC<DrawerProps> = ({ open, onClose, title, children }) => (
  <div className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "visible" : "invisible pointer-events-none"}`}>
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      onClick={onClose}
    />
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <span className="font-semibold text-[16px] text-[#11224E]">{title}</span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>
      <div className="overflow-y-auto flex-1 p-6">
        {children}
      </div>
    </div>
  </div>
);

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow: React.FC<{ label: string; value?: string | null | boolean }> = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
    <span className="text-[13px] text-[#111827] font-medium">
      {value === null || value === undefined || value === "" ? (
        <span className="text-gray-300 italic">—</span>
      ) : typeof value === "boolean" ? (
        value ? "Yes" : "No"
      ) : (
        value
      )}
    </span>
  </div>
);

// ─── Booking Detail Drawer ────────────────────────────────────────────────────
interface BookingDetailDrawerProps {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const BookingDetailDrawer: React.FC<BookingDetailDrawerProps> = ({ open, booking, onClose, onDelete }) => {
  const [confirming, setConfirming] = useState(false);

  if (!booking) return null;

  return (
    <CustomDrawer open={open} onClose={onClose} title="Booking Details">
      {/* User Card */}
      <div className="bg-[#F8F9FB] rounded-xl p-4 flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#11224E] flex items-center justify-center text-white font-bold text-[15px]">
          {booking.user?.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <p className="font-semibold text-[13px] text-[#11224E]">{booking.user?.name || "—"}</p>
          <p className="text-[12px] text-gray-500">{booking.user?.email || "—"}</p>
          <p className="text-[12px] text-gray-500">{booking.user?.phone || "—"}</p>
        </div>
      </div>

      {/* Booking Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <DetailRow label="Type" value={booking.type} />
        <DetailRow label="Service Type" value={booking.serviceType} />
        <DetailRow label="Storage Type" value={booking.storageType} />
        <DetailRow label="Storage Size" value={booking.storageSize} />
        <DetailRow label="Rental Plan" value={booking.rentalPlan} />
        <DetailRow label="Location" value={booking.location} />
        <DetailRow label="Pickup Location" value={booking.pickupLocation} />
        <DetailRow label="Dropoff Location" value={booking.dropOffLocation} />
        <DetailRow label="Is Business" value={booking.isBusiness} />
        <DetailRow label="Is Hometown" value={booking.isHometown} />
        <DetailRow label="Is Student" value={booking.isStudent} />
        <DetailRow label="Created At" value={new Date(booking.createdAt).toLocaleString()} />
      </div>

      {/* Comments */}
      {booking.comments && (
        <div className="mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Comments</span>
          <p className="mt-1 text-[13px] text-[#111827] bg-[#F8F9FB] rounded-lg p-3">{booking.comments}</p>
        </div>
      )}

      {/* Delete */}
      <div className="border-t border-gray-100 pt-4 mt-2">
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="w-full py-2.5 rounded-lg border border-red-200 text-red-600 text-[13px] font-medium hover:bg-red-50 transition-colors"
          >
            Delete Booking
          </button>
        ) : (
          <div className="bg-red-50 rounded-lg p-4 space-y-3">
            <p className="text-[13px] text-red-700 font-medium">Are you sure you want to delete this booking?</p>
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(booking.id)}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-[13px] font-medium hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-[13px] font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </CustomDrawer>
  );
};

// ─── Delete Button in Table ───────────────────────────────────────────────────
const TableDeleteButton: React.FC<{ onDelete: () => void }> = ({ onDelete }) => {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={onDelete}
          className="px-2 py-1 rounded bg-red-600 text-white text-[11px] font-medium hover:bg-red-700 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-[11px] font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
      title="Delete"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
      </svg>
    </button>
  );
};

// ─── Booking Page ─────────────────────────────────────────────────────────────
const BookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    setStatsLoading(true);
    dashboardAPI.getStats().then((res) => {
      setStats(res.data as any ?? null);
    }).finally(() => setStatsLoading(false));
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingAPI.list();
      setBookings(data);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await bookingAPI.remove(id);
    setDrawerOpen(false);
    fetchBookings();
  }; 

  return (
    <div className="space-y-8">
      <DashboardStats stats={stats} loading={statsLoading} />
      <SharedTable
        title="Bookings"
        data={bookings as any}
        columns={[
          { label: "Type", key: "type" },
          {
            label: "Service Type",
            key: "serviceType",
            type: "custom",
            render: (row: Booking) => row.serviceType || <span className="text-gray-300">—</span>,
          },
          {
            label: "Pickup",
            key: "pickupLocation",
            type: "custom",
            render: (row: Booking) => row.pickupLocation || <span className="text-gray-300">—</span>,
          },
          {
            label: "Dropoff",
            key: "dropOffLocation",
            type: "custom",
            render: (row: Booking) => row.dropOffLocation || <span className="text-gray-300">—</span>,
          },
          {
            label: "Location",
            key: "location",
            type: "custom",
            render: (row: Booking) => row.location || <span className="text-gray-300">—</span>,
          },
          {
            label: "User",
            key: "user",
            type: "custom",
            render: (row: Booking) => (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#11224E] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {row.user?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <span>{row.user?.name || "—"}</span>
              </div>
            ),
          },
          {
            label: "Email",
            key: "email",
            type: "custom",
            render: (row: Booking) => row.user?.email || <span className="text-gray-300">—</span>,
          },
          {
            label: "Phone",
            key: "phone",
            type: "custom",
            render: (row: Booking) => row.user?.phone || <span className="text-gray-300">—</span>,
          },
          {
            label: "Created",
            key: "createdAt",
            type: "custom",
            render: (row: Booking) => new Date(row.createdAt).toLocaleDateString(),
          },
        ]}
        actions={(row) => {
          const booking = row as unknown as Booking;
          return (
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 rounded hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors"
                title="View"
                onClick={() => {
                  setSelectedBooking(booking);
                  setDrawerOpen(true);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <TableDeleteButton onDelete={() => handleDelete(booking.id)} />
            </div>
          );
        }}
        actionsType="inline"
        selectable={false}
        searchable={false}
        filterable={false}
        showResetButton={false}
      />
      <BookingDetailDrawer
        open={drawerOpen}
        booking={selectedBooking}
        onClose={() => setDrawerOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default BookingPage;