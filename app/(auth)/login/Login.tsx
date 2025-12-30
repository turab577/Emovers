"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Input from "../../ui/Input";
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
import { useRouter } from "next/navigation";
import { authApi } from "@/app/api/auth";
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
    setLoading(true);
    console.log('Login button clicked with data:', formData);

    try {
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      console.log('Calling authApi.login...');
      
      // Make the API call with timeout
      const response = await Promise.race([
        authApi.login({
          email: formData.email,
          password: formData.password,
        }),
        timeoutPromise
      ]);
      
      console.log('API Response received:', response);

      // For now, just check if we got a response
      if (response) {
        console.log('API call successful, response:', response);
        toast.success('API hit successfully! Check console for response.');
        
        // TODO: Handle the actual response data once API works
        // For now, just redirect to test
        router.push("/");
      }
      
    } catch (error: any) {
      console.error('Login error details:', {
        error,
        message: error?.message,
        stack: error?.stack,
        type: typeof error
      });
      
      // More detailed error logging
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error - Check CORS or API endpoint URL');
        toast.error('Network error - Check API connection');
      } else if (error.message === 'Request timeout') {
        console.error('Request timed out - API not responding');
        toast.error('Request timed out - API might be down');
      } else {
        console.error('Other error:', error);
        toast.error(error?.message || "Something went wrong");
      }
    } finally {
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