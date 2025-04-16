"use client";

import { useCurrentUser } from "@/features/user/api/useCurrentUser";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function CurrentUserWrapper({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const { login } = useAuth();
   const { data: user } = useCurrentUser();

   useEffect(() => {
      if (user) {
         login(user.data, "");
      }
   }, [user, login]);

   return <>{children}</>;
}
