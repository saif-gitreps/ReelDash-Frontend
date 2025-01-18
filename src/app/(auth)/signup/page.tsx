"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { toast } from "react-hot-toast";
import { useRegisterUser } from "@/hooks/api/users/useRegister";
import { useLoginUser } from "@/hooks/api/users/useLogin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AuthLayer from "@/app/components/AuthLayer";

interface SignUpFormInputs {
   fullname: string;
   username: string;
   email: string;
   password: string;
   avatar: FileList;
   coverImage?: FileList;
}

export default function SignUp() {
   const { register, handleSubmit } = useForm<SignUpFormInputs>();
   const { mutate: registerUser, isPending } = useRegisterUser();
   const { mutate: loginUser } = useLoginUser();
   const router = useRouter();
   const { login } = useAuth();

   const onSubmit = (data: SignUpFormInputs) => {
      const formData = {
         ...data,
         avatar: data.avatar[0],
         coverImage: data.coverImage?.[0],
      };

      registerUser(formData, {
         onSuccess: (response) => {
            toast.success(response.message);
            loginUser({ email: formData.email, password: formData.password });

            login(response.data, "");

            router.push("/feed");
         },
         onError: (error) => {
            toast.error(`Sign up failed. ${error.message}`);
         },
      });
   };

   return (
      <AuthLayer isProtected={false}>
         <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
               <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
               <div>
                  Have an account?{" "}
                  <Link href="/login" className="text-blue-500">
                     Login
                  </Link>
               </div>
               <div>
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                     id="fullname"
                     type="text"
                     {...register("fullname", { required: "Full name is required" })}
                  />
               </div>
               <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                     id="username"
                     type="text"
                     {...register("username", { required: "Username is required" })}
                  />
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
               <div>
                  <Label htmlFor="avatar">Avatar</Label>
                  <Input
                     id="avatar"
                     type="file"
                     {...register("avatar", { required: "Avatar is required" })}
                  />
               </div>
               <div>
                  <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                  <Input id="coverImage" type="file" {...register("coverImage")} />
               </div>
               <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Signing up..." : "Sign Up"}
               </Button>

               <Link href="/home" className="mt-10 block text-center">
                  Scroll reels
               </Link>
            </form>
         </div>
      </AuthLayer>
   );
}
