import { getById } from "@/actions/groups/getById";
import { GroupContextProvider } from "@/components/features/group/group-context-provider";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface GroupLayoutProps {
  children: ReactNode;
  params: {
    id: string;
  };
}

export default async function GroupLayout({
  children,
  params,
}: GroupLayoutProps) {
  const { data: group, error } = await getById(params.id);

  if (error || !group) {
    notFound();
  }

  return (
    <GroupContextProvider groupId={group.id}>{children}</GroupContextProvider>
  );
}
