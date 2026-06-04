import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="hero-gradient fixed inset-0 pointer-events-none" />
      <div className="relative z-10 text-center max-w-md">
        <div className="text-8xl mb-6 animate-bounce">⚽</div>
        <h1 className="text-7xl font-black gradient-text mb-2">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Fuera del campo</h2>
        <p className="text-muted-foreground mb-8">
          Esta página fue a buscar el balón y no volvió. Volvé al inicio para seguir jugando.
        </p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 gap-2 text-white font-bold">
            <Home className="w-4 h-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
