import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardView } from "@/components/features/dashboard/dashboard-view";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const [upcomingMatches, userPredictions, rankings] = await Promise.all([
    prisma.match.findMany({
      where: { status: "UPCOMING" },
      include: { homeTeam: true, awayTeam: true, stage: true },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),
    prisma.prediction.findMany({
      where: { userId: session.user.id },
      include: {
        match: {
          include: { homeTeam: true, awayTeam: true, stage: true },
        },
      },
      orderBy: { match: { scheduledAt: "desc" } },
      take: 5,
    }),
    prisma.user.findMany({
      where: { isActive: true },
      orderBy: { totalPoints: "desc" },
      take: 5,
      select: {
        id: true, name: true, image: true, username: true,
        totalPoints: true, exactPicks: true, correctPicks: true, totalPicks: true,
      },
    }),
  ]);

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <DashboardView
      user={currentUser}
      upcomingMatches={upcomingMatches}
      recentPredictions={userPredictions}
      topRankings={rankings}
    />
  );
}
