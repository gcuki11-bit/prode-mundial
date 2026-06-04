import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Prode Mundial 2026 | Pronósticos Deportivos",
    template: "%s | Prode Mundial",
  },
  description: "La plataforma más moderna para pronósticos del Mundial 2026. Predecí resultados, competí con tu grupo y seguí el torneo en tiempo real.",
  keywords: ["prode", "pronosticos", "mundial", "futbol", "predicciones", "2026"],
  manifest: "/manifest.json",
  themeColor: "#10b981",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Prode Mundial",
    title: "Prode Mundial 2026",
    description: "La plataforma más moderna para pronósticos del Mundial 2026.",
  },
  twitter: {
    card: "summary",
    title: "Prode Mundial 2026",
    description: "Pronósticos deportivos para el Mundial 2026.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              theme="dark"
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  background: "rgba(10, 20, 30, 0.97)",
                  border: "1px solid rgba(52,211,153,0.15)",
                  backdropFilter: "blur(20px)",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
