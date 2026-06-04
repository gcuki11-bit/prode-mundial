"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Trophy, Star, Users, Zap, ArrowRight, Shield,
  BarChart3, CheckCircle2, Globe2, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Star, title: "Picks en tiempo real", desc: "Cargá tus pronósticos antes del cierre. El sistema bloquea automáticamente cuando arranca el partido.", color: "text-yellow-400", bg: "bg-yellow-500/10 group-hover:bg-yellow-500/20 border-yellow-500/20" },
  { icon: BarChart3, title: "Rankings en vivo", desc: "Tabla global, por etapa y semanal. Seguí tu posición y la de tus rivales en todo momento.", color: "text-emerald-400", bg: "bg-emerald-500/10 group-hover:bg-emerald-500/20 border-emerald-500/20" },
  { icon: Trophy, title: "Bracket eliminatorio", desc: "Visualizá la fase eliminatoria con un bracket moderno e interactivo. Completo hasta la final.", color: "text-amber-400", bg: "bg-amber-500/10 group-hover:bg-amber-500/20 border-amber-500/20" },
  { icon: Users, title: "Para grupos privados", desc: "Perfecto para la oficina, amigos o familia. Invitá a todos con un link y empieza la competencia.", color: "text-blue-400", bg: "bg-blue-500/10 group-hover:bg-blue-500/20 border-blue-500/20" },
  { icon: Shield, title: "Panel de admin", desc: "Control total: cargá resultados, recalculá puntos, gestioná usuarios y configurá reglas.", color: "text-purple-400", bg: "bg-purple-500/10 group-hover:bg-purple-500/20 border-purple-500/20" },
  { icon: Zap, title: "Diseño premium", desc: "Interfaz moderna, dark y responsive. Se ve igual de bien en celular que en computadora.", color: "text-cyan-400", bg: "bg-cyan-500/10 group-hover:bg-cyan-500/20 border-cyan-500/20" },
];

const STATS = [
  { value: "48", label: "Selecciones", icon: Globe2 },
  { value: "72", label: "Partidos", icon: Timer },
  { value: "3 pts", label: "Por exacto", icon: Star },
  { value: "100%", label: "Gratis", icon: CheckCircle2 },
];

// Cuenta regresiva al Mundial 2026 (11 junio 2026)
function Countdown() {
  const target = new Date("2026-06-11T15:00:00Z");
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const pad = (n: number) => String(n).padStart(2, "0");

  if (diff === 0) return null;

  return (
    <div className="flex items-center gap-3 justify-center flex-wrap">
      <span className="text-xs text-muted-foreground uppercase tracking-widest mr-1">Arranca en</span>
      {[{ v: days, l: "días" }, { v: hours, l: "hrs" }, { v: mins, l: "min" }, { v: secs, l: "seg" }].map(({ v, l }) => (
        <div key={l} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 min-w-[56px]">
          <span className="text-2xl font-black text-emerald-400 tabular-nums">{l === "días" ? days : pad(v)}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{l}</span>
        </div>
      ))}
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 pitch-bg opacity-60" />
        {/* Glow spots */}
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-lg gradient-text block leading-tight">Prode Mundial</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">2026</span>
          </div>
        </div>
        <Link href="/auth/login">
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-500/20">
            Ingresar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-4 pt-10 pb-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-5 py-2 rounded-full text-sm text-emerald-300 mb-8"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          ⚽ Mundial 2026 · 48 selecciones · 104 partidos
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-7xl md:text-9xl font-black mb-2 leading-none tracking-tight"
        >
          <span className="gradient-text">Prode</span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-7xl md:text-9xl font-black mb-8 leading-none tracking-tight"
        >
          <span className="text-white">Mundial</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
        >
          La plataforma más moderna para pronósticos del Mundial.
          Predecí, competí con tu grupo y seguí el torneo en tiempo real.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
        >
          <Link href="/auth/login">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white gap-2 px-10 h-14 text-base shadow-2xl shadow-emerald-500/25 font-bold"
            >
              🚀 Empezar gratis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <Countdown />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="glass-card card-glow text-center py-5 group">
              <Icon className="w-5 h-5 text-emerald-400 mx-auto mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="text-3xl font-black gradient-text">{value}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Todo lo que <span className="gradient-text">necesitás</span>
          </h2>
          <p className="text-muted-foreground text-lg">Una plataforma completa para vivir el torneo al máximo</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card group hover:bg-white/8 transition-all duration-300 card-glow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-colors ${feature.bg}`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card max-w-2xl mx-auto card-glow border border-emerald-500/15"
        >
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            ¿Listo para <span className="gradient-text">competir</span>?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Unite gratis y empezá a cargar tus picks antes de que arranque el Mundial.
          </p>
          <Link href="/auth/login">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 gap-2 text-white px-10 h-12 font-bold shadow-xl shadow-emerald-500/20"
            >
              Empezar ahora — es gratis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer minimalista */}
      <footer className="relative z-10 border-t border-white/5 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-500" />
            Prode Mundial 2026
          </span>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-white transition-colors">Términos</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
