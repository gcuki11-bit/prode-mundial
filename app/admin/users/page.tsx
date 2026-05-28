import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">{users.length} usuarios registrados</p>
      </div>

      <div className="glass-card overflow-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Usuario</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Rol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Puntos</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Picks</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold">
                      {user.name?.charAt(0) || "?"}
                    </div>
                    <span className="text-sm font-medium">{user.name || "Sin nombre"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    user.role === "ADMIN" 
                      ? "bg-red-500/20 text-red-400 border-red-500/30" 
                      : "bg-white/10 text-muted-foreground border-white/10"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gold">{user.totalPoints}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{user.totalPicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
