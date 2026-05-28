import { PrismaClient, TournamentStageType, MatchStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// MUNDIAL 2026 - USA / CANADA / MEXICO
// 48 selecciones — 12 grupos de 4
// Sorteo realizado el 5 de diciembre de 2025 en Washington D.C.
// ============================================================

const TEAMS = [
  // GRUPO A
  { name: "México", shortName: "MEX", code: "MEX", group: "A", primaryColor: "#006847", secondaryColor: "#CE1126", flagUrl: "https://flagcdn.com/mx.svg", confederation: "CONCACAF" },
  { name: "Sudáfrica", shortName: "RSA", code: "RSA", group: "A", primaryColor: "#007A4D", secondaryColor: "#FFB81C", flagUrl: "https://flagcdn.com/za.svg", confederation: "CAF" },
  { name: "Corea del Sur", shortName: "KOR", code: "KOR", group: "A", primaryColor: "#CD2E3A", secondaryColor: "#0047A0", flagUrl: "https://flagcdn.com/kr.svg", confederation: "AFC" },
  { name: "Rep. Checa", shortName: "CZE", code: "CZE", group: "A", primaryColor: "#D7141A", secondaryColor: "#11457E", flagUrl: "https://flagcdn.com/cz.svg", confederation: "UEFA" },

  // GRUPO B
  { name: "Canadá", shortName: "CAN", code: "CAN", group: "B", primaryColor: "#FF0000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/ca.svg", confederation: "CONCACAF" },
  { name: "Qatar", shortName: "QAT", code: "QAT", group: "B", primaryColor: "#8B0000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/qa.svg", confederation: "AFC" },
  { name: "Suiza", shortName: "SUI", code: "SUI", group: "B", primaryColor: "#FF0000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/ch.svg", confederation: "UEFA" },
  { name: "Bosnia", shortName: "BIH", code: "BIH", group: "B", primaryColor: "#002395", secondaryColor: "#FFCD00", flagUrl: "https://flagcdn.com/ba.svg", confederation: "UEFA" },

  // GRUPO C
  { name: "Brasil", shortName: "BRA", code: "BRA", group: "C", primaryColor: "#009C3B", secondaryColor: "#FFDF00", flagUrl: "https://flagcdn.com/br.svg", confederation: "CONMEBOL" },
  { name: "Marruecos", shortName: "MAR", code: "MAR", group: "C", primaryColor: "#C1272D", secondaryColor: "#006233", flagUrl: "https://flagcdn.com/ma.svg", confederation: "CAF" },
  { name: "Escocia", shortName: "SCO", code: "SCO", group: "C", primaryColor: "#003399", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/gb-sct.svg", confederation: "UEFA" },
  { name: "Haití", shortName: "HAI", code: "HAI", group: "C", primaryColor: "#00209F", secondaryColor: "#D21034", flagUrl: "https://flagcdn.com/ht.svg", confederation: "CONCACAF" },

  // GRUPO D
  { name: "Estados Unidos", shortName: "USA", code: "USA", group: "D", primaryColor: "#002868", secondaryColor: "#BF0A30", flagUrl: "https://flagcdn.com/us.svg", confederation: "CONCACAF" },
  { name: "Paraguay", shortName: "PAR", code: "PAR", group: "D", primaryColor: "#D52B1E", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/py.svg", confederation: "CONMEBOL" },
  { name: "Australia", shortName: "AUS", code: "AUS", group: "D", primaryColor: "#00843D", secondaryColor: "#FFCD00", flagUrl: "https://flagcdn.com/au.svg", confederation: "AFC" },
  { name: "Turquía", shortName: "TUR", code: "TUR", group: "D", primaryColor: "#E30A17", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/tr.svg", confederation: "UEFA" },

  // GRUPO E
  { name: "Alemania", shortName: "GER", code: "GER", group: "E", primaryColor: "#000000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/de.svg", confederation: "UEFA" },
  { name: "Ecuador", shortName: "ECU", code: "ECU", group: "E", primaryColor: "#FFD700", secondaryColor: "#0000CD", flagUrl: "https://flagcdn.com/ec.svg", confederation: "CONMEBOL" },
  { name: "Costa de Marfil", shortName: "CIV", code: "CIV", group: "E", primaryColor: "#F77F00", secondaryColor: "#009A44", flagUrl: "https://flagcdn.com/ci.svg", confederation: "CAF" },
  { name: "Curazao", shortName: "CUW", code: "CUW", group: "E", primaryColor: "#003DA5", secondaryColor: "#F9E300", flagUrl: "https://flagcdn.com/cw.svg", confederation: "CONCACAF" },

  // GRUPO F
  { name: "Países Bajos", shortName: "NED", code: "NED", group: "F", primaryColor: "#FF6600", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/nl.svg", confederation: "UEFA" },
  { name: "Japón", shortName: "JPN", code: "JPN", group: "F", primaryColor: "#BC002D", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/jp.svg", confederation: "AFC" },
  { name: "Túnez", shortName: "TUN", code: "TUN", group: "F", primaryColor: "#E70013", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/tn.svg", confederation: "CAF" },
  { name: "Suecia", shortName: "SWE", code: "SWE", group: "F", primaryColor: "#006AA7", secondaryColor: "#FECC00", flagUrl: "https://flagcdn.com/se.svg", confederation: "UEFA" },

  // GRUPO G
  { name: "Bélgica", shortName: "BEL", code: "BEL", group: "G", primaryColor: "#EF3340", secondaryColor: "#000000", flagUrl: "https://flagcdn.com/be.svg", confederation: "UEFA" },
  { name: "Irán", shortName: "IRN", code: "IRN", group: "G", primaryColor: "#239f40", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/ir.svg", confederation: "AFC" },
  { name: "Egipto", shortName: "EGY", code: "EGY", group: "G", primaryColor: "#CE1126", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/eg.svg", confederation: "CAF" },
  { name: "Nueva Zelanda", shortName: "NZL", code: "NZL", group: "G", primaryColor: "#000000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/nz.svg", confederation: "OFC" },

  // GRUPO H
  { name: "España", shortName: "ESP", code: "ESP", group: "H", primaryColor: "#AA151B", secondaryColor: "#F1BF00", flagUrl: "https://flagcdn.com/es.svg", confederation: "UEFA" },
  { name: "Uruguay", shortName: "URU", code: "URU", group: "H", primaryColor: "#75AADB", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/uy.svg", confederation: "CONMEBOL" },
  { name: "Arabia Saudita", shortName: "KSA", code: "KSA", group: "H", primaryColor: "#006600", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/sa.svg", confederation: "AFC" },
  { name: "Cabo Verde", shortName: "CPV", code: "CPV", group: "H", primaryColor: "#003893", secondaryColor: "#CF2027", flagUrl: "https://flagcdn.com/cv.svg", confederation: "CAF" },

  // GRUPO I
  { name: "Francia", shortName: "FRA", code: "FRA", group: "I", primaryColor: "#002395", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/fr.svg", confederation: "UEFA" },
  { name: "Senegal", shortName: "SEN", code: "SEN", group: "I", primaryColor: "#00853F", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/sn.svg", confederation: "CAF" },
  { name: "Noruega", shortName: "NOR", code: "NOR", group: "I", primaryColor: "#EF2B2D", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/no.svg", confederation: "UEFA" },
  { name: "Irak", shortName: "IRQ", code: "IRQ", group: "I", primaryColor: "#CE1126", secondaryColor: "#007A3D", flagUrl: "https://flagcdn.com/iq.svg", confederation: "AFC" },

  // GRUPO J
  { name: "Argentina", shortName: "ARG", code: "ARG", group: "J", primaryColor: "#74ACDF", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/ar.svg", confederation: "CONMEBOL" },
  { name: "Austria", shortName: "AUT", code: "AUT", group: "J", primaryColor: "#ED2939", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/at.svg", confederation: "UEFA" },
  { name: "Argelia", shortName: "ALG", code: "ALG", group: "J", primaryColor: "#006233", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/dz.svg", confederation: "CAF" },
  { name: "Jordania", shortName: "JOR", code: "JOR", group: "J", primaryColor: "#007A3D", secondaryColor: "#CE1126", flagUrl: "https://flagcdn.com/jo.svg", confederation: "AFC" },

  // GRUPO K
  { name: "Portugal", shortName: "POR", code: "POR", group: "K", primaryColor: "#006600", secondaryColor: "#FF0000", flagUrl: "https://flagcdn.com/pt.svg", confederation: "UEFA" },
  { name: "Colombia", shortName: "COL", code: "COL", group: "K", primaryColor: "#FCD116", secondaryColor: "#003087", flagUrl: "https://flagcdn.com/co.svg", confederation: "CONMEBOL" },
  { name: "Uzbekistán", shortName: "UZB", code: "UZB", group: "K", primaryColor: "#1EB53A", secondaryColor: "#CE1126", flagUrl: "https://flagcdn.com/uz.svg", confederation: "AFC" },
  { name: "Rep. D. Congo", shortName: "COD", code: "COD", group: "K", primaryColor: "#007FFF", secondaryColor: "#CE1126", flagUrl: "https://flagcdn.com/cd.svg", confederation: "CAF" },

  // GRUPO L
  { name: "Inglaterra", shortName: "ENG", code: "ENG", group: "L", primaryColor: "#FFFFFF", secondaryColor: "#003399", flagUrl: "https://flagcdn.com/gb-eng.svg", confederation: "UEFA" },
  { name: "Croacia", shortName: "CRO", code: "CRO", group: "L", primaryColor: "#FF0000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/hr.svg", confederation: "UEFA" },
  { name: "Ghana", shortName: "GHA", code: "GHA", group: "L", primaryColor: "#006B3F", secondaryColor: "#FCD116", flagUrl: "https://flagcdn.com/gh.svg", confederation: "CAF" },
  { name: "Panamá", shortName: "PAN", code: "PAN", group: "L", primaryColor: "#DA121A", secondaryColor: "#005293", flagUrl: "https://flagcdn.com/pa.svg", confederation: "CONCACAF" },
];

const STAGES = [
  { name: "Fase de Grupos", type: TournamentStageType.GROUP, order: 1 },
  { name: "Dieciseisavos de Final", type: TournamentStageType.ROUND_OF_16, order: 2 },
  { name: "Octavos de Final", type: TournamentStageType.QUARTER_FINAL, order: 3 },
  { name: "Cuartos de Final", type: TournamentStageType.SEMI_FINAL, order: 4 },
  { name: "Semifinales", type: TournamentStageType.THIRD_PLACE, order: 5 },
  { name: "Final", type: TournamentStageType.FINAL, order: 6 },
];

async function main() {
  console.log("🌱 Iniciando seed — Mundial 2026...");

  await prisma.prediction.deleteMany();
  await prisma.rankingSnapshot.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();
  await prisma.tournamentStage.deleteMany();
  await prisma.scoreRule.deleteMany();
  await prisma.appConfig.deleteMany();
  console.log("🗑️  Datos anteriores eliminados");

  const teams = await Promise.all(TEAMS.map((t) => prisma.team.create({ data: t })));
  console.log(`✅ ${teams.length} selecciones creadas`);

  const stages = await Promise.all(STAGES.map((s) => prisma.tournamentStage.create({ data: s })));
  console.log(`✅ ${stages.length} etapas creadas`);

  const getTeam = (code: string) => {
    const t = teams.find((t) => t.code === code);
    if (!t) throw new Error(`Team not found: ${code}`);
    return t;
  };
  const groupStage = stages.find((s) => s.type === TournamentStageType.GROUP)!;

  // Generamos todos los partidos de fase de grupos
  // Cada grupo tiene 4 equipos → 6 partidos por grupo → 72 partidos en total
  const GROUPS: { group: string; teams: string[]; startDate: string }[] = [
    { group: "A", teams: ["MEX", "RSA", "KOR", "CZE"],  startDate: "2026-06-11" },
    { group: "B", teams: ["CAN", "QAT", "SUI", "BIH"],  startDate: "2026-06-12" },
    { group: "C", teams: ["BRA", "MAR", "SCO", "HAI"],  startDate: "2026-06-12" },
    { group: "D", teams: ["USA", "PAR", "AUS", "TUR"],  startDate: "2026-06-13" },
    { group: "E", teams: ["GER", "ECU", "CIV", "CUW"],  startDate: "2026-06-13" },
    { group: "F", teams: ["NED", "JPN", "TUN", "SWE"],  startDate: "2026-06-14" },
    { group: "G", teams: ["BEL", "IRN", "EGY", "NZL"],  startDate: "2026-06-14" },
    { group: "H", teams: ["ESP", "URU", "KSA", "CPV"],  startDate: "2026-06-15" },
    { group: "I", teams: ["FRA", "SEN", "NOR", "IRQ"],  startDate: "2026-06-15" },
    { group: "J", teams: ["ARG", "AUT", "ALG", "JOR"],  startDate: "2026-06-16" },
    { group: "K", teams: ["POR", "COL", "UZB", "COD"],  startDate: "2026-06-16" },
    { group: "L", teams: ["ENG", "CRO", "GHA", "PAN"],  startDate: "2026-06-17" },
  ];

  let matchNumber = 1;
  const matchesToCreate: Parameters<typeof prisma.match.create>[0]["data"][] = [];

  for (const g of GROUPS) {
    const [t1, t2, t3, t4] = g.teams;
    const base = new Date(g.startDate);
    const day2 = new Date(base); day2.setDate(base.getDate() + 7);
    const day3 = new Date(base); day3.setDate(base.getDate() + 14);

    // Jornada 1: t1 vs t2, t3 vs t4
    matchesToCreate.push({
      matchNumber: matchNumber++,
      stageId: groupStage.id,
      homeTeamId: getTeam(t1).id,
      awayTeamId: getTeam(t2).id,
      scheduledAt: new Date(base.setHours(15, 0, 0, 0)),
      groupName: g.group,
      venue: "Por definir",
      status: MatchStatus.UPCOMING,
      isLocked: false,
    });
    matchesToCreate.push({
      matchNumber: matchNumber++,
      stageId: groupStage.id,
      homeTeamId: getTeam(t3).id,
      awayTeamId: getTeam(t4).id,
      scheduledAt: new Date(new Date(g.startDate).setHours(19, 0, 0, 0)),
      groupName: g.group,
      venue: "Por definir",
      status: MatchStatus.UPCOMING,
      isLocked: false,
    });

    // Jornada 2: t1 vs t3, t2 vs t4
    matchesToCreate.push({
      matchNumber: matchNumber++,
      stageId: groupStage.id,
      homeTeamId: getTeam(t1).id,
      awayTeamId: getTeam(t3).id,
      scheduledAt: new Date(day2.setHours(15, 0, 0, 0)),
      groupName: g.group,
      venue: "Por definir",
      status: MatchStatus.UPCOMING,
      isLocked: false,
    });
    matchesToCreate.push({
      matchNumber: matchNumber++,
      stageId: groupStage.id,
      homeTeamId: getTeam(t2).id,
      awayTeamId: getTeam(t4).id,
      scheduledAt: new Date(new Date(g.startDate).setHours(19, 0, 0, 0) + 7 * 86400000),
      groupName: g.group,
      venue: "Por definir",
      status: MatchStatus.UPCOMING,
      isLocked: false,
    });

    // Jornada 3 (simultáneos): t1 vs t4, t2 vs t3
    matchesToCreate.push({
      matchNumber: matchNumber++,
      stageId: groupStage.id,
      homeTeamId: getTeam(t1).id,
      awayTeamId: getTeam(t4).id,
      scheduledAt: new Date(day3.setHours(19, 0, 0, 0)),
      groupName: g.group,
      venue: "Por definir",
      status: MatchStatus.UPCOMING,
      isLocked: false,
    });
    matchesToCreate.push({
      matchNumber: matchNumber++,
      stageId: groupStage.id,
      homeTeamId: getTeam(t2).id,
      awayTeamId: getTeam(t3).id,
      scheduledAt: new Date(new Date(g.startDate).setHours(19, 0, 0, 0) + 14 * 86400000),
      groupName: g.group,
      venue: "Por definir",
      status: MatchStatus.UPCOMING,
      isLocked: false,
    });
  }

  await Promise.all(matchesToCreate.map((data) => prisma.match.create({ data })));
  console.log(`✅ ${matchesToCreate.length} partidos de fase de grupos creados (72 partidos, 6 por grupo)`);

  // Reglas de puntuación
  await prisma.scoreRule.create({
    data: {
      name: "Reglas Estándar Mundial 2026",
      description: "Sistema de puntuación estándar: exacto 3pts, ganador 1pt, diferencia 2pts",
      exactScore: 3,
      correctResult: 1,
      goalDifference: 2,
      isActive: true,
    },
  });
  console.log("✅ Reglas de puntuación creadas");

  // Configuración de la app
  const configs = [
    { key: "app_name", value: "Prode Mundial 2026", description: "Nombre de la aplicación" },
    { key: "tournament_name", value: "Copa del Mundo USA·CAN·MEX 2026", description: "Nombre del torneo" },
    { key: "tournament_start", value: "2026-06-11", description: "Fecha de inicio" },
    { key: "tournament_end", value: "2026-07-19", description: "Fecha de fin (final en MetLife Stadium)" },
    { key: "registration_open", value: "true", description: "Registro de nuevos usuarios" },
    { key: "picks_locked_globally", value: "false", description: "Bloqueo global de todos los picks" },
    { key: "show_other_picks", value: "false", description: "Mostrar picks de otros antes del cierre" },
    { key: "max_users", value: "100", description: "Máximo usuarios permitidos" },
    { key: "total_teams", value: "48", description: "Total de selecciones participantes" },
    { key: "total_groups", value: "12", description: "Total de grupos (A-L)" },
    { key: "total_matches_group", value: "72", description: "Partidos en fase de grupos" },
    { key: "total_matches_knockout", value: "32", description: "Partidos en fases eliminatorias (16+8+4+2+1+1)" },
  ];

  await Promise.all(configs.map((c) => prisma.appConfig.create({ data: c })));
  console.log(`✅ ${configs.length} configuraciones de app creadas`);

  // Usuarios demo
  await prisma.user.create({
    data: {
      email: "admin@prode.com",
      name: "Administrador",
      username: "admin",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  await prisma.user.create({
    data: {
      email: "demo@prode.com",
      name: "Usuario Demo",
      username: "demo_user",
      role: UserRole.USER,
      emailVerified: new Date(),
      favoriteTeamId: teams.find((t) => t.code === "ARG")?.id,
    },
  });

  console.log("✅ Usuarios demo creados");

  console.log("\n🏆 ===== SEED MUNDIAL 2026 COMPLETADO =====");
  console.log(`📊 Resumen:`);
  console.log(`   • 48 selecciones (grupos A-L)`);
  console.log(`   • 12 grupos de 4 equipos`);
  console.log(`   • 72 partidos de fase de grupos`);
  console.log(`   • Fechas: 11 Jun — 19 Jul 2026`);
  console.log(`\n👤 Credenciales demo:`);
  console.log(`   • admin@prode.com  → rol ADMIN`);
  console.log(`   • demo@prode.com   → rol USER`);
  console.log(`\n🚀 Ahora corré: npm run dev`);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
