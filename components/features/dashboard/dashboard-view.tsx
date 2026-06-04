"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate, formatScore, getPositionSuffix } from "@/lib/utils";
import { Trophy, Star, Calendar, TrendingUp, ArrowRight, Flame, Medal } from "lucide-react";
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
    {
      label: "Puntos totales",
      value: user?.totalPoints || 0,
      icon: Trophy,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/15",
      glow: "shadow-yellow-500/10",
    },
    {
      label: "Picks exactos",
      value: user?.exactPicks || 0,
      icon: Flame,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/15",
      glow: "shadow-emerald-500/10",
    },
    {
      label: "Ganados",
      value: user?.correctPicks || 0,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/15",
      glow: "shadow-blue-500/10",
    },
    {
      label: "Total picks",
      value: user?.totalPicks || 0,
      icon: Star,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/15",
      glow: "shadow-purple-500/10",
    },
  ];

  const positionEmojis = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Bienvenido de vuelta</p>
        <h1 className="text-4xl font-black">
          <span className="gradient-text">{user?.name?.split(" ")[0] || "Jugador"}</span>{" "}
          <span className="text-white">⚽</span>
        </h1>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`rounded-2xl p-5 border ${stat.bg} shadow-lg ${stat.glow} hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <Icon className={`w-4 h-4 ${stat.color} opacity-70`} />
              </div>
              <p className={`text-4xl font-black ${stat.color} tabular-nums`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Próximos partidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card card-glow"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-lg text-white">Próximos partidos</h2>
              <p className="text-xs text-muted-foreground">Cargá tus picks antes del inicio</p>
            </div>
            <Link href="/predictions">
              <Button variant="ghost" size="sm" className="gap-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          {upcomingMatches.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No hay partidos próximos</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingMatches.slice(0, 5).map((match) => (
                <Link key={match.id} href="/predictions">
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/4 hover:bg-white/8 transition-all border border-white/5 hover:border-emerald-500/20 group cursor-pointer">
                    {/* Local */}
                    <div className="flex items-center gap-3 flex-1">
                      {match.homeTeam.flagUrl ? (
                        <Image src={match.homeTeam.flagUrl} alt={match.homeTeam.name} width={28} height={20} className="rounded object-cover" />
                      ) : (
                        <span className="text-xl">{match.homeTeam.flag || "🏳️"}</span>
                      )}
                      <span className="font-bold text-sm">{match.homeTeam.shortName}</span>
                    </div>
                    {/* VS */}
                    <div className="text-center px-4">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        {formatDate(match.scheduledAt)}
                      </div>
                      <div className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {match.groupName ? `Gr. ${match.groupName}` : match.stage.name}
                      </div>
                    </div>
                    {/* Visitante */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className="font-bold text-sm">{match.awayTeam.shortName}</span>
                      {match.awayTeam.flagUrl ? (
                        <Image src={match.awayTeam.flagUrl} alt={match.awayTeam.name} width={28} height={20} className="rounded object-cover" />
                      ) : (
                        <span className="text-xl">{match.awayTeam.flag || "🏳️"}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card card-glow"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-lg text-white">Ranking</h2>
              <p className="text-xs text-muted-foreground">Top jugadores</p>
            </div>
            <Link href="/ranking">
              <Button variant="ghost" size="sm" className="gap-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                Ver <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            {topRankings.slice(0, 8).map((rankedUser, index) => {
              const isMe = rankedUser.id === user?.id;
              return (
                <div
                  key={rankedUser.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isMe
                      ? "bg-emerald-500/10 border border-emerald-500/25"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span className="w-7 text-center text-base font-black">
                    {index < 3 ? positionEmojis[index] : <span className="text-xs text-muted-foreground font-bold">{index + 1}</span>}
                  </span>
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarImage src={rankedUser.image || ""} />
                    <AvatarFallback className="bg-emerald-800 text-white text-xs font-bold">
                      {rankedUser.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isMe ? "text-emerald-300" : ""}`}>
                      {rankedUser.name}{isMe && " (vos)"}
                    </p>
                  </div>
                  <span className={`text-sm font-black tabular-nums ${index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : index === 2 ? "text-orange-400" : "text-muted-foreground"}`}>
                    {rankedUser.totalPoints}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Últimos picks */}
      {recentPredictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card card-glow"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-black text-lg text-white">Mis últimos picks</h2>
              <p className="text-xs text-muted-foreground">Resultados recientes</p>
            </div>
            <Link href="/predictions">
              <Button variant="ghost" size="sm" className="gap-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                Todos <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentPredictions.slice(0, 6).map((pred) => {
              const isExact = pred.isExact;
              const isCorrect = pred.isCorrectResult && !isExact;
              const isFailed = pred.points !== null && !isExact && !isCorrect;

              return (
                <div
                  key={pred.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    isExact
                      ? "bg-emerald-500/8 border-emerald-500/25"
                      : isCorrect
                      ? "bg-blue-500/8 border-blue-500/25"
                      : isFailed
                      ? "bg-red-500/8 border-red-500/20"
                      : "bg-white/4 border-white/8"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span className="font-medium">
                      {pred.match.homeTeam.shortName} vs {pred.match.awayTeam.shortName}
                    </span>
                    {pred.points !== null && (
                      <Badge variant="outline" className={`text-xs font-bold ${isExact ? "border-emerald-500/30 text-emerald-400" : isCorrect ? "border-blue-500/30 text-blue-400" : "border-red-500/30 text-red-400"}`}>
                        {isExact ? "🎯 " : isCorrect ? "✅ " : "❌ "}{pred.points} pts
                      </Badge>
                    )}
                  </div>
                  <div className="text-center">
                    <span className="font-black text-2xl tabular-nums">
                      {pred.homeScore} <span className="text-muted-foreground text-base">—</span> {pred.awayScore}
                    </span>
                    {pred.match.homeScore !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Real: {formatScore(pred.match.homeScore, pred.match.awayScore)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
