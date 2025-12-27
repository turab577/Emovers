"use client";

import React from "react";

type StatusVariant = "green" | "orange" | "blue";

interface StatusPillsProps {
  label: string;
  variant?: StatusVariant;
}

const StatusPills: React.FC<StatusPillsProps> = ({ label, variant = "green" }) => {
  const variantColors: Record<StatusVariant, { bg: string; text: string }> = {
    green: { bg: "#F6F6F6", text: "#0CD767" },
    orange: { bg: "#F6F6F6", text: "#E28413" },
    blue: { bg: "#F6F6F6", text: "#11224E" },
  };

  const colors = variantColors[variant];

  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
      className="rounded-4xl py-1.5 px-2 heading-7 font-normal flex items-center gap-2"
    >
      {label}
    </span>
  );
};

export default StatusPills;
