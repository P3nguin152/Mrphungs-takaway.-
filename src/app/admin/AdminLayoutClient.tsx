"use client";

import { usePathname } from "next/navigation";
import AuthGate from "@/components/AuthGate";
import AdminNav from "@/components/AdminNav";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    // Render login page without header/nav and without AuthGate
    return <>{children}</>;
  }

  // Protected admin shell
  return (
    <AuthGate>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <LogoutButton />
              </div>
            </div>
            <AdminNav />
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">{children}</div>
          </div>
        </main>
      </div>
    </AuthGate>
  );
}
