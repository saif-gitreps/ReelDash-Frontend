"use client";

import { usePathname } from "next/navigation";

export default function RootWrapper({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const pathname = usePathname();

   return (
      <main className={`flex-grow ${pathname === "/" ? "" : "pl-12 md:pl-32"}`}>
         {children}
      </main>
   );
}
