export interface Booking {
  id: string;
  userId?: number | null;
  logo?: string | null;
  type: string;
  serviceType?: string | null;
  preferredDate?: string | null;
  pickupLocation?: string | null;
  dropOffLocation?: string | null;
  isCompany?: boolean | null;
  storageType?: string | null;
  rentalPlan?: string | null;
  storageSize?: string | null;
  location?: string | null;
  isBusiness?: boolean | null;
  isHometown?: boolean | null;
  isStudent?: boolean | null;
  comments?: string | null;
  createdAt: string;
  updatedAt?: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
  } | null;
}
