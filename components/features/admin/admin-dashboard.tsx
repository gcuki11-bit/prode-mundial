"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { Users, Trophy, BarChart3, CheckSquare, Shield, ArrowRight, Settings, Calendar, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User, Match, Team, TournamentStage } from "@prisma/client";

type MatchWithTeams = Match & { homeTeam: Team; awayTeam: Team; stage: TournamentStage };

interface AdminDashboardProps {
  stats: {
    userCount: number;
    matchCount: number;
    predictionCount: number;
    finishedMatches: number;
  };
  recentUsers: User[];
  pendingMatches: MatchWithTeams[];
}

const quickLinks = [
  { href: "/admin/matches", label: "Gestionar Partidos", icon: Calendar, desc: "Resultados, estados, bloqueos" },
  { href: "/admin/users", label: "Gestionar Usuarios", icon: Users, desc: "Roles, perfiles, activar/desactivar" },
  { href: "/admin/teams", label: "Gestionar Equipos", icon: Flag, desc: "Escudos, grupos, datos" },
  { href: "/admin/config", label: "Configuración", icon: Settings, desc: "Reglas, puntos, parámetros" },
];

export function AdminDashboard({ stats, recentUsers, pendingMatches }: AdminDashboardProps) {
  const statsData = [
    { label: "Usuarios", value: stats.userCount, icon: Users, color: "text-brand-400" },
    { label: "Partidos", value: stats.matchCount, icon: Calendar, color: "text-cyan-400" },
    { label: "Pronósticos", value: stats.predictionCount, icon: BarChart3, color: "text-purple-400" },
    { label: "Terminados", value: stats.finishedMatches, icon: CheckSquare, color: "text-green-400" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Panel de Admin</h1>
          <p className="text-muted-foreground">Control total del torneo</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <div className="glass-card hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <Icon className="w-6 h-6 text-brand-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-sm mb-1">{link.label}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Últimos usuarios</h2>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-brand-800 text-xs">{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge variant={user.role === "ADMIN" ? "destructive" : "outline"} className="text-xs">
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Pending matches */}
        <div className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Partidos pendientes</h2>
            <Link href="/admin/matches">
              <Button variant="ghost" size="sm" className="gap-1 text-brand-400">
                Gestionar <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {pendingMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="text-sm">
                  <span className="font-medium">{match.homeTeam.shortName}</span>
                  <span className="text-muted-foreground mx-2">vs</span>
                  <span className="font-medium">{match.awayTeam.shortName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(match.scheduledAt), "dd/MM HH:mm")}
                  </span>
                  <Badge
                    variant="outline"
                    className={match.status === "LIVE" ? "text-green-400 border-green-400/30" : "text-blue-400 border-blue-400/30"}
                  >
                    {match.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
