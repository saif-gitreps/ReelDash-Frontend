import { Loader2 } from "lucide-react";

export default function Loader({ children }: { children?: string }) {
   return (
      <div className="flex h-full w-full flex-col justify-center items-center">
         <Loader2 className="size-14 animate-spin stroke-white" />
         <div className="text-muted text-base mt-4 text-white">{children}</div>
      </div>
   );
}
