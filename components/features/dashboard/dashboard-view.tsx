"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate, formatScore, getPositionSuffix } from "@/lib/utils";
import { Trophy, Star, Calendar, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { User, Match, Prediction, Team, TournamentStage } from "@prisma/client";

type MatchWithTeams = Match & { homeTeam: Team; awayTeam: Team; stage: TournamentStage };
type PredWithMatch = Prediction & { match: MatchWithTeams };
type UserStats = Pick<User, "id" | "name" | "image" | "username" | "totalPoints" | "exactPicks" | "correctPicks" | "totalPicks">;

interface DashboardViewProps {
  user: User | null;
  upcomingMatches: MatchWithTeams[];
  recentPredictions: PredWithMatch[];
  topRankings: UserStats[];
}

export function DashboardView({ user, upcomingMatches, recentPredictions, topRankings }: DashboardViewProps) {
  const stats = [
    { label: "Puntos totales", value: user?.totalPoints || 0, icon: Trophy, color: "text-gold" },
    { label: "Picks exactos", value: user?.exactPicks || 0, icon: Star, color: "text-green-400" },
    { label: "Picks correctos", value: user?.correctPicks || 0, icon: TrendingUp, color: "text-brand-400" },
    { label: "Total picks", value: user?.totalPicks || 0, icon: Calendar, color: "text-cyan-400" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">
          Bienvenido, <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Seguí el torneo y cargá tus pronósticos</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Próximos partidos</h2>
            <Link href="/predictions">
              <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {upcomingMatches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No hay partidos próximos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <Link key={match.id} href="/predictions">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 flex-1">
                      {match.homeTeam.flagUrl && (
                        <Image src={match.homeTeam.flagUrl} alt={match.homeTeam.name} width={24} height={16} className="rounded-sm" />
                      )}
                      <span className="font-medium text-sm">{match.homeTeam.shortName}</span>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-xs text-muted-foreground">{formatDate(match.scheduledAt)}</p>
                      <p className="text-xs text-brand-400 font-medium">{match.groupName ? `Grupo ${match.groupName}` : match.stage.name}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className="font-medium text-sm">{match.awayTeam.shortName}</span>
                      {match.awayTeam.flagUrl && (
                        <Image src={match.awayTeam.flagUrl} alt={match.awayTeam.name} width={24} height={16} className="rounded-sm" />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Top Ranking</h2>
            <Link href="/ranking">
              <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
                Ver <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {topRankings.map((rankedUser, index) => (
              <div
                key={rankedUser.id}
                className={`flex items-center gap-3 p-2 rounded-lg ${rankedUser.id === user?.id ? "bg-brand-500/10 border border-brand-500/20" : ""}`}
              >
                <span className="text-lg w-6 text-center">
                  {getPositionSuffix(index + 1)}
                </span>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={rankedUser.image || ""} />
                  <AvatarFallback className="bg-brand-700 text-white text-xs">
                    {rankedUser.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{rankedUser.name}</p>
                </div>
                <span className="text-sm font-bold text-gold">{rankedUser.totalPoints} pts</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent predictions */}
      {recentPredictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Mis últimos picks</h2>
            <Link href="/predictions">
              <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentPredictions.slice(0, 6).map((pred) => (
              <div
                key={pred.id}
                className={`p-3 rounded-xl border ${
                  pred.points !== null
                    ? pred.isExact
                      ? "bg-green-500/10 border-green-500/30"
                      : pred.isCorrectResult
                      ? "bg-brand-500/10 border-brand-500/30"
                      : "bg-red-500/10 border-red-500/30"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{pred.match.homeTeam.shortName} vs {pred.match.awayTeam.shortName}</span>
                  {pred.points !== null && (
                    <Badge variant="outline" className="text-xs">
                      {pred.points} pts
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <span className="font-bold text-lg">
                    {pred.homeScore} - {pred.awayScore}
                  </span>
                  {pred.match.homeScore !== null && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Real: {formatScore(pred.match.homeScore, pred.match.awayScore)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
