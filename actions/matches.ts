"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MatchStatus } from "@prisma/client";

export async function getMatches(stageType?: string) {
  const where = stageType
    ? { stage: { type: stageType as never } }
    : {};

  const matches = await prisma.match.findMany({
    where,
    include: {
      homeTeam: true,
      awayTeam: true,
      stage: true,
    },
    orderBy: { scheduledAt: "asc" },
  });

  return { data: matches };
}

export async function getMatchWithPredictions(matchId: string) {
  const session = await auth();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: true,
      awayTeam: true,
      stage: true,
      predictions: {
        include: {
          user: {
            select: { id: true, name: true, image: true, username: true },
          },
        },
        orderBy: { points: "desc" },
      },
    },
  });

  if (!match) return { error: "Partido no encontrado" };

  // Only show predictions if match is locked
  const userPrediction = session?.user?.id
    ? match.predictions.find((p) => p.userId === session.user.id) || null
    : null;

  const showAllPredictions = match.isLocked;

  return {
    data: {
      ...match,
      userPrediction,
      predictions: showAllPredictions ? match.predictions : [],
    },
  };
}

export async function updateMatchResult(
  matchId: string,
  homeScore: number,
  awayScore: number
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Sin permisos" };
  }

  await prisma.match.update({
    where: { id: matchId },
    data: {
      homeScore,
      awayScore,
      status: MatchStatus.FINISHED,
      isLocked: true,
      lockedAt: new Date(),
    },
  });

  revalidatePath("/matches");
  revalidatePath("/admin/matches");

  return { message: "Resultado actualizado" };
}

export async function lockMatch(matchId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Sin permisos" };
  }

  await prisma.match.update({
    where: { id: matchId },
    data: { isLocked: true, lockedAt: new Date() },
  });

  revalidatePath("/matches");
  return { message: "Partido bloqueado" };
}
