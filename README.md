# 🏆 Prode Mundial

**Plataforma de pronósticos deportivos premium para grupos privados.**

Diseñada para oficinas, amigos o cualquier grupo que quiera vivir el torneo al máximo. Moderna, oscura, glassmorphism, totalmente responsive.

---

## 🚀 Deploy rápido

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TU_USER/prode-mundial)

---

## ✨ Features

- **Autenticación** → Google OAuth + Magic Links (email)
- **Fase de Grupos** → Picks por partido con cierre automático
- **Fase Eliminatoria** → Bracket interactivo visual
- **Sistema de puntos** → Configurable (exacto: 3pts, ganador: 1pt, diferencia: 2pts)
- **Rankings** → Global, por etapa, histórico
- **Admin Panel** → CRUD completo, cargar resultados, recalcular puntos
- **Diseño premium** → Dark mode, glassmorphism, Framer Motion

---

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 App Router, TypeScript, TailwindCSS |
| UI | shadcn/ui, Framer Motion, Radix UI |
| Backend | Server Actions, Prisma ORM |
| DB | PostgreSQL (Neon / Supabase) |
| Auth | Auth.js v5 (Google + Magic Links) |
| Deploy | Vercel |
| CI/CD | GitHub Actions |

---

## 📦 Instalación local

### 1. Clonar el repo
```bash
git clone https://github.com/TU_USER/prode-mundial.git
cd prode-mundial
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
# Editá .env.local con tus credenciales
```

### 4. Base de datos
```bash
# Crear la DB con Neon (https://neon.tech) o Supabase
npm run db:push       # Aplicar schema
npm run db:seed       # Cargar datos de ejemplo
```

### 5. Iniciar en desarrollo
```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

---

## 🔑 Variables de entorno

```env
# Base de datos (Neon o Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth.js
AUTH_SECRET="secreto-generado-con-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="tu-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="tu-client-secret"

# Email (Resend recomendado)
AUTH_RESEND_KEY="re_..."
EMAIL_FROM="Prode Mundial <noreply@tudominio.com>"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🗄️ Base de datos

### Modelos principales
- **User** — perfil, puntos, picks, rol
- **Team** — selecciones, escudos, grupos
- **Match** — partidos, resultados, estados
- **Prediction** — pronósticos por usuario/partido
- **TournamentStage** — fases del torneo
- **ScoreRule** — reglas de puntuación
- **AppConfig** — configuración global

### Comandos
```bash
npm run db:generate    # Generar cliente Prisma
npm run db:push        # Aplicar schema (sin migración)
npm run db:migrate     # Crear migración
npm run db:studio      # Abrir Prisma Studio
npm run db:seed        # Cargar datos de ejemplo
npm run db:reset       # Reset + seed
```

---

## 🚀 Deploy en Vercel

### Automático (recomendado)
1. Conectá tu repo de GitHub a Vercel
2. Configurá las variables de entorno en el dashboard de Vercel
3. Cada push a `main` deployea automáticamente

### Manual
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 📁 Estructura del proyecto

```
prode-mundial/
├── app/                     # Next.js App Router
│   ├── (app)/               # Rutas protegidas (con navbar)
│   ├── admin/               # Panel de administración
│   ├── api/auth/            # API routes de Auth.js
│   ├── auth/                # Páginas de autenticación
│   ├── bracket/             # Fase eliminatoria
│   ├── dashboard/           # Dashboard principal
│   ├── predictions/         # Mis pronósticos
│   ├── ranking/             # Tabla de posiciones
│   └── layout.tsx           # Layout raíz
├── components/
│   ├── features/            # Componentes por feature
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── bracket/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── predictions/
│   │   └── rankings/
│   ├── layout/              # Navbar, footer, etc.
│   ├── providers/           # Context providers
│   └── ui/                  # shadcn/ui components
├── actions/                 # Server Actions
│   ├── matches.ts
│   └── predictions.ts
├── lib/
│   ├── auth.ts              # Auth.js config
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # Utilidades
├── prisma/
│   ├── schema.prisma        # Schema de la BD
│   └── seed.ts              # Datos de ejemplo
├── types/
│   └── index.ts             # Types TypeScript
└── middleware.ts            # Auth middleware
```

---

## 🔐 Sistema de roles

| Rol | Permisos |
|-----|---------|
| `USER` | Ver partidos, cargar picks, ver ranking |
| `ADMIN` | Todo lo anterior + gestionar partidos, usuarios, resultados |

---

## 📊 Sistema de puntos (configurable)

| Resultado | Puntos por defecto |
|-----------|-------------------|
| Resultado exacto (ej: 2-1 = 2-1) | **3 pts** |
| Ganador correcto + diferencia correcta | **3 pts** (1+2) |
| Solo ganador correcto | **1 pt** |
| Resultado incorrecto | **0 pts** |

---

## 🤝 Contribuir

1. Fork el repo
2. Creá una rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -m 'feat: agrego nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Abrí un Pull Request

---

## 📄 Licencia

MIT — Usá libremente para proyectos personales y comerciales.

---

## 👨‍💻 Generado con Claude

Este proyecto fue scaffoldeado con [Claude](https://claude.ai) de Anthropic.
