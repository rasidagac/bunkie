import Link from "next/link";

export default function GroupNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Group Not Found</h2>
        <p className="text-muted-foreground">
          We couldn&apos;t find the group you&apos;re looking for. It may have
          been deleted or you might not have access to it.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Link
          className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
          href="/groups"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
