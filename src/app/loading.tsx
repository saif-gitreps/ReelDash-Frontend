import { Loader2 } from "lucide-react";

export default function Loading() {
   return (
      <div className="flex flex-col justify-center items-center mt-20">
         <Loader2 className="size-20 animate-spin stroke-white" />
         <div className="text-muted text-base mt-4 text-white">
            Please wait, server might be starting cold
         </div>
      </div>
   );
}
