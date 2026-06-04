import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-black text-white mb-2">Política de Privacidad</h1>
          <p className="text-sm text-muted-foreground mb-8">Última actualización: Junio 2026</p>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-3">Datos que recopilamos</h2>
              <p>Al usar Prode Mundial recopilamos: tu nombre y dirección de email (a través de Google OAuth o magic link), foto de perfil (opcional, desde Google), y tus pronósticos de partidos.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-white mb-3">Cómo usamos tus datos</h2>
              <p>Tus datos se usan únicamente para: identificarte dentro de la plataforma, mostrar tu ranking y picks en el grupo, y enviarte el magic link de acceso cuando lo solicitás. No vendemos ni compartimos tus datos con terceros.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-white mb-3">Almacenamiento</h2>
              <p>Los datos se almacenan en una base de datos PostgreSQL (Neon) con cifrado en tránsito. Los magic links de acceso se envían mediante Resend y expiran automáticamente.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-white mb-3">Tus derechos</h2>
              <p>Podés solicitar en cualquier momento: ver los datos que tenemos sobre vos, modificar tu perfil desde la sección Mi Perfil, o eliminar tu cuenta contactando al administrador del grupo.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-white mb-3">Contacto</h2>
              <p>Para cualquier consulta sobre tu privacidad, contactá al administrador de tu grupo o escribinos a través de la plataforma.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
