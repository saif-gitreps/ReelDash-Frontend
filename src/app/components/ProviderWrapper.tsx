"use client";

import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CurrentUserWrapper from "./CurrentUserWrapper";
import Navbar from "./Navbar";

export default function ProviderWrapper({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const pathname = usePathname();
   const queryClient = new QueryClient({
      defaultOptions: {
         queries: {
            retry: 1,
            refetchOnWindowFocus: false,
         },
      },
   });

   return (
      <QueryClientProvider client={queryClient}>
         <Navbar />
         <main
            className={`flex-grow ${
               pathname === "/" || pathname == "/signup" || pathname === "/login"
                  ? ""
                  : "pl-12 md:pl-32"
            }`}
         >
            <CurrentUserWrapper>{children}</CurrentUserWrapper>
         </main>
      </QueryClientProvider>
   );
}
