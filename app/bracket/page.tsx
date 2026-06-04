import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BracketView } from "@/components/features/bracket/bracket-view";

export default async function BracketPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const matches = await prisma.match.findMany({
    where: {
      stage: {
        type: { in: ["ROUND_OF_16", "QUARTER_FINAL", "SEMI_FINAL", "THIRD_PLACE", "FINAL"] },
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      stage: true,
    },
    orderBy: [{ stage: { order: "asc" } }, { matchNumber: "asc" }],
  });

  return <BracketView matches={matches} />;
}
