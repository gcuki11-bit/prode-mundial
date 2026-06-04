"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Trophy, Mail, Loader2, ArrowRight, Chrome } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const emailSchema = z.object({
  email: z.string().email("Email inválido"),
});
type EmailFormData = z.infer<typeof emailSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const form = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });

  const handleEmailLogin = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn("resend", {
        email: data.email,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (result?.error) {
        toast.error("Error al enviar el email. Intentá de nuevo.");
      } else {
        setEmailSent(true);
        toast.success("¡Email enviado! Revisá tu bandeja de entrada.");
      }
    } catch {
      toast.error("Error inesperado. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="hero-gradient fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 pitch-bg opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-emerald-500/25">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black gradient-text mb-1">Prode Mundial</h1>
          <p className="text-muted-foreground text-sm">Mundial 2026 · Predecí y ganá</p>
        </div>

        <div className="glass-card card-glow border border-emerald-500/10">
          {emailSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <div className="text-6xl">📧</div>
              <h2 className="text-xl font-black text-white">Revisá tu email</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Enviamos un link de acceso a{" "}
                <strong className="text-emerald-400">{form.getValues("email")}</strong>.
                Hacé click en el link para ingresar.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEmailSent(false)}
                className="text-emerald-400 hover:text-emerald-300"
              >
                Usar otro email
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Google */}
              <Button
                className="w-full bg-white hover:bg-gray-50 text-gray-900 gap-3 h-11 font-semibold shadow-lg"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                aria-label="Continuar con Google"
              >
                <Chrome className="w-4 h-4" />
                Continuar con Google
              </Button>

              {/* Separador */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest">o</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Magic link */}
              <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10 h-11 bg-white/5 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                      {...form.register("email")}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 gap-2 h-11 text-white font-bold shadow-lg shadow-emerald-500/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Enviar link de acceso <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                Al ingresar aceptás los{" "}
                <Link href="/terms" className="text-emerald-400 hover:underline">términos y condiciones</Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
