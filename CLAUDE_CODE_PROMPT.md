# CLAUDE CODE — PROMPT DE SETUP COMPLETO

Pegá este prompt directamente en Claude Code (terminal) dentro de la carpeta del proyecto.

---

## PROMPT PARA CLAUDE CODE

```
Sos un Staff Engineer experto en Next.js 15, TypeScript, Prisma y Vercel.
Tenés que completar el setup de esta aplicación "Prode Mundial" y deployarla en producción.
La carpeta del proyecto ya tiene todos los archivos generados. Tu trabajo es:

1. Instalar todas las dependencias
2. Instalar y configurar shadcn/ui con todos sus componentes necesarios
3. Configurar la base de datos PostgreSQL en Neon o Supabase
4. Aplicar el schema de Prisma
5. Correr el seed con datos de ejemplo
6. Verificar el build de Next.js
7. Crear el repositorio en GitHub
8. Hacer el commit inicial
9. Deployar en Vercel
10. Configurar todas las variables de entorno en Vercel
11. Verificar el deploy final

PASOS DETALLADOS:

=== PASO 1: INSTALAR DEPENDENCIAS ===

npm install

Si falla geist o alguna dependencia:
npm install geist
npm install @auth/prisma-adapter
npm install next-auth@beta

=== PASO 2: INSTALAR SHADCN/UI ===

npx shadcn@latest init -y -d

Luego instalar todos los componentes necesarios:
npx shadcn@latest add button input label badge avatar dialog dropdown-menu tabs progress select switch separator toast tooltip alert-dialog

=== PASO 3: CONFIGURAR BASE DE DATOS ===

Opción A — Neon (recomendado):
1. Ir a https://neon.tech y crear una cuenta
2. Crear un nuevo proyecto llamado "prode-mundial"
3. Copiar la connection string (formato: postgresql://user:pass@host/db?sslmode=require)
4. Crear archivo .env.local con:

DATABASE_URL="postgresql://TU_CONN_STRING"
DIRECT_URL="postgresql://TU_CONN_STRING"
AUTH_SECRET="$(openssl rand -base64 32)"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

Opción B — Supabase:
1. Ir a https://supabase.com y crear proyecto
2. En Settings > Database copiar "Connection pooling" para DATABASE_URL
3. Y "Direct connection" para DIRECT_URL

=== PASO 4: APLICAR SCHEMA PRISMA ===

npx prisma generate
npx prisma db push

Si hay errores de conexión, verificar DATABASE_URL en .env.local

=== PASO 5: CORRER SEED ===

npx tsx prisma/seed.ts

Esto crea:
- 32 selecciones del Mundial
- 6 etapas del torneo  
- 24 partidos de la fase de grupos (con resultados)
- Reglas de puntuación
- Usuarios demo: admin@prode.com y demo@prode.com

=== PASO 6: CONFIGURAR AUTH PROVIDERS ===

Para Google OAuth:
1. Ir a https://console.cloud.google.com
2. Crear proyecto "Prode Mundial"
3. APIs & Services > Credentials > Create OAuth 2.0 Client
4. Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
5. Copiar Client ID y Client Secret
6. Agregar al .env.local:
   AUTH_GOOGLE_ID="tu-client-id"
   AUTH_GOOGLE_SECRET="tu-client-secret"

Para Magic Links (Resend recomendado):
1. Ir a https://resend.com y crear cuenta
2. Crear API key
3. Agregar al .env.local:
   AUTH_RESEND_KEY="re_..."
   EMAIL_FROM="Prode Mundial <noreply@tudominio.com>"

Alternativa sin Resend - usar nodemailer con Gmail:
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="tu@gmail.com"
   EMAIL_SERVER_PASSWORD="tu-app-password"
   EMAIL_FROM="Prode Mundial <tu@gmail.com>"

=== PASO 7: VERIFICAR BUILD LOCAL ===

npm run type-check
npm run lint
npm run build

Errores comunes y soluciones:
- "Cannot find module 'geist'" → npm install geist
- "Auth configuration" → Verificar AUTH_SECRET en .env.local
- Prisma errors → npx prisma generate

=== PASO 8: TESTEAR EN DESARROLLO ===

npm run dev

Verificar:
- http://localhost:3000 → Landing page
- http://localhost:3000/auth/login → Login
- http://localhost:3000/dashboard → Dashboard (requiere auth)
- http://localhost:3000/ranking → Ranking
- http://localhost:3000/admin → Admin panel (solo admin)

=== PASO 9: CREAR REPOSITORIO GITHUB ===

git init
git add .
git commit -m "feat: initial commit - Prode Mundial platform

- Next.js 15 App Router + TypeScript
- Auth.js with Google OAuth + Magic Links
- Prisma ORM + PostgreSQL schema
- Dashboard, Rankings, Predictions, Bracket
- Admin panel with full CRUD
- Glassmorphism dark design with Framer Motion
- 32 teams, 6 stages, group phase matches seeded"

gh repo create prode-mundial --public --source=. --remote=origin --push

Si no tenés gh CLI:
git remote add origin https://github.com/TU_USUARIO/prode-mundial.git
git branch -M main
git push -u origin main

=== PASO 10: DEPLOY EN VERCEL ===

Instalar Vercel CLI si no está:
npm install -g vercel

Login:
vercel login

Deploy inicial (seguir el wizard):
vercel

Para producción:
vercel --prod

=== PASO 11: CONFIGURAR VARS EN VERCEL ===

Opción A - Dashboard (recomendado):
Ir a https://vercel.com/dashboard → tu-proyecto → Settings → Environment Variables

Agregar TODAS estas variables:
- DATABASE_URL
- DIRECT_URL  
- AUTH_SECRET
- AUTH_URL (poner la URL de Vercel: https://tu-proyecto.vercel.app)
- AUTH_GOOGLE_ID
- AUTH_GOOGLE_SECRET
- AUTH_RESEND_KEY (o las vars de SMTP)
- EMAIL_FROM
- NEXT_PUBLIC_APP_URL (la URL de Vercel)

Opción B - CLI:
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production
# etc.

=== PASO 12: CONFIGURAR GOOGLE OAUTH PARA PRODUCCIÓN ===

En Google Cloud Console:
1. Ir al OAuth 2.0 Client creado
2. Agregar en "Authorized redirect URIs":
   https://tu-proyecto.vercel.app/api/auth/callback/google
3. Guardar

=== PASO 13: REDEPLOY FINAL ===

Después de configurar todas las vars:
vercel --prod

O hacer push a main (si configuraste auto-deploy):
git add .
git commit -m "chore: add production config"
git push origin main

=== PASO 14: APLICAR SCHEMA EN PRODUCCIÓN ===

Con la DATABASE_URL de producción:
npx prisma migrate deploy
npx tsx prisma/seed.ts

O desde Vercel, en el dashboard del proyecto → Settings → Functions → Run command

=== VERIFICACIÓN FINAL ===

Después del deploy verificar:
1. https://tu-proyecto.vercel.app → Landing
2. https://tu-proyecto.vercel.app/auth/login → Login con Google
3. Ingresar y verificar dashboard
4. Verificar que los partidos aparecen
5. Ingresar como admin y verificar /admin

=== CREDENCIALES DEMO ===

Admin: admin@prode.com (necesita magic link o Google)
Usuario: demo@prode.com (necesita magic link o Google)

Para convertir un usuario en admin desde Prisma Studio:
npx prisma studio
→ User → encontrar usuario → cambiar role a ADMIN

=== COMANDOS ÚTILES ===

# Ver base de datos
npx prisma studio

# Recalcular todos los puntos
npx tsx scripts/recalculate-all.ts

# Agregar más partidos
# Editar prisma/seed.ts y correr: npx tsx prisma/seed.ts

# Ver logs en Vercel
vercel logs tu-proyecto.vercel.app

=== TROUBLESHOOTING ===

Error: "PrismaClientInitializationError"
→ Verificar DATABASE_URL, debe incluir ?sslmode=require para Neon/Supabase

Error: "AUTH_SECRET not set"  
→ Agregar AUTH_SECRET a .env.local (usa: openssl rand -base64 32)

Error: "Cannot read properties of null (reading 'user')"
→ Verificar middleware.ts y que AUTH_URL sea correcto

Error de build: "Type error"
→ npm run type-check para ver los errores específicos

Error: "Module not found: geist"
→ npm install geist

Build lento en Vercel:
→ Normal para primer build, ~3-5 min

=== SIGUIENTE PASOS OPCIONALES ===

1. Configurar dominio custom en Vercel
2. Agregar más partidos/equipos desde el admin
3. Personalizar reglas de puntuación en /admin/config
4. Compartir el link con tu grupo
5. Cuando arranquen los partidos: cargar resultados desde /admin/matches
   y hacer click en "Recalcular" para actualizar los puntos

¡Listo! Tu prode está deployado y funcionando 🏆
```

