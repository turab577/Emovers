"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Input from "../../ui/Input";
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/api/auth";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    console.log('=== LOGIN START ===');
    console.log('Form data:', formData);

    try {
      console.log('Calling authApi.login...');
      
      const response: any = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      
      console.log('=== RESPONSE RECEIVED ===');
      console.log('Full response:', response);

      // FIXED: Check for both success formats
      // Your API returns: { status: "success", message, accessToken, refreshToken, user }
      const isSuccess = response?.success === true || response?.status === "success";

      if (isSuccess) {
        // Access token directly from response (not in data field)
        const token = response?.accessToken || response?.data?.accessToken;
        
        if (token) {
          // Store token in cookie
          Cookies.set('accessToken', token, { 
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
          
          console.log('Token stored in cookie');
          toast.success(response.message || "Login successful");
          
          // Small delay to ensure cookie is set
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 100);
        } else {
          console.error('No token in response');
          toast.error("Login failed - no token received");
          setLoading(false);
        }
      } else {
        console.log('=== LOGIN FAILED ===');
        toast.error(response?.message || "Login failed");
        setLoading(false);
      }
       
    } catch (error: any) {
      console.log('=== ERROR CAUGHT ===');
      console.log('Error:', error);
      
      // Your API error format: { message, error, statusCode }
      if (error?.message) {
        toast.error(error.message);
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F9FAFB] to-[#EEF2FF] px-4">
      
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[620px] rounded-2xl bg-gradient-to-br from-indigo-200/60 via-purple-200/40 to-blue-200/60 p-[1px]"
      >
        <div className="rounded-2xl bg-white px-10 py-14 shadow-sm">
          
          <div className="text-center mb-12">
            <h1 className="heading-1 font-semibold mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Sign in to continue to your dashboard
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <Input
              title="Email"
              name="email"
              type="email"
              placeholder="you@company.com"
              onKeyDown={handleKeyDown}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full transition"
            />

            <Input
              title="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="w-full transition"
            />

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="mt-6"
            >
              <PrimaryBtn
                variant="filled"
                width="100%"
                imageSrc={loading ? "" : "/images/filled-arrow.svg"}
                imagePosition="right"
                label={loading ? "Signing in…" : "Login"}
                onClick={handleLogin}
                disabled={loading}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;