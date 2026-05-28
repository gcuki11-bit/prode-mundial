import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PredictionsView } from "@/components/features/predictions/predictions-view";

export default async function PredictionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const matches = await prisma.match.findMany({
    where: { status: { in: ["UPCOMING", "LIVE"] } },
    include: {
      homeTeam: true,
      awayTeam: true,
      stage: true,
      predictions: {
        where: { userId: session.user.id },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return <PredictionsView matches={matches} userId={session.user.id} />;
}
