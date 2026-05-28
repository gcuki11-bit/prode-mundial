"use client";

import { motion } from "framer-motion";
import { Trophy, Star, TrendingUp, Percent } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { User, Team } from "@prisma/client";

type UserWithTeam = User & { favoriteTeam?: Team | null };

interface RankingViewProps {
  users: UserWithTeam[];
  currentUserId: string;
  currentUser: User | null;
}

const rankColors = ["text-yellow-400", "text-gray-300", "text-orange-400"];
const rankBg = ["bg-yellow-500/20 border-yellow-500/30", "bg-gray-500/20 border-gray-500/30", "bg-orange-500/20 border-orange-500/30"];
const rankEmoji = ["🥇", "🥈", "🥉"];

export function RankingView({ users, currentUserId, currentUser }: RankingViewProps) {
  const currentUserRank = users.findIndex((u) => u.id === currentUserId) + 1;
  const maxPoints = users[0]?.totalPoints || 1;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Ranking Global</h1>
        <p className="text-muted-foreground mt-1">Clasificación de todos los participantes</p>
      </div>

      {/* Current user highlight */}
      {currentUser && currentUserRank > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-brand-500/30 bg-brand-500/5"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl font-black gradient-text">#{currentUserRank}</div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser.image || ""} />
              <AvatarFallback className="bg-brand-700 text-white">
                {currentUser.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold">{currentUser.name} <span className="text-brand-400">(Vos)</span></p>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-gold" />
                  {currentUser.totalPoints} pts
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-green-400" />
                  {currentUser.exactPicks} exactos
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Podium */}
      {users.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 items-end">
          {/* 2nd */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn("glass-card text-center border", rankBg[1])}
          >
            <div className="text-3xl mb-2">{rankEmoji[1]}</div>
            <Avatar className="h-10 w-10 mx-auto mb-2">
              <AvatarImage src={users[1].image || ""} />
              <AvatarFallback className="bg-gray-700 text-white text-sm">{users[1].name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-bold text-sm truncate">{users[1].name}</p>
            <p className={cn("font-black text-xl", rankColors[1])}>{users[1].totalPoints}</p>
            <p className="text-xs text-muted-foreground">pts</p>
          </motion.div>

          {/* 1st */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("glass-card text-center border pb-8", rankBg[0])}
          >
            <div className="text-4xl mb-2">{rankEmoji[0]}</div>
            <Avatar className="h-12 w-12 mx-auto mb-2 ring-2 ring-yellow-400">
              <AvatarImage src={users[0].image || ""} />
              <AvatarFallback className="bg-yellow-700 text-white">{users[0].name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-bold truncate">{users[0].name}</p>
            <p className={cn("font-black text-2xl", rankColors[0])}>{users[0].totalPoints}</p>
            <p className="text-xs text-muted-foreground">pts</p>
          </motion.div>

          {/* 3rd */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn("glass-card text-center border", rankBg[2])}
          >
            <div className="text-3xl mb-2">{rankEmoji[2]}</div>
            <Avatar className="h-10 w-10 mx-auto mb-2">
              <AvatarImage src={users[2].image || ""} />
              <AvatarFallback className="bg-orange-700 text-white text-sm">{users[2].name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-bold text-sm truncate">{users[2].name}</p>
            <p className={cn("font-black text-xl", rankColors[2])}>{users[2].totalPoints}</p>
            <p className="text-xs text-muted-foreground">pts</p>
          </motion.div>
        </div>
      )}

      {/* Full ranking table */}
      <div className="glass-card">
        <h2 className="font-bold mb-4">Tabla completa</h2>
        <div className="space-y-2">
          {users.map((user, index) => {
            const isCurrentUser = user.id === currentUserId;
            const accuracy = user.totalPicks > 0 ? Math.round((user.correctPicks / user.totalPicks) * 100) : 0;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-xl transition-colors",
                  isCurrentUser
                    ? "bg-brand-500/10 border border-brand-500/20"
                    : "hover:bg-white/5"
                )}
              >
                {/* Position */}
                <div className={cn(
                  "w-8 text-center font-black text-sm",
                  index === 0 ? "text-yellow-400" :
                  index === 1 ? "text-gray-300" :
                  index === 2 ? "text-orange-400" : "text-muted-foreground"
                )}>
                  {index < 3 ? rankEmoji[index] : `${index + 1}`}
                </div>

                {/* Avatar */}
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-brand-800 text-white text-xs">{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>

                {/* Name + progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    {isCurrentUser && <Badge className="text-xs bg-brand-600 py-0">Vos</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress
                      value={(user.totalPoints / maxPoints) * 100}
                      className="h-1 flex-1 bg-white/10"
                    />
                    <span className="text-xs text-muted-foreground">{accuracy}%</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Exactos</p>
                    <p className="font-bold text-green-400">{user.exactPicks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Correctos</p>
                    <p className="font-bold text-brand-400">{user.correctPicks}</p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="font-black text-gold">{user.totalPoints}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
