"use client";

import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootWrapper({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const pathname = usePathname();
   const queryClient = new QueryClient();

   return (
      <QueryClientProvider client={queryClient}>
         <main
            className={`flex-grow ${
               pathname === "/" || pathname == "/signup" || pathname === "/login"
                  ? ""
                  : "pl-12 md:pl-32"
            }`}
         >
            {children}
         </main>
      </QueryClientProvider>
   );
}
