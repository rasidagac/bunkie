import { GroupCards } from "@/components/features/group/group-cards";
import JoinHouseForm from "@/components/features/group/join-house-form";
import { currentUser } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";
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

export default async function DashboardPage() {
  const { user } = await currentUser();
  const supabase = await createClient();

  const { data: groupsOfCurrentUser } = await supabase
    .from("group_users")
    .select(
      `
      groups:groups(*),
      all_users:groups(
      group_users(
        profiles(*)
      )
    )
  `,
    )
    .eq("user_id", user!.id);

  if (!groupsOfCurrentUser?.length) {
    return (
      <div className="flex flex-col items-center rounded-lg border-2 border-dashed p-6">
        <h1 className="text-xl font-bold">No House</h1>
        <Separator className="my-2 w-1/3" />
        <p className="text-sm">You are not a member of any houses.</p>
        <p className="text-sm">
          Join a house or create a new one to get started.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Link href="/dashboard/create">
            <Button>
              <Plus /> Create
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
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
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Houses</h1>
      <Separator className="my-2 w-1/3" />
      <GroupCards groupsData={groupsOfCurrentUser} />
    </div>
  );
}
