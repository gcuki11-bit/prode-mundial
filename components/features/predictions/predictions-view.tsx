"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { upsertPrediction } from "@/actions/predictions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle, Save, Loader2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Match, Team, Prediction, TournamentStage } from "@prisma/client";

type MatchWithData = Match & {
  homeTeam: Team;
  awayTeam: Team;
  stage: TournamentStage;
  predictions: Prediction[];
};

const predSchema = z.object({
  homeScore: z.number().int().min(0).max(20),
  awayScore: z.number().int().min(0).max(20),
});

function ScoreInput({
  value,
  onChange,
  disabled,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => !disabled && onChange(Math.min(20, value + 1))}
        disabled={disabled}
        aria-label={`Aumentar goles ${label}`}
        className="w-8 h-8 rounded-lg bg-white/8 hover:bg-emerald-500/20 hover:text-emerald-400 disabled:opacity-30 transition-all text-lg font-black leading-none flex items-center justify-center"
      >
        +
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(20, parseInt(e.target.value) || 0)))}
        disabled={disabled}
        aria-label={`Goles ${label}`}
        className="score-input disabled:opacity-50 disabled:cursor-not-allowed"
        min={0}
        max={20}
      />
      <button
        type="button"
        onClick={() => !disabled && onChange(Math.max(0, value - 1))}
        disabled={disabled || value === 0}
        aria-label={`Disminuir goles ${label}`}
        className="w-8 h-8 rounded-lg bg-white/8 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30 transition-all text-lg font-black leading-none flex items-center justify-center"
      >
        −
      </button>
    </div>
  );
}

function MatchCard({ match, userId }: { match: MatchWithData; userId: string }) {
  const existing = match.predictions[0];
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isLocked = match.isLocked || new Date(match.scheduledAt) <= new Date();
  const hasResult = match.homeScore !== null;

  const { watch, setValue, handleSubmit } = useForm({
    resolver: zodResolver(predSchema),
    defaultValues: {
      homeScore: existing?.homeScore ?? 1,
      awayScore: existing?.awayScore ?? 1,
    },
  });

  const homeScore = watch("homeScore");
  const awayScore = watch("awayScore");

  const onSave = async (data: { homeScore: number; awayScore: number }) => {
    setIsSaving(true);
    const result = await upsertPrediction({ matchId: match.id, ...data });
    setIsSaving(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      setSaved(true);
      toast.success("Pick guardado ✓");
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const pointsColor =
    existing?.isExact ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" :
    existing?.isCorrectResult ? "text-blue-400 bg-blue-500/10 border-blue-500/25" :
    existing?.points !== null && existing.points === 0 ? "text-red-400 bg-red-500/10 border-red-500/25" :
    "text-muted-foreground bg-white/5 border-white/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border transition-all overflow-hidden",
        isLocked
          ? "bg-white/3 border-white/6"
          : "bg-white/5 border-white/10 hover:border-emerald-500/20 hover:bg-white/8 card-glow"
      )}
    >
      {/* Top bar con info del partido */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/6 bg-white/3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(
            "text-xs font-semibold",
            match.groupName
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-purple-500/10 text-purple-400 border-purple-500/20"
          )}>
            {match.groupName ? `Grupo ${match.groupName}` : match.stage.name}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {format(new Date(match.scheduledAt), "d MMM · HH:mm", { locale: es })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLocked && (
            <Badge variant="outline" className="text-xs text-red-400 border-red-400/20 bg-red-500/8">
              <Lock className="w-2.5 h-2.5 mr-1" aria-hidden />
              Cerrado
            </Badge>
          )}
          {existing?.points !== null && (
            <Badge variant="outline" className={cn("text-xs font-bold border", pointsColor)}>
              {existing.isExact ? "🎯 " : existing.isCorrectResult ? "✅ " : "❌ "}
              {existing.points} pts
            </Badge>
          )}
        </div>
      </div>

      {/* Cuerpo: equipos + score inputs */}
      <form onSubmit={handleSubmit(onSave)}>
        <div className="flex items-center gap-4 px-5 py-6">
          {/* Equipo local */}
          <div className="flex-1 flex items-center gap-3 justify-end">
            <div className="text-right hidden sm:block">
              <p className="font-black text-white text-base">{match.homeTeam.name}</p>
              <p className="text-xs text-muted-foreground">{match.homeTeam.group ? `Grupo ${match.homeTeam.group}` : ""}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/8 flex items-center justify-center text-3xl flex-shrink-0">
              {"⚽"}
            </div>
          </div>

          {/* Score inputs */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <ScoreInput
              value={homeScore}
              onChange={(v) => setValue("homeScore", v)}
              disabled={isLocked}
              label={match.homeTeam.shortName}
            />
            <div className="text-muted-foreground font-black text-xl">—</div>
            <ScoreInput
              value={awayScore}
              onChange={(v) => setValue("awayScore", v)}
              disabled={isLocked}
              label={match.awayTeam.shortName}
            />
          </div>

          {/* Equipo visitante */}
          <div className="flex-1 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/8 flex items-center justify-center text-3xl flex-shrink-0">
              {"⚽"}
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-white text-base">{match.awayTeam.name}</p>
              <p className="text-xs text-muted-foreground">{match.awayTeam.group ? `Grupo ${match.awayTeam.group}` : ""}</p>
            </div>
          </div>
        </div>

        {/* Resultado real si el partido terminó */}
        {hasResult && (
          <div className="px-5 pb-3 flex justify-center">
            <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
              Resultado: <strong className="text-white">{match.homeScore} — {match.awayScore}</strong>
            </span>
          </div>
        )}

        {/* Footer: guardar */}
        {!isLocked && (
          <div className="px-5 pb-5 flex justify-center">
            <Button
              type="submit"
              disabled={isSaving}
              size="sm"
              className={cn(
                "gap-2 font-bold transition-all",
                saved
                  ? "bg-emerald-600 text-white"
                  : "bg-white/10 hover:bg-emerald-600/80 hover:text-white text-white border border-white/10 hover:border-emerald-500/30"
              )}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : saved ? (
                <><CheckCircle className="w-3.5 h-3.5" /> Guardado</>
              ) : (
                <><Save className="w-3.5 h-3.5" /> Guardar pick</>
              )}
            </Button>
          </div>
        )}
      </form>
    </motion.div>
  );
}

