"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GitBranch, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Match, Team, TournamentStage } from "@prisma/client";

type MatchWithTeams = Match & { homeTeam: Team; awayTeam: Team; stage: TournamentStage };

function BracketMatchCard({ match }: { match: MatchWithTeams }) {
  const isFinished = match.status === "FINISHED";
  const homeWon = isFinished && match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore;
  const awayWon = isFinished && match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore;

  return (
    <div className="glass border border-white/10 rounded-xl overflow-hidden w-52">
      <div className="p-1.5 flex items-center gap-2 border-b border-white/5">
        <div className={cn(
          "flex items-center gap-2 flex-1 px-2 py-1.5 rounded-lg transition-colors",
          homeWon ? "bg-green-500/20" : ""
        )}>
          {match.homeTeam.flagUrl ? (
            <Image src={match.homeTeam.flagUrl} alt={match.homeTeam.name} width={20} height={14} className="rounded-sm" />
          ) : (
            <div className="w-5 h-3 bg-white/10 rounded-sm" />
          )}
          <span className={cn("text-xs font-medium flex-1 truncate", homeWon ? "text-green-400" : "")}>
            {match.homeTeam.shortName}
          </span>
          {isFinished && (
            <span className={cn("text-sm font-bold", homeWon ? "text-green-400" : "text-muted-foreground")}>
              {match.homeScore}
            </span>
          )}
        </div>
      </div>
      <div className="p-1.5 flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-2 flex-1 px-2 py-1.5 rounded-lg transition-colors",
          awayWon ? "bg-green-500/20" : ""
        )}>
          {match.awayTeam.flagUrl ? (
            <Image src={match.awayTeam.flagUrl} alt={match.awayTeam.name} width={20} height={14} className="rounded-sm" />
          ) : (
            <div className="w-5 h-3 bg-white/10 rounded-sm" />
          )}
          <span className={cn("text-xs font-medium flex-1 truncate", awayWon ? "text-green-400" : "")}>
            {match.awayTeam.shortName}
          </span>
          {isFinished && (
            <span className={cn("text-sm font-bold", awayWon ? "text-green-400" : "text-muted-foreground")}>
              {match.awayScore}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyBracketSlot() {
  return (
    <div className="glass border border-white/5 rounded-xl overflow-hidden w-52 opacity-40">
      <div className="p-1.5 border-b border-white/5">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-5 h-3 bg-white/10 rounded-sm" />
          <div className="h-3 bg-white/10 rounded flex-1" />
        </div>
      </div>
      <div className="p-1.5">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-5 h-3 bg-white/10 rounded-sm" />
          <div className="h-3 bg-white/10 rounded flex-1" />
        </div>
      </div>
    </div>
  );
}

function BracketRound({ title, matches, slots }: { title: string; matches: MatchWithTeams[]; slots: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <Badge variant="outline" className="text-xs">{title}</Badge>
      </div>
      <div className="flex flex-col gap-6 justify-around" style={{ minHeight: `${slots * 80}px` }}>
        {Array.from({ length: slots }).map((_, i) => {
          const match = matches[i];
          return (
            <div key={i} className="flex items-center justify-center">
              {match ? (
                <BracketMatchCard match={match} />
              ) : (
                <EmptyBracketSlot />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BracketView({ matches }: { matches: MatchWithTeams[] }) {
  const roundOf16 = matches.filter((m) => m.stage.type === "ROUND_OF_16");
  const quarterFinals = matches.filter((m) => m.stage.type === "QUARTER_FINAL");
  const semiFinals = matches.filter((m) => m.stage.type === "SEMI_FINAL");
  const thirdPlace = matches.filter((m) => m.stage.type === "THIRD_PLACE");
  const final = matches.filter((m) => m.stage.type === "FINAL");

  const rounds = [
    { title: "Octavos", matches: roundOf16, slots: 8 },
    { title: "Cuartos", matches: quarterFinals, slots: 4 },
    { title: "Semis", matches: semiFinals, slots: 2 },
    { title: "Final", matches: final, slots: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bracket Eliminatorias</h1>
        <p className="text-muted-foreground mt-1">Fase eliminatoria del torneo</p>
      </div>

      {matches.length === 0 ? (
        <div className="glass-card text-center py-16">
          <GitBranch className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-xl font-bold mb-2">Bracket no disponible</h2>
          <p className="text-muted-foreground">La fase eliminatoria aún no comenzó.</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-8 items-start min-w-max px-4">
            {rounds.map((round) => (
              <motion.div
                key={round.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <BracketRound {...round} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Third place */}
      {thirdPlace.length > 0 && (
        <div className="glass-card">
          <h2 className="font-bold mb-4">Tercer Puesto 🥉</h2>
          <div className="flex justify-center">
            {thirdPlace.map((m) => (
              <BracketMatchCard key={m.id} match={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
