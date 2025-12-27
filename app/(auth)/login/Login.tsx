"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Input from "../../ui/Input";
import PrimaryBtn from "@/app/ui/buttons/PrimaryBtn";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((p) => ({ ...p, [e.target.name]: true }));
  };

 

  const validate = () => {
    const err = { email: "", password: "" };
    if (!formData.email.trim()) err.email = "Email is required";
    if (!formData.password) err.password = "Password is required";
    setErrors(err);
    return !err.email && !err.password;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

    const handleKeyDown = (e:React.KeyboardEvent)=>{
      if (e.key === 'Enter') {
        handleLogin()
      }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F9FAFB] to-[#EEF2FF] px-4">
      
      {/* Card with gradient border */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-[620px] rounded-2xl bg-gradient-to-br from-indigo-200/60 via-purple-200/40 to-blue-200/60 p-[1px]"
      >
        {/* Inner surface */}
        <div className="rounded-2xl bg-white px-10 py-14 shadow-sm">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-1 font-semibold  mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-8">
            {/* Email */}
            <div className="flex flex-col">
              <Input
                title="Email"
                name="email"
                type="email"
                placeholder="you@company.com"
                 onKeyDown={handleKeyDown}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="
                  w-full
                  transition
                  
                "
              />

              <AnimatePresence>
                {touched.email && errors.email && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-red-500 mt-1"
                  >
                    {errors.email}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <Input
                title="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="
                  w-full
                  transition
                "
              />

              <AnimatePresence>
                {touched.password && errors.password && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-red-500 mt-1"
                  >
                    {errors.password}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="mt-6"
            >
              <PrimaryBtn
                variant="filled"
                width="100%"
                imageSrc="/images/filled-arrow.svg"
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
