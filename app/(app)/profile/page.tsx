import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      favoriteTeam: true,
      predictions: {
        include: { match: { include: { homeTeam: true, awayTeam: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) redirect("/auth/login");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Mi Perfil</h1>
      <div className="glass-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-600 flex items-center justify-center text-2xl font-bold">
            {user.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-black text-gold">{user.totalPoints}</p>
            <p className="text-xs text-muted-foreground">Puntos</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-black text-green-400">{user.exactPicks}</p>
            <p className="text-xs text-muted-foreground">Exactos</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-2xl font-black text-brand-400">{user.totalPicks}</p>
            <p className="text-xs text-muted-foreground">Total picks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
