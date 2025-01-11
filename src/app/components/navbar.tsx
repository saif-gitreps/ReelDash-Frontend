"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, Film, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
   const pathname = usePathname();
   const router = useRouter();

   // Hide navbar on the landing page
   if (pathname === "/") return null;

   const handleLogout = () => {
      // TODO: Implement logout logic here
      console.log("Logging out...");
      router.push("/");
   };

   return (
      <nav className="fixed left-0 top-0 h-full w-12 md:w-32 bg-secondary border-r border-border flex flex-col items-center md:items-start py-4 z-50">
         <Link
            href="/home"
            className={`flex items-center gap-2 p-2 md:px-3 w-full ${
               pathname === "/home" ? "yellow-accent" : "text-muted-foreground"
            }`}
         >
            <Home className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden md:inline">Home</span>
         </Link>
         <Link
            href="/feed"
            className={`flex items-center gap-2 p-2 md:px-3 w-full ${
               pathname === "/feed" ? "yellow-accent" : "text-muted-foreground"
            }`}
         >
            <Film className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden md:inline">Feed</span>
         </Link>
         <Link
            href="/updates"
            className={`flex items-center gap-2 p-2 md:px-3 w-full ${
               pathname === "/updates" ? "yellow-accent" : "text-muted-foreground"
            }`}
         >
            <Bell className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden md:inline">Updates</span>
         </Link>
         <Link
            href="/profile/user1"
            className={`flex items-center gap-2 p-2 md:px-3 w-full ${
               pathname.startsWith("/profile") ? "yellow-accent" : "text-muted-foreground"
            }`}
         >
            <User className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden md:inline">Profile</span>
         </Link>
         <div className="mt-auto w-full px-2 md:px-3">
            <Button
               variant="ghost"
               className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
               onClick={handleLogout}
            >
               <LogOut className="h-5 w-5 md:h-6 md:w-6 md:mr-2" />
               <span className="hidden md:inline">Logout</span>
            </Button>
         </div>
      </nav>
   );
}
