"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
import Input from "@/app/ui/Input";
import ConfirmationModal from "@/app/shared/ConfirmationModal";
import toast from "react-hot-toast";
import { profileAPI } from "../api/profile";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
}

const Profile: React.FC = () => {
  const [profileImg, setProfileImg] = useState<string>("/images/profile.svg");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: "/images/profile.svg"
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingImage, setIsUpdatingImage] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  
  const [tempFirstName, setTempFirstName] = useState<string>("");
  const [tempLastName, setTempLastName] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");
  
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await profileAPI.getProfile();

      console.log('API Response:', response);
      
      // Check if response exists and has the expected structure
      if (response?.success && response?.data) {
        const userData = response.data;
        const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
        
        setUser({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          profilePic: userData.profilePicture || "/images/profile.svg"
        });
        
        setName(fullName);
        setEmail(userData.email || "");
        setTempFirstName(userData.firstName || "");
        setTempLastName(userData.lastName || "");
        setTempEmail(userData.email || "");
        
        if (userData.profilePicture) {
          setProfileImg(userData.profilePicture);
        }
        
        // toast.success(response.message || "Profile loaded successfully");
      } else {
        throw new Error(response?.message || "Failed to fetch profile");
      }
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      
      // Handle different error structures
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error?.message) {
        toast.error(error.response.data.error.message);
      } else if (error.message?.includes("Unexpected token '<'")) {
        // Handle JSON parsing error (HTML response)
        toast.error("Server error. Please try again later.");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load profile data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeImage = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Image size should be less than 1MB");
      return;
    }

    setProfileImageFile(file);

    try {
      setIsUpdatingImage(true);

      // Create a preview URL for immediate feedback
      const imageUrl = URL.createObjectURL(file);
      setProfileImg(imageUrl);

      // Create form data for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Call API to upload image
      const response = await profileAPI.updateProfileImage(formData as any);
      const apiResponse = response.data;
            
      if (response.status == 'success' as any) {
        // Update user state with new image
        const updatedUser = {
          ...user,
          profilePic: imageUrl
        };
        
        setUser(updatedUser);
        
        toast.success(response.message || "Profile picture updated successfully!");
        window.location.reload();

      } else {
        // Revert preview if API fails
        setProfileImg(user.profilePic);
        throw new Error(apiResponse?.message || "Failed to update profile picture");
      }
      
    } catch (error: any) {
      console.error("Failed to update profile picture:", error);
      
      // Revert preview on error
      setProfileImg(user.profilePic);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error?.message) {
        toast.error(error.response.data.error.message);
      } else if (error.message?.includes("Unexpected token '<'")) {
        // Handle JSON parsing error (HTML response)
        toast.error("Server error. Please try again later.");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update profile picture. Please try again.");
      }
    } finally {
      setIsUpdatingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const startEditing = (): void => {
    setTempFirstName(user.firstName);
    setTempLastName(user.lastName);
    setTempEmail(email);
    setIsEditing(true);
  };

  const cancelEditing = (): void => {
    setTempFirstName(user.firstName);
    setTempLastName(user.lastName);
    setTempEmail(email);
    setIsEditing(false);
  };

  // Function to split full name into firstName and lastName
  const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
    const nameParts = fullName.trim().split(/\s+/);
    
    if (nameParts.length === 0) {
      return { firstName: "", lastName: "" };
    }
    
    if (nameParts.length === 1) {
      return { firstName: nameParts[0], lastName: "" };
    }
    
    // First part as firstName, all other parts combined as lastName
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    
    return { firstName, lastName };
  };

  const saveChanges = async (): Promise<void> => {
  try {
    // Validate firstName
    if (!tempFirstName.trim()) {
      toast.error("First name is required");
      return;
    }

    // Validate email
    if (!tempEmail.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsUpdatingProfile(true);

    // Prepare payload for API
    const payload = {
      firstName: tempFirstName.trim(),
      lastName: tempLastName.trim(),
      email: tempEmail.trim()
    };

    // Try to call API with error handling
    let response;
    try {
      response = await profileAPI.updateProfileApiResponse(payload);
      console.log('Update Profile Response:', response);
    } catch (apiError: any) {
      console.log('API call threw error:', apiError);
      
      // Check if the error response actually contains success data
      if (apiError?.response?.status === "success" || apiError?.response?.success) {
        // The API call succeeded but threw an error anyway
        response = apiError.response;
      } else {
        // Re-throw if it's a real error
        throw apiError;
      }
    }
    
    // If we have a response with success status
    if (response?.status === "success" || response?.success) {
      // Update user state
      const updatedUser = {
        firstName: response.data?.firstName || payload.firstName,
        lastName: response.data?.lastName || payload.lastName,
        email: response.data?.email || payload.email,
        profilePic: response.data?.profilePicture || user.profilePic
      };

      setUser(updatedUser);
      setName(`${updatedUser.firstName} ${updatedUser.lastName}`.trim());
      setEmail(updatedUser.email);
      setIsEditing(false);
      
      toast.success(response.message || "Profile updated successfully!");
      setIsEditing(false)
      return;
    }
    
    // If we get here, something went wrong
    throw new Error(response?.message || "Failed to update profile");
    
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    
    // Show error toast
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  } finally {
    setIsUpdatingProfile(false);
  }
};

  const router = useRouter()

  const confirmLogout = (): void => {
    // Simulate logout
    setIsLogoutModalOpen(false);
    Cookies.remove('accessToken')
    // Redirect to login page (simulated)
    router.push('/')
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          <h1 className="heading-4 text-[#111827] font-medium">Profile</h1>
          <p className="body-3 text-[#70747D] font-normal">
            Customize your profile and make it truly yours.
          </p>
        </div>
        <div className="bg-[#F6F6F6] p-3 rounded-xl space-y-3">
          <div className="bg-white rounded-xl p-3 flex items-center justify-center">
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#F87B1B]"></div>
              <p className="mt-2 text-[#70747D]">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h1 className="heading-4 text-[#111827] font-medium">Profile</h1>
        <p className="body-3 text-[#70747D] font-normal">
          Customize your profile and make it truly yours.
        </p>
      </div>

      <div className="bg-[#F6F6F6] p-3 rounded-xl space-y-3">
        <div className="bg-white rounded-xl p-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 relative rounded-full overflow-hidden shrink-0">
              {/* Use regular img tag for external URLs or configure next.config.js */}
              {profileImg.startsWith('http') ? (
                <img
                  src={profileImg}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = "/images/profile.svg";
                  }}
                />
              ) : (
                <Image
                  src={profileImg}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  priority
                  sizes="80px"
                />
              )}
              {isUpdatingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-sm">Uploading...</div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="heading-3 text-[#000000CC]">{name || "User Name"}</h1>
              <p className="text-[#00000066] body-2">{email || "user@example.com"}</p>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <PrimaryBtn
              variant="soft"
              label={isUpdatingImage ? "Uploading..." : "Change photo"}
              width="fit-content"
              imageSrc="/images/soft-arrow.svg"
              imagePosition="right"
              onClick={handleChangeImage}
              disabled={isUpdatingImage}
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="bg-white rounded-xl p-3 space-y-4">
          <div className="flex items-start justify-between w-full">
            <div className="">
              <h1 className="text-[#000000CC] heading-4 font-medium mb-2">
                Personal Information
              </h1>
              <p className="text-[#00000066] font-normal heading-5">
                Keep your personal information accurate and up to date.
              </p>
            </div>

            {!isEditing && (
              <button
                className="text-[#F87B1B] body-4 border-b border-[#F87B1B] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={startEditing}
                type="button"
              >
                Edit
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-8">
            {/* First Name Input */}
            <Input
              title="First Name"
              placeholder="Enter your first name"
              className="w-full"
              value={tempFirstName}
              disabled={!isEditing}
              onChange={(e) => setTempFirstName(e.target.value)}
            />

            {/* Last Name Input */}
            <Input
              title="Last Name"
              placeholder="Enter your last name (optional)"
              className="w-full"
              value={tempLastName}
              disabled={!isEditing}
              onChange={(e) => setTempLastName(e.target.value)}
            />

            {/* Email Input */}
            <Input
              title="Email"
              placeholder="Enter your email"
              className="w-full"
              value={tempEmail}
              disabled={!isEditing}
              onChange={(e) => setTempEmail(e.target.value)}
            />
          </div>
        </div>

        <div
          className="bg-white rounded-xl cursor-pointer p-3 space-y-4 hover:bg-gray-50 transition-colors"
          onClick={() => setIsLogoutModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsLogoutModalOpen(true);
            }
          }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="space-y-2">
              <h1 className="text-[#000000CC] heading-4 font-medium">Logout</h1>
              <p className="text-[#00000066] body-3 font-normal">
                End your current session securely. Logging out ensures your
                information stays private, especially on shared devices.
              </p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15.9299 11.4573L7.57045 3.4923C7.43097 3.35933 7.24565 3.28516 7.05295 3.28516C6.86024 3.28516 6.67493 3.35933 6.53545 3.4923L6.52645 3.5013C6.4586 3.56576 6.40457 3.64335 6.36765 3.72935C6.33073 3.81535 6.31169 3.90796 6.31169 4.00155C6.31169 4.09514 6.33073 4.18775 6.36765 4.27375C6.40457 4.35975 6.4586 4.43734 6.52645 4.5018L14.3984 12.0018L6.52645 19.4988C6.4586 19.5633 6.40457 19.6408 6.36765 19.7268C6.33073 19.8128 6.31169 19.9055 6.31169 19.999C6.31169 20.0926 6.33073 20.1852 6.36765 20.2712C6.40457 20.3572 6.4586 20.4348 6.52645 20.4993L6.53545 20.5083C6.67493 20.6413 6.86024 20.7154 7.05295 20.7154C7.24565 20.7154 7.43097 20.6413 7.57045 20.5083L15.9299 12.5433C16.0035 12.4733 16.062 12.389 16.102 12.2957C16.142 12.2023 16.1626 12.1018 16.1626 12.0003C16.1626 11.8988 16.142 11.7983 16.102 11.7049C16.062 11.6116 16.0035 11.5273 15.9299 11.4573Z"
                fill="black"
                fillOpacity="0.4"
              />
            </svg>
          </div>
        </div>

        {isEditing && (
          <div className="flex flex-col sm:flex-row items-end justify-end gap-3">
            <PrimaryBtn
              variant="soft"
              label="Go back"
              width="fit-content"
              imageSrc="/images/back-arrow.svg"
              imagePosition="left"
              onClick={cancelEditing}
              type="button"
              disabled={isUpdatingProfile}
            />

            <PrimaryBtn
              variant="filled"
              label={isUpdatingProfile ? "Saving..." : "Save changes"}
              width="fit-content"
              imageSrc="/images/filled-arrow.svg"
              imagePosition="right"
              onClick={saveChanges}
              type="button"
              disabled={isUpdatingProfile}
            />
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Are you sure you want to logout?"
        message="You'll be signed out of your account and need to log in again to continue."
        confirmText="Logout"
        cancelText="Go back"
      />
    </div>
  );
};

export default Profile;