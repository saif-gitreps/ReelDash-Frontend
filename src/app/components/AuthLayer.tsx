import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AuthLayer({
   children,
   isProtected,
}: Readonly<{
   children: React.ReactNode;
   isProtected: boolean;
}>) {
   const { isAuthenticated } = useAuth();
   const router = useRouter();

   useEffect(() => {
      if (!isAuthenticated && isProtected) {
         router.replace("/login");
      }
      if (isAuthenticated && !isProtected) {
         router.replace("/feed");
      }
   }, [isAuthenticated, router, isProtected]);

   return <>{children}</>;
}
