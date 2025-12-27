"use client";
import React from "react";

type Variant = "filled" | "outlined" | "soft";

interface SecondaryBtnProps {
  variant?: Variant;
  width?: string | number;
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  imageSrc?: string; // ✅ optional image
  imagePosition?: "left" | "right"; // ✅ image placement
  imageSize?: number; // ✅ control image size
}

const SecondaryBtn: React.FC<SecondaryBtnProps> = ({
  variant = "filled",
  width = "100%",
  label = "Secondary Button",
  onClick,
  disabled = false,
  imageSrc,
  imagePosition = "left",
  imageSize = 20,
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
      transition:
        "background-color 0.15s ease, color 0.15s ease, border 0.15s ease",
      width,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px", // space between text and image
    };

    switch (variant) {
      case "filled":
        return {
          ...base,
          backgroundColor: "#F87B1B",
          color: "#FFFFFF",
          border: "none",
        };
      case "outlined":
        return {
          ...base,
          backgroundColor: "#FFFFFF",
          color: "#F87B1B",
          border: "1px solid #F87B1B",
        };
      case "soft":
        return {
          ...base,
          backgroundColor: "#F87B1B1F",
          color: "#F87B1B",
          border: "none",
        };
      default:
        return base;
    }
  };

  return (
    <button
      type="button"
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

export default SecondaryBtn;
