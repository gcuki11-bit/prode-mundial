"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { upsertPrediction } from "@/actions/predictions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, CheckCircle, Save, Loader2, Clock } from "lucide-react";
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

function MatchPredictionCard({ match, userId }: { match: MatchWithData; userId: string }) {
  const existing = match.predictions[0];
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isLocked = match.isLocked || new Date(match.scheduledAt) <= new Date();

  const form = useForm({
    resolver: zodResolver(predSchema),
    defaultValues: {
      homeScore: existing?.homeScore ?? 1,
      awayScore: existing?.awayScore ?? 1,
    },
  });

  const handleSave = async (data: { homeScore: number; awayScore: number }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card transition-all",
        isLocked ? "opacity-75" : "hover:bg-white/8"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {match.groupName ? `Grupo ${match.groupName}` : match.stage.name}
          </Badge>
          {isLocked && (
            <Badge variant="outline" className="text-xs text-red-400 border-red-400/30">
              <Lock className="w-3 h-3 mr-1" />
              Cerrado
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {format(new Date(match.scheduledAt), "dd/MM HH:mm", { locale: es })}
        </div>
      </div>

      {/* Teams + score input */}
      <div className="flex items-center gap-4">
        {/* Home team */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {match.homeTeam.flagUrl && (
            <Image
              src={match.homeTeam.flagUrl}
              alt={match.homeTeam.name}
              width={40}
              height={27}
              className="rounded object-cover shadow-md"
            />
          )}
          <span className="text-sm font-bold text-center">{match.homeTeam.shortName}</span>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={20}
            disabled={isLocked}
            className={cn("score-input", isLocked && "opacity-50 cursor-not-allowed")}
            {...form.register("homeScore", { valueAsNumber: true })}
          />
          <span className="text-muted-foreground font-bold text-xl">-</span>
          <input
            type="number"
            min={0}
            max={20}
            disabled={isLocked}
            className={cn("score-input", isLocked && "opacity-50 cursor-not-allowed")}
            {...form.register("awayScore", { valueAsNumber: true })}
          />
        </div>

        {/* Away team */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {match.awayTeam.flagUrl && (
            <Image
              src={match.awayTeam.flagUrl}
              alt={match.awayTeam.name}
              width={40}
              height={27}
              className="rounded object-cover shadow-md"
            />
          )}
          <span className="text-sm font-bold text-center">{match.awayTeam.shortName}</span>
        </div>
      </div>

      {/* Save button */}
      {!isLocked && (
        <div className="mt-4 flex justify-center">
          <Button
            size="sm"
            onClick={form.handleSubmit(handleSave)}
            disabled={isSaving}
            className={cn(
              "gap-2 transition-all",
              saved
                ? "bg-green-600 hover:bg-green-600"
                : "bg-brand-600 hover:bg-brand-500"
            )}
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            {saved ? "Guardado" : "Guardar pick"}
          </Button>
        </div>
      )}

      {/* Existing prediction indicator */}
      {existing && !isLocked && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          Pick actual: <strong>{existing.homeScore} - {existing.awayScore}</strong>
        </p>
      )}
    </motion.div>
  );
}

export function PredictionsView({ matches, userId }: { matches: MatchWithData[]; userId: string }) {
  const groups = Array.from(new Set(matches.map((m) => m.groupName || "").filter(Boolean))).sort();
  const ungrouped = matches.filter((m) => !m.groupName);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Mis Picks</h1>
        <p className="text-muted-foreground mt-1">
          Cargá tus pronósticos antes del cierre de cada partido
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h2 className="text-xl font-bold mb-2">Sin partidos disponibles</h2>
          <p className="text-muted-foreground">No hay partidos abiertos para pronósticos.</p>
        </div>
      ) : (
        <Tabs defaultValue={groups[0] || "all"}>
          {groups.length > 0 && (
            <TabsList className="glass border-white/10 mb-6 flex-wrap h-auto gap-1">
              {groups.map((g) => (
                <TabsTrigger key={g} value={g} className="data-[state=active]:bg-brand-600">
                  Grupo {g}
                </TabsTrigger>
              ))}
              {ungrouped.length > 0 && (
                <TabsTrigger value="all" className="data-[state=active]:bg-brand-600">
                  Eliminatorias
                </TabsTrigger>
              )}
            </TabsList>
          )}

          {groups.map((group) => (
            <TabsContent key={group} value={group}>
              <div className="grid sm:grid-cols-2 gap-4">
                {matches
                  .filter((m) => m.groupName === group)
                  .map((match) => (
                    <MatchPredictionCard key={match.id} match={match} userId={userId} />
                  ))}
              </div>
            </TabsContent>
          ))}

          {ungrouped.length > 0 && (
            <TabsContent value="all">
              <div className="grid sm:grid-cols-2 gap-4">
                {ungrouped.map((match) => (
                  <MatchPredictionCard key={match.id} match={match} userId={userId} />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}
