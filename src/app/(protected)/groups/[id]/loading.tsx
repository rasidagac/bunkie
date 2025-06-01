import { Skeleton } from "@ui/skeleton";
import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <Skeleton className="flex h-full items-center justify-center">
      <LoaderIcon className="h-8 w-8 animate-spin text-gray-500" />
    </Skeleton>
  );
}
