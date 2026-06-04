import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RankingView } from "@/components/features/rankings/ranking-view";

export default async function RankingPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const users = await prisma.user.findMany({
    where: { isActive: true, totalPicks: { gt: 0 } },
    orderBy: [{ totalPoints: "desc" }, { exactPicks: "desc" }],
    include: { favoriteTeam: true },
  });

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return <RankingView users={users} currentUserId={session.user.id} currentUser={currentUser} />;
}