---

## CHECKLIST PRE-LAUNCH

- [ ] Base de datos conectada (Neon o Supabase)
- [ ] `npx prisma db push` ejecutado sin errores
- [ ] `npx tsx prisma/seed.ts` ejecutado
- [ ] Google OAuth configurado
- [ ] Email (magic links) configurado  
- [ ] `npm run build` sin errores
- [ ] Repo en GitHub creado
- [ ] Deploy en Vercel exitoso
- [ ] Variables de entorno en Vercel configuradas
- [ ] URL de producción funcionando
- [ ] Login con Google funciona en producción
- [ ] Admin panel accesible

---

## ESTRUCTURA FINAL DEL PROYECTO

```
prode-mundial/
├── .github/workflows/ci.yml     # CI/CD
├── .env.example                  # Template de variables
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── app/
│   ├── (app)/layout.tsx          # Layout protegido con navbar
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   └── matches/page.tsx      # Gestión de partidos
│   ├── api/auth/[...nextauth]/route.ts
│   ├── auth/login/page.tsx
│   ├── auth/verify/page.tsx
│   ├── bracket/page.tsx
│   ├── dashboard/page.tsx
│   ├── predictions/page.tsx
│   ├── ranking/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Landing
├── actions/
│   ├── matches.ts
│   └── predictions.ts
├── components/
│   ├── features/
│   │   ├── admin/
│   │   ├── auth/login-form.tsx
│   │   ├── bracket/bracket-view.tsx
│   │   ├── dashboard/dashboard-view.tsx
│   │   ├── landing/landing-page.tsx
│   │   ├── predictions/predictions-view.tsx
│   │   └── rankings/ranking-view.tsx
│   ├── layout/
│   │   ├── app-layout.tsx
│   │   └── navbar.tsx
│   ├── providers/
│   │   ├── auth-provider.tsx
│   │   └── theme-provider.tsx
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── middleware.ts
├── next.config.ts
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── tailwind.config.ts
├── tsconfig.json
└── types/index.ts
```
