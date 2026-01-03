import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./ui/typography.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emovers",
  description:
    "Emovers admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
           <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#ffffff',
          color: '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: 500,
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
          style: {
            borderLeft: '4px solid #10b981',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
          style: {
            borderLeft: '4px solid #ef4444',
          },
        },
        loading: {
          duration: Infinity,
          style: {
            borderLeft: '4px solid #6366f1',
          },
        },
      }}
    />
        <ClientLayout>
          {children}
          </ClientLayout>
      </body>
    </html>
  );
}
