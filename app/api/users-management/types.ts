export type UsersApiResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    status: string;
    emailVerified: boolean;
    mfaEnabled: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
    profilePicture: string | null;
    isEmail: boolean;
    isNotification: boolean;
  }[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};