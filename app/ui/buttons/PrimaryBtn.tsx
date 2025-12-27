"use client";
import React from "react";

type Variant = "filled" | "outlined" | "soft";

interface PrimaryBtnProps {
  variant?: Variant;
  width?: string | number;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  imageSrc?: string;
  imagePosition?: "left" | "right";
  imageSize?: number;
  color?: string; // ✅ background color for outlined button
  type?: "button" | "submit";
}

const PrimaryBtn: React.FC<PrimaryBtnProps> = ({
  variant = "filled",
  width = "100%",
  label = "Primary Button",
  onClick,
  disabled = false,
  imageSrc,
  imagePosition = "left",
  imageSize = 20,
  color, // ✅ optional background for outlined
  type = "button",
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      textTransform: "none",
      boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.12)",
      fontWeight: 400,
      borderRadius: "100px",
      padding: "12px 20px",
      fontSize: "0.9rem",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      width,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    };

    switch (variant) {
      case "filled":
        return {
          ...base,
          backgroundColor: "#11224E",
          color: "#FFFFFF",
          border: "none",
        };
      case "outlined":
        return {
          ...base,
          backgroundColor: color || "transparent", // ✅ dynamic background color
          color: "#11224E",
          border: "1px solid #11224E",
        };
      case "soft":
        return {
          ...base,
          backgroundColor: "#11224E1F",
          color: "#11224E",
          border: "none",
        };
      default:
        return base;
    }
  };

  return (
    <button
      type={type}
      style={getStyles()}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {imageSrc && imagePosition === "left" && (
        <img
          src={imageSrc}
          alt="icon"
          style={{ width: imageSize, height: imageSize }}
        />
      )}
      {label}
      {imageSrc && imagePosition === "right" && (
        <img
          src={imageSrc}
          alt="icon"
          style={{ width: imageSize, height: imageSize }}
        />
      )}
    </button>
  );
};

export default PrimaryBtn;
