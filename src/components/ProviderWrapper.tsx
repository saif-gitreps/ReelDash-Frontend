"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import CurrentUserWrapper from "./CurrentUserWrapper";

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
