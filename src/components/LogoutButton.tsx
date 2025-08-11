"use client";

import { useRouter, usePathname } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  const onClick = () => {
    try {
      localStorage.removeItem("isAuthenticated");
      // Fallback: clear any residual keys that may gate auth
      localStorage.removeItem("token");
      localStorage.removeItem("session");
      localStorage.removeItem("auth");
      // As a last resort, clear all localStorage (safe here as app stores minimal state)
      localStorage.clear();
    } catch (e) {
      // ignore
    }
    // Force a hard navigation to reset all client state
    if (typeof window !== "undefined") {
      // Use replace so going back doesn't return to the authed view
      window.location.replace("/admin/login");
    } else {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Logout
    </button>
  );
}
