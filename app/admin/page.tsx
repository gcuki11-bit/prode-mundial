import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/features/admin/admin-dashboard";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const [userCount, matchCount, predictionCount, finishedMatches] = await Promise.all([
    prisma.user.count(),
    prisma.match.count(),
    prisma.prediction.count(),
    prisma.match.count({ where: { status: "FINISHED" } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const pendingMatches = await prisma.match.findMany({
    where: { status: { in: ["LIVE", "UPCOMING"] } },
    include: { homeTeam: true, awayTeam: true, stage: true },
    orderBy: { scheduledAt: "asc" },
    take: 5,
  });

  return (
    <AdminDashboard
      stats={{ userCount, matchCount, predictionCount, finishedMatches }}
      recentUsers={recentUsers}
      pendingMatches={pendingMatches}
    />
  );
}
