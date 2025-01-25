"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Film, Bell, LogOut, Subtitles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutUser } from "@/hooks/api/users/useLogout";

export default function Navbar() {
   const pathname = usePathname();
   const { isAuthenticated, user, logout } = useAuth();
   const { mutate: logoutUser } = useLogoutUser();

   if (pathname === "/" || pathname === "/signup" || pathname === "/login") return null;

   const handleLogout = () => {
      logoutUser();
      logout();
   };

   return (
      <nav className="fixed left-0 top-0 h-full w-12 md:w-32 bg-secondary border-r border-border flex flex-col items-center md:items-start py-4 z-50">
         <Link
            href="/home"
            className={`flex items-center justify-center md:justify-start gap-2 p-2 md:px-3 w-full ${
               pathname === "/home" ? "yellow-accent" : "text-muted-foreground"
            }`}
         >
            <Home className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden md:inline">Home</span>
         </Link>
         <Link
            href="/feed"
            className={`flex items-center justify-center md:justify-start gap-2 p-2 md:px-3 w-full ${
               pathname === "/feed" ? "yellow-accent" : "text-muted-foreground"
            }`}
         >
            <Film className="h-5 w-5 md:h-6 md:w-6" />
            <span className="hidden md:inline">Feed</span>
         </Link>

         {isAuthenticated && (
            <Link
               href="/subscriptions"
               className={`flex items-center justify-center md:justify-start gap-2 p-2 md:px-3 w-full ${
                  pathname === "/subscriptions"
                     ? "yellow-accent"
                     : "text-muted-foreground"
               }`}
            >
               <Subtitles className="h-5 w-5 md:h-6 md:w-6" />
               <span className="hidden md:inline">Subbed</span>
            </Link>
         )}

         {!isAuthenticated && (
            <Link
               href="/login"
               className={`flex items-center justify-center md:justify-start gap-2 p-2 md:px-3 w-full ${
                  pathname === "/login" ? "yellow-accent" : "text-muted-foreground"
               }`}
            >
               <User className="h-5 w-5 md:h-6 md:w-6" />
               <span className="hidden md:inline">Login</span>
            </Link>
         )}

         {isAuthenticated && (
            <Link
               href="/updates"
               className={`flex items-center justify-center md:justify-start gap-2 p-2 md:px-3 w-full ${
                  pathname === "/updates" ? "yellow-accent" : "text-muted-foreground"
               }`}
            >
               <Bell className="h-5 w-5 md:h-6 md:w-6" />
               <span className="hidden md:inline">Updates</span>
            </Link>
         )}

         {isAuthenticated && (
            <Link
               href={`/profile/${user?.username}`}
               className={`flex items-center justify-center md:justify-start gap-2 p-2 md:px-3 w-full ${
                  pathname.startsWith("/profile")
                     ? "yellow-accent"
                     : "text-muted-foreground"
               }`}
            >
               <User className="h-5 w-5 md:h-6 md:w-6" />
               <span className="hidden md:inline">Profile</span>
            </Link>
         )}

         {isAuthenticated && (
            <div className="mt-auto items-center gap-2 w-p-2 md:px-3 w-full">
               <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-primary hover:bg-red-700"
                  onClick={handleLogout}
               >
                  <LogOut className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="hidden md:inline">Logout</span>
               </Button>
            </div>
         )}
      </nav>
   );
}
