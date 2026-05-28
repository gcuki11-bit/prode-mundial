import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Prode Mundial | Pronósticos Deportivos",
    template: "%s | Prode Mundial",
  },
  description: "La mejor plataforma de pronósticos deportivos para tu grupo. Predecí resultados, competí con amigos y ganá premios.",
  keywords: ["prode", "pronosticos", "mundial", "futbol", "predicciones"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Prode Mundial",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
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
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
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
