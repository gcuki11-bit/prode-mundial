import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminMatchesView } from "@/components/features/admin/admin-matches-view";

export default async function AdminMatchesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true, stage: true },
    orderBy: { scheduledAt: "asc" },
  });

  return <AdminMatchesView matches={matches} />;
}
