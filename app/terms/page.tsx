import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="hero-gradient fixed inset-0 pointer-events-none" />
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <span className="font-black gradient-text">Prode Mundial</span>
        </div>

        <Link href="/auth/login">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Button>
        </Link>

        <div className="glass-card card-glow">
          <h1 className="text-3xl font-black text-white mb-2">Términos y Condiciones</h1>
          <p className="text-sm text-muted-foreground mb-8">Última actualización: Junio 2026</p>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-3">1. Aceptación</h2>
              <p>Al registrarte en Prode Mundial, aceptás estos términos de uso. La plataforma es de uso gratuito y está destinada exclusivamente a fines recreativos. No se realizan apuestas ni transacciones económicas de ningún tipo.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-white mb-3">2. Uso del servicio</h2>
              <p>La plataforma permite cargar pronósticos de partidos del Mundial 2026 y competir con un grupo de participantes. Los pronósticos son definitivos una vez iniciado el partido correspondiente. El sistema de puntos es administrado por el organizador del grupo.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-white mb-3">3. Privacidad</h2>
              <p>Recopilamos únicamente tu email y nombre para identificarte en la plataforma. No compartimos tus datos con terceros. Podés solicitar la eliminación de tu cuenta en cualquier momento contactando al administrador.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-white mb-3">4. Responsabilidades</h2>
              <p>La plataforma no garantiza disponibilidad continua del servicio. Los puntos y rankings son definitivos según la decisión del administrador. Cualquier disputa sobre resultados debe resolverse directamente con el administrador del grupo.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-white mb-3">5. Modificaciones</h2>
              <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