interface PredictionsViewProps {
  matches: MatchWithData[];
  userId: string;
}

export function PredictionsView({ matches, userId }: PredictionsViewProps) {
  const groups = [...new Set(matches.map((m) => m.groupName).filter(Boolean))].sort();
  const [activeGroup, setActiveGroup] = useState<string | null>(groups[0] ?? null);

  const filtered = activeGroup
    ? matches.filter((m) => m.groupName === activeGroup)
    : matches;

  const myPicks = matches.filter((m) => m.predictions.length > 0).length;
  const totalOpen = matches.filter((m) => !m.isLocked && new Date(m.scheduledAt) > new Date()).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Mundial 2026</p>
          <h1 className="text-4xl font-black text-white">
            Mis <span className="gradient-text">Picks</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-center">
            <div className="text-2xl font-black text-emerald-400 tabular-nums">{myPicks}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">cargados</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-center">
            <div className="text-2xl font-black text-amber-400 tabular-nums">{totalOpen}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">pendientes</div>
          </div>
        </div>
      </div>

      {/* Filtro por grupo */}
      {groups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveGroup(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
              activeGroup === null
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-white/5 text-muted-foreground border-white/10 hover:text-white hover:bg-white/10"
            )}
          >
            Todos
          </button>
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g!)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
                activeGroup === g
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-white/5 text-muted-foreground border-white/10 hover:text-white hover:bg-white/10"
              )}
            >
              Gr. {g}
            </button>
          ))}
        </div>
      )}

      {/* Cards de partidos */}
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="glass-card text-center py-16 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No hay partidos disponibles</p>
          </div>
        ) : (
          filtered.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <MatchCard match={match} userId={userId} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
