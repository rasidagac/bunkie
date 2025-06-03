import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Separator } from "@ui/separator";
import { Plus, Users } from "lucide-react";
import Link from "next/link";

import { GroupCards } from "@/components/features/group/group-cards";
import JoinHouseForm from "@/components/features/group/join-house-form";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: groups } = await supabase
    .from("memberships")
    .select(
      `
      groups:groups(*),
      all_users:groups(
      memberships(
        profiles(*)
      )
    )
  `,
    )
    .eq("user_id", user!.id);

  function renderGroups() {
    if (!groups?.length) {
      return (
        <div className="flex flex-col items-center rounded-lg border-2 border-dashed p-6">
          <h1 className="text-xl font-bold">No Group</h1>
          <Separator className="my-2 w-1/3" />
          <p className="text-sm">You are not a member of any group.</p>
          <p className="text-sm">
            Join a group or create a new one to get started.
          </p>
        </div>
      );
    } else {
      return <GroupCards groupsData={groups} />;
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Groups</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/create">
            <Button size="sm" variant="outline" className="rounded-full">
              <Plus /> Create
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-full">
                <Users /> Join
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm rounded-md">
              <DialogHeader>
                <DialogTitle>Join a house</DialogTitle>
                <DialogDescription>
                  To join a house, you need the house code.
                </DialogDescription>
              </DialogHeader>
              <JoinHouseForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator className="my-2 w-1/3" />
      {renderGroups()}
    </div>
  );
}
