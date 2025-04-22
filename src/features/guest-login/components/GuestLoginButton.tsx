"use client";

import { Button } from "@/components/ui/button";
import { useLoginUser } from "@/features/user/api/useLogin";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function GuestLoginButton() {
   const { mutate: loginUser, isPending } = useLoginUser();
   const { login } = useAuth();
   const router = useRouter();

   const onClick = (data: { email: string; password: string }) => {
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
      <Button
         variant="link"
         disabled={isPending}
         onClick={() =>
            onClick({
               email: "test@test.com",
               password: "1234567",
            })
         }
      >
         {isPending ? "Logging in..." : "Login as a guest"}
      </Button>
   );
}

export default GuestLoginButton;
