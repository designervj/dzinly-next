import React from "react";
// 👇 CHECK THIS PATH: Make sure it points to where you saved theme-provider.tsx
import { AdminThemeProvider } from "@/components/admin/ThemeProvider";
import { AppShell } from "@/components/admin/AppShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
       <AppShell 
          // You might need to pass props here or rely on Redux/Context inside AppShell
          user={null} 
          websites={[]} 
       >
          {children}
       </AppShell>
    </AdminThemeProvider>
  );
}