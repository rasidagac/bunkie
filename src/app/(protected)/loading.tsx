// import { Separator } from "@ui/separator";
// import { Skeleton } from "@ui/skeleton";
//
// export default function Loading() {
//   return (
//     <div className="flex flex-col space-y-3">
//       <div className="space-y-2">
//         <Skeleton className="h-4 w-1/3 rounded-xl" />
//         <Skeleton className="h-3 w-1/5 rounded-xl" />
//       </div>
//       <div className="flex gap-2">
//         <Skeleton className="h-8 w-16" />
//         <Skeleton className="h-8 w-16" />
//         <Skeleton className="h-8 w-16" />
//       </div>
//       <Separator />
//       {Array.from({ length: 5 }).map((_, index) => (
//         <div
//           key={index}
//           className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2.5 py-2"
//         >
//           <Skeleton className="h-full w-6 rounded-none" />
//           <Skeleton className="h-6 w-6" />
//           <div className="flex flex-col gap-1">
//             <Skeleton className="h-4" />
//             <Skeleton className="h-3 w-10/12" />
//           </div>
//           <div className="flex w-6 flex-col gap-1">
//             <Skeleton className="h-4" />
//             <Skeleton className="h-3" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import { Skeleton } from "@ui/skeleton";
import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <Skeleton className="flex h-full items-center justify-center">
      <LoaderIcon className="h-8 w-8 animate-spin text-gray-500" />
    </Skeleton>
  );
}
