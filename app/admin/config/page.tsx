import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminConfigPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const [config, scoreRule] = await Promise.all([
    prisma.appConfig.findMany(),
    prisma.scoreRule.findFirst({ where: { isActive: true } }),
  ]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Parámetros del torneo y sistema de puntos</p>
      </div>

      <div className="glass-card">
        <h2 className="font-bold mb-4">Sistema de Puntos Activo</h2>
        {scoreRule ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-green-400">{scoreRule.exactScore}</p>
              <p className="text-xs text-muted-foreground mt-1">Resultado exacto</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-brand-400">{scoreRule.correctResult}</p>
              <p className="text-xs text-muted-foreground mt-1">Ganador correcto</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-cyan-400">{scoreRule.goalDifference}</p>
              <p className="text-xs text-muted-foreground mt-1">Diferencia correcta</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No hay reglas configuradas</p>
        )}
      </div>

      <div className="glass-card">
        <h2 className="font-bold mb-4">Configuración de la App</h2>
        <div className="space-y-3">
          {config.map((c) => (
            <div key={c.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm font-medium">{c.key}</p>
                {c.description && <p className="text-xs text-muted-foreground">{c.description}</p>}
              </div>
              <span className="text-sm font-mono bg-white/10 px-2 py-1 rounded">
                {c.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
