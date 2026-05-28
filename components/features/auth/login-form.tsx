"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Trophy, Mail, Chrome, Loader2, ArrowRight } from "lucide-react";
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

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Prode Mundial</h1>
        <p className="text-muted-foreground">
          Predecí, competí, ganá.
        </p>
      </div>

      {emailSent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="text-5xl">📧</div>
          <h2 className="text-xl font-bold">Revisá tu email</h2>
          <p className="text-muted-foreground text-sm">
            Te enviamos un link mágico a <strong>{form.getValues("email")}</strong>.
            Hacé click en el link para ingresar.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEmailSent(false)}
            className="text-brand-400"
          >
            Usar otro email
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Google login */}
          <Button
            className="w-full bg-white text-black hover:bg-gray-100 gap-2 h-11"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Chrome className="w-4 h-4" />
            Continuar con Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/80 px-2 text-muted-foreground backdrop-blur-sm">
                o con email
              </span>
            </div>
          </div>

          {/* Email magic link */}
          <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10 bg-white/5 border-white/10 focus:border-brand-400"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 gap-2 h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Enviar link de acceso
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Al ingresar aceptás los{" "}
            <Link href="/terms" className="text-brand-400 hover:underline">
              términos y condiciones
            </Link>
          </p>
        </div>
      )}
    </motion.div>
  );
}
