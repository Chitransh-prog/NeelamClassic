import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Toaster } from "sonner";

export const metadata = {
  title: "Admin Panel | Neelam Classic Salon & Academy",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminShell>{children}</AdminShell>
      <Toaster position="top-right" richColors />
    </>
  );
}
