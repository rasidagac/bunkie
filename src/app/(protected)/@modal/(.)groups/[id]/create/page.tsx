import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { CreatePageDrawer } from "@/components/expense/create-page";

export default async function CreateExpenseModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: groupId } = await params;
  const user = await getCurrentUser();

  return <CreatePageDrawer groupId={groupId} userId={user.id} />;
}
