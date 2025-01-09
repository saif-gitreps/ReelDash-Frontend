"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Implement API call for login
      console.log("Login with:", { email, password });
   };

   return (
      <div className="flex min-h-screen items-center justify-center">
         <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <div>
               Do not have an account?{" "}
               <Link href="/signup" className="text-blue-500">
                  Signup
               </Link>
            </div>
            <div>
               <Label htmlFor="email">Email</Label>
               <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
               />
            </div>
            <div>
               <Label htmlFor="password">Password</Label>
               <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
            </div>
            <Button type="submit" className="w-full">
               Login
            </Button>

            <Link href="/home" className="mt-10 block text-center">
               Scroll reels
            </Link>
         </form>
      </div>
   );
}
