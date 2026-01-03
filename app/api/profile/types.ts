// Single comprehensive interface
export interface getProfileApiResponse {
  status: "success" | "error";
  message: string;
  data?: {
    id: number;
    email: string;
    role: "ADMIN" | "USER";
    emailVerified: boolean;
    phone: string | null;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  error?: {
    code: string;
    message: string;
    timestamp?: string;
  };
}

export interface updateProfileApiResponse {
  status: "success" | "error";
  success?:boolean
  message: string;
  data: {
    id: number;
    email: string;
    role: "ADMIN" | "USER" | "SUPER_ADMIN";
    emailVerified: boolean;
    phone: string | null;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
}

export interface updateProfilePayload {
    name : string
    email : string
}

export interface uploadImagePayload {
    file : File
}