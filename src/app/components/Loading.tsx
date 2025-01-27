export default function Loading() {
   return (
      <div className="flex h-full w-full items-center justify-center bg-black text-white">
         <div className="text-center">
            <div className="text-xl font-semibold mb-2">
               Loading <span className="animate-ping text-bold text-4xl">...</span>
            </div>
         </div>
      </div>
   );
}
