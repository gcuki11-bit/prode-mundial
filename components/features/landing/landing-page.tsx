"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Star, Users, Zap, ArrowRight, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Star, title: "Picks en tiempo real", desc: "Cargá tus pronósticos antes del cierre y competí contra todos." },
  { icon: BarChart3, title: "Rankings en vivo", desc: "Tabla global, por etapa y semanal. Seguí tu posición en todo momento." },
  { icon: Trophy, title: "Bracket interactivo", desc: "Visualizá la fase eliminatoria con un bracket moderno e intuitivo." },
  { icon: Users, title: "Para grupos privados", desc: "Perfecto para la oficina, amigos o familia. Hasta 100 participantes." },
  { icon: Shield, title: "Admin panel completo", desc: "Control total: partidos, usuarios, puntos y configuración." },
  { icon: Zap, title: "Diseño premium", desc: "Experiencia visual de primer nivel. Oscuro, moderno y elegante." },
];

const STATS = [
  { value: "48", label: "Partidos" },
  { value: "32", label: "Selecciones" },
  { value: "3pts", label: "Por exacto" },
  { value: "100%", label: "Gratis" },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-background to-pitch-dark" />
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/3 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-cyan-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">Prode Mundial</span>
        </div>
        <Link href="/auth/login">
          <Button variant="outline" className="border-white/10 hover:border-brand-400 gap-2">
            Ingresar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-4 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-300 mb-8">
            <Star className="w-3 h-3 fill-current" />
            Plataforma de pronósticos deportivos
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none">
            <span className="gradient-text">Prode</span>
            <br />
            <span className="text-white">Mundial</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            La plataforma más moderna para pronósticos deportivos grupales.
            Predecí resultados, competí con amigos y seguí el torneo en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white gap-2 px-8 h-12 text-base shadow-lg shadow-brand-500/20"
              >
                Comenzar gratis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-2xl mx-auto"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="glass-card text-center py-4">
              <div className="text-2xl font-black gradient-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Todo lo que necesitás</h2>
          <p className="text-muted-foreground">Una plataforma completa para vivir el torneo al máximo</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card group hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500/30 transition-colors">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="glass-card max-w-2xl mx-auto">
          <Trophy className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para competir?
          </h2>
          <p className="text-muted-foreground mb-8">
            Unite gratis y empezá a cargar tus picks hoy.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 gap-2">
              Empezar ahora
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
