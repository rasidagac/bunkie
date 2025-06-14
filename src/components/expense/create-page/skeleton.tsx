import { Skeleton } from "@ui/skeleton";

export function CreatePageSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-34 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
