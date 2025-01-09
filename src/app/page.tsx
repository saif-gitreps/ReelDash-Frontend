import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";

export default function Home() {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
         <h1 className="text-4xl font-bold mb-8">Welcome to Short Video App</h1>
         <div className="flex space-x-4">
            <Link href="/login">
               <Button className="yellow-accent-bg">Login</Button>
            </Link>
            <Link href="/signup">
               <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
               >
                  Sign Up
               </Button>
            </Link>
            <Link href="/feed">
               <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center gap-2"
               >
                  <Film className="w-4 h-4" />
                  Explore Feed
               </Button>
            </Link>
         </div>
         <Link href="/home" className="mt-4">
            <Button variant="link" className="yellow-accent">
               Go to Home Feed
            </Button>
         </Link>
      </div>
   );
}
