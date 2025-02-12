import JoinHouseForm from "@/components/house/join-house-form";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@lib/prisma";
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
  const user = await currentUser();
  const houseOfCurrentUser = await prisma.house_users.findMany({
    where: {
      user_id: user?.id,
    },
    select: {
      houses: true,
    },
  });

  if (!houseOfCurrentUser.length) {
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

  const otherHouseUsers = (houseId: string) =>
    prisma.house_users.findMany({
      where: {
        house_id: houseId,
      },
      select: {
        users: true,
      },
    });

  return (
    <div>
      <h1 className="text-2xl">My Houses</h1>
      <Separator className="my-2 w-1/3" />
      {houseOfCurrentUser.map(async ({ houses }) => (
        <Link href={`/dashboard/houses/${houses?.code}`} key={houses?.id}>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{houses?.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 pb-0">
              {(await otherHouseUsers(houses?.id as string)).map(
                ({ users }) => (
                  <Avatar
                    key={users?.id}
                    className="-mr-5 border-2 drop-shadow-sm"
                  >
                    <AvatarImage
                      src={users?.avatar_url as string}
                      alt={users?.username as string}
                    />
                    <AvatarFallback>{users?.username?.[0]}</AvatarFallback>
                  </Avatar>
                ),
              )}
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
