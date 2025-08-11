"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    // Allow the login page to render without checks
    if (pathname === "/admin/login") {
      setOk(true);
      return;
    }
    try {
      const auth = typeof window !== "undefined" ? localStorage.getItem("isAuthenticated") : null;
      if (auth === "true") {
        setOk(true);
      } else {
        setOk(false);
        router.replace("/admin/login");
      }
    } catch {
      setOk(false);
      router.replace("/admin/login");
    }
  }, [router, pathname]);

  if (ok !== true) return null;
  return <>{children}</>;
}
