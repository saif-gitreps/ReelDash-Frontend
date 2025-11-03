"use client";

import { Button } from "@/components/ui/button";
import { useLoginUser } from "@/features/user/api/useLogin";
import { useAuth } from "@/hooks/useAuth";
import { KeyRound } from "lucide-react";
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
            login(response.data.user);
            router.push("/feed");
         },
         onError: (error) => {
            toast.error(`Login failed. ${error.message}`);
         },
      });
   };

   return (
      <Button
         variant="secondary"
         disabled={isPending}
         onClick={() =>
            onClick({
               email: "guest_reeldash@gmail.com",
               password: "123456",
            })
         }
      >
         {isPending ? (
            "Logging in..."
         ) : (
            <>
               Login as a guest <KeyRound />{" "}
            </>
         )}
      </Button>
   );
}

export default GuestLoginButton;
