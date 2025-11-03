"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { toast } from "react-hot-toast"; // Assuming you use react-hot-toast for notifications
import { useLoginUser } from "@/features/user/api/useLogin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthLayer from "@/components/AuthLayer";
import GuestLoginButton from "@/features/guest-login/components/GuestLoginButton";

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
            login(response.data.user);
            router.push("/feed");
         },
         onError: (error) => {
            toast.error(`Login failed. ${error.message}`);
         },
      });
   };

   return (
      <AuthLayer isProtected={false}>
         <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
               <h1 className="text-2xl font-bold mb-3">Login</h1>
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

               <Link href="/feed" className="mt-10 block text-center">
                  Watch videos
               </Link>

               <div className="flex justify-center">
                  <GuestLoginButton />
               </div>
            </form>
         </div>
      </AuthLayer>
   );
}
