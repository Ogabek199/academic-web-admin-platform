"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#0f172a",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          fontWeight: "600",
          fontSize: "14px",
          border: "1px solid #e2e8f0",
        },
        success: {
          iconTheme: {
            primary: "#2563eb",
            secondary: "#fff",
          },
        },
        error: {
          style: {
            background: "#fffafb",
            borderColor: "#fee2e2",
            color: "#991b1b",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
