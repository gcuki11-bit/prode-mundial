"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateMatchResult, lockMatch } from "@/actions/matches";
import { recalculatePoints } from "@/actions/predictions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lock, RefreshCw, Check, Edit } from "lucide-react";
import type { Match, Team, TournamentStage } from "@prisma/client";

type MatchWithTeams = Match & { homeTeam: Team; awayTeam: Team; stage: TournamentStage };

function MatchRow({ match, onUpdate }: { match: MatchWithTeams; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [homeScore, setHomeScore] = useState(match.homeScore?.toString() || "");
  const [awayScore, setAwayScore] = useState(match.awayScore?.toString() || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (homeScore === "" || awayScore === "") return;
    setLoading(true);
    const result = await updateMatchResult(match.id, Number(homeScore), Number(awayScore));
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Resultado guardado");
      // Recalculate points
      await recalculatePoints(match.id);
      toast.success("Puntos recalculados");
      setEditing(false);
      onUpdate();
    }
    setLoading(false);
  };

  const handleLock = async () => {
    setLoading(true);
    const result = await lockMatch(match.id);
    if (result.error) toast.error(result.error);
    else toast.success("Partido bloqueado");
    setLoading(false);
    onUpdate();
  };

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/5 hover:bg-white/3 transition-colors"
    >
      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">#{match.matchNumber}</td>
      <td className="px-4 py-3 text-sm">{match.homeTeam.shortName} vs {match.awayTeam.shortName}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {format(new Date(match.scheduledAt), "dd/MM HH:mm")}
      </td>
      <td className="px-4 py-3">
        <Badge
          variant="outline"
          className={
            match.status === "FINISHED" ? "text-gray-400 border-gray-400/30" :
            match.status === "LIVE" ? "text-green-400 border-green-400/30" :
            "text-blue-400 border-blue-400/30"
          }
        >
          {match.status}
        </Badge>
      </td>
      <td className="px-4 py-3">
        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={20}
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="w-16 h-7 text-center text-sm bg-white/10"
            />
            <span>-</span>
            <Input
              type="number"
              min={0}
              max={20}
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="w-16 h-7 text-center text-sm bg-white/10"
            />
            <Button size="sm" onClick={handleSave} disabled={loading} className="h-7 bg-green-600 hover:bg-green-500">
              <Check className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <span className="font-bold text-sm">
            {match.homeScore !== null ? `${match.homeScore} - ${match.awayScore}` : "- : -"}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-white/10"
            onClick={() => setEditing(!editing)}
          >
            <Edit className="w-3 h-3 mr-1" />
            Editar
          </Button>
          {!match.isLocked && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-red-400/30 text-red-400"
              onClick={handleLock}
              disabled={loading}
            >
              <Lock className="w-3 h-3 mr-1" />
              Bloquear
            </Button>
          )}
          {match.status === "FINISHED" && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-cyan-400/30 text-cyan-400"
              onClick={async () => {
                toast.info("Recalculando...");
                await recalculatePoints(match.id);
                toast.success("Puntos recalculados");
              }}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Recalcular
            </Button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

export function AdminMatchesView({ matches }: { matches: MatchWithTeams[] }) {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Partidos</h1>
        <p className="text-muted-foreground">Cargá resultados y controlá el estado de cada partido</p>
      </div>

      <div className="glass-card overflow-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Partido</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Resultado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody key={key}>
            {matches.map((match) => (
              <MatchRow key={match.id} match={match} onUpdate={() => setKey((k) => k + 1)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
