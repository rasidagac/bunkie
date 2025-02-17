import JoinHouseForm from "@/components/house/join-house-form";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Separator } from "@ui/separator";
import { ChevronRight, Plus, Users } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return null;
  }

  const { data: groupsOfCurrentUser } = await supabase
    .from("group_users")
    .select("groups(*), profiles(*)")
    .eq("user_id", data.user.id);

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
      {groupsOfCurrentUser.map(({ groups, profiles }) => (
        <Link href={`/dashboard/groups/${groups?.code}`} key={groups?.id}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{groups?.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 pb-0">
              <Avatar
                key={profiles?.id}
                className="-mr-5 border-2 drop-shadow-sm"
              >
                <AvatarImage
                  src={profiles?.avatar_url as string}
                  alt={profiles?.username as string}
                />
                <AvatarFallback>{profiles?.username?.[0]}</AvatarFallback>
              </Avatar>
            </CardContent>
            <CardFooter className="justify-end text-sm">
              View House <ChevronRight />
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
