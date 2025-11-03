import React from "react";

export default function ErrorMessage({ children }: { children: React.ReactNode }) {
   return (
      <div className="flex flex-col justify-center items-center mt-20">
         <div className="text-muted text-base mt-4 text-red-400">{children}</div>
      </div>
   );
}
