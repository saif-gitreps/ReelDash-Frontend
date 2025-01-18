"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { toast } from "react-hot-toast"; // Assuming you use react-hot-toast for notifications
import { useLoginUser } from "@/hooks/api/users/useLogin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormInputs {
   email: string;
   password: string;
}

export default function Login() {
   const { register, handleSubmit } = useForm<LoginFormInputs>();
   const { mutate: loginUser, isPending } = useLoginUser();
   const { login } = useAuth();
   const router = useRouter();

   const onSubmit = (data: LoginFormInputs) => {
      loginUser(data, {
         onSuccess: (response) => {
            toast.success(response.message);
            login(response.data.user, response.data.accessToken);
            router.push("/feed");
         },
         onError: (error) => {
            toast.error(`Login failed. ${error.message}`);
         },
      });
   };

   return (
      <div className="flex min-h-screen items-center justify-center">
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
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
                  {...register("email", { required: "Email is required" })}
               />
            </div>
            <div>
               <Label htmlFor="password">Password</Label>
               <Input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required" })}
               />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
               {isPending ? "Logging in..." : "Login"}
            </Button>

            <Link href="/home" className="mt-10 block text-center">
               Scroll reels
            </Link>
         </form>
      </div>
   );
}
