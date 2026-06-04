"use client";

import { motion } from "framer-motion";
import { Trophy, Star, TrendingUp, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, Team } from "@prisma/client";

type UserWithTeam = User & { favoriteTeam?: Team | null };

interface RankingViewProps {
  users: UserWithTeam[];
  currentUserId: string;
  currentUser: User | null;
}

const PODIUM_CONFIG = [
  { emoji: "🥇", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", ring: "ring-yellow-500/30" },
  { emoji: "🥈", color: "text-slate-300", bg: "bg-slate-500/10 border-slate-500/20", ring: "ring-slate-400/30" },
  { emoji: "🥉", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", ring: "ring-orange-500/30" },
];

export function RankingView({ users, currentUserId, currentUser }: RankingViewProps) {
  const currentUserRank = users.findIndex((u) => u.id === currentUserId) + 1;
  const maxPoints = users[0]?.totalPoints || 1;
  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Mundial 2026</p>
        <h1 className="text-4xl font-black text-white">Ranking <span className="gradient-text">Global</span></h1>
      </div>

      {/* Mi posición */}
      {currentUser && currentUserRank > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-5"
        >
          <p className="text-xs text-emerald-400/70 uppercase tracking-wider mb-3">Tu posición</p>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-black gradient-text tabular-nums">#{currentUserRank}</div>
            <Avatar className="h-12 w-12 ring-2 ring-emerald-500/30">
              <AvatarImage src={currentUser.image || ""} />
              <AvatarFallback className="bg-emerald-800 text-white font-bold">
                {currentUser.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-black text-lg text-white truncate">{currentUser.name}</p>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="font-bold text-yellow-400">{currentUser.totalPoints}</span> pts
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-emerald-400">{currentUser.exactPicks}</span> exactos
                </span>
              </div>
            </div>
            {/* Mini barra */}
            <div className="hidden sm:block w-32">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progreso</span>
                <span>{Math.round((currentUser.totalPoints / maxPoints) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all"
                  style={{ width: `${Math.round((currentUser.totalPoints / maxPoints) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Podium top 3 */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {top3.map((user, i) => {
            const cfg = PODIUM_CONFIG[i];
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl border p-5 text-center ${cfg.bg} ${user.id === currentUserId ? "ring-2 ring-emerald-500/30" : ""}`}
              >
                <div className="text-4xl mb-3">{cfg.emoji}</div>
                <Avatar className={`h-14 w-14 mx-auto mb-3 ring-2 ${cfg.ring}`}>
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-white/10 font-bold text-white">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <p className="font-black text-sm text-white truncate mb-1">{user.name}</p>
                <p className={`text-2xl font-black tabular-nums ${cfg.color}`}>{user.totalPoints}</p>
                <p className="text-xs text-muted-foreground">puntos</p>
                <p className="text-xs text-muted-foreground mt-1">{user.exactPicks} exactos</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tabla del resto */}
      <div className="glass-card card-glow p-0 overflow-hidden">
        {/* Header tabla */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/8 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          <span>#</span>
          <span>Jugador</span>
          <span className="text-right hidden sm:block">Exactos</span>
          <span className="text-right hidden sm:block">Correctos</span>
          <span className="text-right">Puntos</span>
        </div>

        {/* Filas */}
        {users.map((user, index) => {
          const isMe = user.id === currentUserId;
          const pct = maxPoints > 0 ? (user.totalPoints / maxPoints) * 100 : 0;
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 items-center border-b border-white/5 last:border-0 transition-colors ${
                isMe ? "bg-emerald-500/8 border-l-2 border-l-emerald-500" : "hover:bg-white/4"
              }`}
            >
              {/* Posición */}
              <div className="w-8 text-center font-black">
                {index < 3 ? (
                  <span className="text-lg">{["🥇","🥈","🥉"][index]}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">{index + 1}</span>
                )}
              </div>

              {/* Usuario */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className={`text-xs font-bold ${isMe ? "bg-emerald-800 text-white" : "bg-white/10 text-white"}`}>
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className={`font-semibold text-sm truncate ${isMe ? "text-emerald-300" : "text-white"}`}>
                    {user.name}{isMe && <span className="text-emerald-500 ml-1">← vos</span>}
                  </p>
                  {/* Barra de progreso */}
                  <div className="h-1 bg-white/8 rounded-full mt-1.5 w-24 sm:w-32 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isMe ? "bg-emerald-500" : "bg-white/20"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Exactos */}
              <div className="hidden sm:flex items-center gap-1 justify-end">
                <Star className="w-3 h-3 text-emerald-500 opacity-70" />
                <span className="text-sm font-semibold tabular-nums">{user.exactPicks}</span>
              </div>

              {/* Correctos */}
              <div className="hidden sm:block text-right text-sm text-muted-foreground tabular-nums">
                {user.correctPicks}
              </div>

              {/* Puntos */}
              <div className={`text-right font-black tabular-nums text-base ${
                index === 0 ? "text-yellow-400" :
                index === 1 ? "text-slate-300" :
                index === 2 ? "text-orange-400" :
                isMe ? "text-emerald-400" : "text-white"
              }`}>
                {user.totalPoints}
                <span className="text-xs text-muted-foreground font-normal ml-0.5">pts</span>
              </div>
            </motion.div>
          );
        })}

        {users.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">El ranking se completa cuando haya picks cargados</p>
          </div>
        )}
      </div>
    </div>
  );
}
