// Register types

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
}

export interface RegisterSuccessResponse {
  error?: {
    message: string;
    code?: string;
  };
  message: string;
  emailSent?: boolean;
  user?: {
    id: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    profile: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

// login types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  message: string;
  success : boolean
  user: {
    id: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken : string;
}

export interface RefreshTokenResponse {
  message : string,
  tokens : {
    accessToken : string,
    refreshToken : string
  }
}

// forgot password

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordSuccessResponse {
  message: string;
}

// reset password

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  // confirmPassword: string;
  email : string;
}

export interface ResetPasswordSuccessResponse {
  message: string;
}

// change password

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword : string;
}

export interface ChangePasswordSuccessResponse {
  message: string;
  status : number
}

// verify email

export interface VerifyEmailRequest {
  token: string;
  user?: string;
}

export interface VerifyEmailSuccessResponse {
  error: {
    message: string;
  };
  message: string;
  user: {
    id: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    profile: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// verify otp

export interface ResetOtpRequest {
  email: string;
  otp: string;
}

export interface ResetOtpSuccessResponse {
  message: string;
  otpVerified: boolean;
}

// resend verification email
export interface ResendVerificationEmailRequest {
  email: string;
}

export interface ResendVerificationEmailResponse {
  message: string;
}

// resend reset OTP
export interface ResendResetOTPRequest {
  email: string;
}

export interface ResendResetOTPResponse {
  message: string;
}
