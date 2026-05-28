"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const predictionSchema = z.object({
  matchId: z.string().min(1),
  homeScore: z.number().int().min(0).max(20),
  awayScore: z.number().int().min(0).max(20),
});

export async function upsertPrediction(data: {
  matchId: string;
  homeScore: number;
  awayScore: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  const validated = predictionSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Datos inválidos" };
  }

  const { matchId, homeScore, awayScore } = validated.data;

  // Check if match is locked
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: { isLocked: true, scheduledAt: true, status: true },
  });

  if (!match) return { error: "Partido no encontrado" };
  if (match.isLocked || match.status !== "UPCOMING") {
    return { error: "Los picks para este partido están cerrados" };
  }

  const now = new Date();
  if (match.scheduledAt <= now) {
    return { error: "El partido ya comenzó" };
  }

  try {
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_matchId: {
          userId: session.user.id,
          matchId,
        },
      },
      create: {
        userId: session.user.id,
        matchId,
        homeScore,
        awayScore,
      },
      update: {
        homeScore,
        awayScore,
      },
    });

    revalidatePath("/predictions");
    revalidatePath(`/matches/${matchId}`);

    return { data: prediction, message: "Pick guardado exitosamente" };
  } catch {
    return { error: "Error al guardar el pick" };
  }
}

export async function getUserPredictions(userId?: string) {
  const session = await auth();
  const targetUserId = userId || session?.user?.id;
  
  if (!targetUserId) return { error: "No autorizado" };

  const predictions = await prisma.prediction.findMany({
    where: { userId: targetUserId },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
          stage: true,
        },
      },
    },
    orderBy: { match: { scheduledAt: "desc" } },
  });

  return { data: predictions };
}

export async function recalculatePoints(matchId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Sin permisos" };
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { predictions: true },
  });

  if (!match || match.homeScore === null || match.awayScore === null) {
    return { error: "Partido no tiene resultado" };
  }

  const scoreRule = await prisma.scoreRule.findFirst({
    where: { isActive: true },
  });

  const rules = scoreRule || { exactScore: 3, correctResult: 1, goalDifference: 2 };

  let updatedCount = 0;

  for (const prediction of match.predictions) {
    const predResult = Math.sign(prediction.homeScore - prediction.awayScore);
    const realResult = Math.sign(match.homeScore - match.awayScore);
    const isCorrectResult = predResult === realResult;
    const isExact = prediction.homeScore === match.homeScore && prediction.awayScore === match.awayScore;

    let points = 0;
    if (isExact) {
      points = rules.exactScore;
    } else if (isCorrectResult) {
      points = rules.correctResult;
      if (prediction.homeScore - prediction.awayScore === match.homeScore - match.awayScore) {
        points += rules.goalDifference;
      }
    }

    await prisma.prediction.update({
      where: { id: prediction.id },
      data: { points, isExact, isCorrectResult },
    });

    updatedCount++;
  }

  // Recalculate user totals
  const affectedUserIds = match.predictions.map((p) => p.userId);
  for (const userId of affectedUserIds) {
    const userPredictions = await prisma.prediction.findMany({
      where: { userId, points: { not: null } },
    });

    const totalPoints = userPredictions.reduce((sum, p) => sum + (p.points || 0), 0);
    const exactPicks = userPredictions.filter((p) => p.isExact).length;
    const correctPicks = userPredictions.filter((p) => p.isCorrectResult).length;

    await prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints,
        exactPicks,
        correctPicks,
        totalPicks: userPredictions.length,
      },
    });
  }

  revalidatePath("/ranking");
  revalidatePath("/dashboard");

  return { message: `${updatedCount} picks recalculados` };
}
