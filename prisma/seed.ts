import { PrismaClient, TournamentStageType, MatchStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// MUNDIAL 2026 - USA / CANADA / MEXICO
// 48 selecciones — 12 grupos de 4
// Sorteo oficial FIFA — diciembre 2025, Washington D.C.
// Grupos verificados: A-L
// ============================================================

const TEAMS = [
  // GRUPO A
  { name: "México", shortName: "MEX", code: "MEX", group: "A", primaryColor: "#006847", secondaryColor: "#CE1126", flagUrl: "https://flagcdn.com/mx.svg", confederation: "CONCACAF" },
  { name: "Sudáfrica", shortName: "RSA", code: "RSA", group: "A", primaryColor: "#007A4D", secondaryColor: "#FFB81C", flagUrl: "https://flagcdn.com/za.svg", confederation: "CAF" },
  { name: "Corea del Sur", shortName: "KOR", code: "KOR", group: "A", primaryColor: "#CD2E3A", secondaryColor: "#0047A0", flagUrl: "https://flagcdn.com/kr.svg", confederation: "AFC" },
  { name: "Rep. Checa", shortName: "CZE", code: "CZE", group: "A", primaryColor: "#D7141A", secondaryColor: "#11457E", flagUrl: "https://flagcdn.com/cz.svg", confederation: "UEFA" },

  // GRUPO B
  { name: "Canadá", shortName: "CAN", code: "CAN", group: "B", primaryColor: "#FF0000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/ca.svg", confederation: "CONCACAF" },
  { name: "Bosnia", shortName: "BIH", code: "BIH", group: "B", primaryColor: "#002395", secondaryColor: "#FFCD00", flagUrl: "https://flagcdn.com/ba.svg", confederation: "UEFA" },
  { name: "Qatar", shortName: "QAT", code: "QAT", group: "B", primaryColor: "#8B0000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/qa.svg", confederation: "AFC" },
  { name: "Suiza", shortName: "SUI", code: "SUI", group: "B", primaryColor: "#FF0000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/ch.svg", confederation: "UEFA" },

  // GRUPO C
  { name: "Brasil", shortName: "BRA", code: "BRA", group: "C", primaryColor: "#009C3B", secondaryColor: "#FFDF00", flagUrl: "https://flagcdn.com/br.svg", confederation: "CONMEBOL" },
  { name: "Marruecos", shortName: "MAR", code: "MAR", group: "C", primaryColor: "#C1272D", secondaryColor: "#006233", flagUrl: "https://flagcdn.com/ma.svg", confederation: "CAF" },
  { name: "Haití", shortName: "HAI", code: "HAI", group: "C", primaryColor: "#00209F", secondaryColor: "#D21034", flagUrl: "https://flagcdn.com/ht.svg", confederation: "CONCACAF" },
  { name: "Escocia", shortName: "SCO", code: "SCO", group: "C", primaryColor: "#003399", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/gb-sct.svg", confederation: "UEFA" },

  // GRUPO D
  { name: "Estados Unidos", shortName: "USA", code: "USA", group: "D", primaryColor: "#002868", secondaryColor: "#BF0A30", flagUrl: "https://flagcdn.com/us.svg", confederation: "CONCACAF" },
  { name: "Paraguay", shortName: "PAR", code: "PAR", group: "D", primaryColor: "#D52B1E", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/py.svg", confederation: "CONMEBOL" },
  { name: "Australia", shortName: "AUS", code: "AUS", group: "D", primaryColor: "#00843D", secondaryColor: "#FFCD00", flagUrl: "https://flagcdn.com/au.svg", confederation: "AFC" },
  { name: "Turquía", shortName: "TUR", code: "TUR", group: "D", primaryColor: "#E30A17", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/tr.svg", confederation: "UEFA" },

  // GRUPO E
  { name: "Alemania", shortName: "GER", code: "GER", group: "E", primaryColor: "#000000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/de.svg", confederation: "UEFA" },
  { name: "Curazao", shortName: "CUR", code: "CUR", group: "E", primaryColor: "#003DA5", secondaryColor: "#F9E300", flagUrl: "https://flagcdn.com/cw.svg", confederation: "CONCACAF" },
  { name: "Costa de Marfil", shortName: "CIV", code: "CIV", group: "E", primaryColor: "#F77F00", secondaryColor: "#009A44", flagUrl: "https://flagcdn.com/ci.svg", confederation: "CAF" },
  { name: "Ecuador", shortName: "ECU", code: "ECU", group: "E", primaryColor: "#FFD700", secondaryColor: "#0000CD", flagUrl: "https://flagcdn.com/ec.svg", confederation: "CONMEBOL" },

  // GRUPO F
  { name: "Países Bajos", shortName: "NED", code: "NED", group: "F", primaryColor: "#FF6600", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/nl.svg", confederation: "UEFA" },
  { name: "Japón", shortName: "JPN", code: "JPN", group: "F", primaryColor: "#BC002D", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/jp.svg", confederation: "AFC" },
  { name: "Suecia", shortName: "SWE", code: "SWE", group: "F", primaryColor: "#006AA7", secondaryColor: "#FECC00", flagUrl: "https://flagcdn.com/se.svg", confederation: "UEFA" },
  { name: "Túnez", shortName: "TUN", code: "TUN", group: "F", primaryColor: "#E70013", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/tn.svg", confederation: "CAF" },

  // GRUPO G
  { name: "Bélgica", shortName: "BEL", code: "BEL", group: "G", primaryColor: "#EF3340", secondaryColor: "#000000", flagUrl: "https://flagcdn.com/be.svg", confederation: "UEFA" },
  { name: "Egipto", shortName: "EGY", code: "EGY", group: "G", primaryColor: "#CE1126", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/eg.svg", confederation: "CAF" },
  { name: "Irán", shortName: "IRA", code: "IRA", group: "G", primaryColor: "#239f40", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/ir.svg", confederation: "AFC" },
  { name: "Nueva Zelanda", shortName: "NZL", code: "NZL", group: "G", primaryColor: "#000000", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/nz.svg", confederation: "OFC" },

  // GRUPO H
  { name: "España", shortName: "ESP", code: "ESP", group: "H", primaryColor: "#AA151B", secondaryColor: "#F1BF00", flagUrl: "https://flagcdn.com/es.svg", confederation: "UEFA" },
  { name: "Cabo Verde", shortName: "CPV", code: "CPV", group: "H", primaryColor: "#003893", secondaryColor: "#CF2027", flagUrl: "https://flagcdn.com/cv.svg", confederation: "CAF" },
  { name: "Arabia Saudita", shortName: "SAU", code: "SAU", group: "H", primaryColor: "#006600", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/sa.svg", confederation: "AFC" },
  { name: "Uruguay", shortName: "URU", code: "URU", group: "H", primaryColor: "#75AADB", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/uy.svg", confederation: "CONMEBOL" },

  // GRUPO I
  { name: "Francia", shortName: "FRA", code: "FRA", group: "I", primaryColor: "#002395", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/fr.svg", confederation: "UEFA" },
  { name: "Senegal", shortName: "SEN", code: "SEN", group: "I", primaryColor: "#00853F", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/sn.svg", confederation: "CAF" },
  { name: "Iraq", shortName: "IRQ", code: "IRQ", group: "I", primaryColor: "#CE1126", secondaryColor: "#007A3D", flagUrl: "https://flagcdn.com/iq.svg", confederation: "AFC" },
  { name: "Noruega", shortName: "NOR", code: "NOR", group: "I", primaryColor: "#EF2B2D", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/no.svg", confederation: "UEFA" },

  // GRUPO J
  { name: "Argentina", shortName: "ARG", code: "ARG", group: "J", primaryColor: "#74ACDF", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/ar.svg", confederation: "CONMEBOL" },
  { name: "Argelia", shortName: "ALG", code: "ALG", group: "J", primaryColor: "#006233", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/dz.svg", confederation: "CAF" },
  { name: "Austria", shortName: "AUT", code: "AUT", group: "J", primaryColor: "#ED2939", secondaryColor: "#FFFFFF", flagUrl: "https://flagcdn.com/at.svg", confederation: "UEFA" },
  { name: "Jordania", shortName: "JOR", code: "JOR", group: "J", primaryColor: "#007A3D", secondaryColor: "#CE1126", flagUrl: "https://flagcdn.com/jo.svg", confederation: "AFC" },

  // GRUPO K
  { name: "Portugal", shortName: "POR", code: "POR", group: "K", primaryColor: "#006600", secondaryColor: "#FF0000", flagUrl: "https://flagcdn.com/pt.svg", confederation: "UEFA" },
  { name: "DR Congo", shortName: "RDC", code: "RDC", group: "K", primaryColor: "#007FFF", secondaryColor: "#CE1126", flagUrl: "https://flagcdn.com/cd.svg", confederation: "CAF" },
  { name: "Uzbekistán", shortName: "UZB", code: "UZB", group: "K", primaryColor: "#1EB53A", secondaryColor: "#CE1126", flagUrl: "https://flagcdn.com/uz.svg", confederation: "AFC" },
  { name: "Colombia", shortName: "COL", code: "COL", group: "K", primaryColor: "#FCD116", secondaryColor: "#003087", flagUrl: "https://flagcdn.com/co.svg", confederation: "CONMEBOL" },

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

// 72 partidos de fase de grupos — grupos A-L verificados (fuente: Wikipedia/FIFA)
// Horarios en UTC-5 (hora del este — Nueva York/Miami)
const FIXTURES: { matchNumber: number; group: string; home: string; away: string; date: string; venue: string }[] = [
  // GRUPO A — México, Sudáfrica, Corea del Sur, Rep. Checa
  { matchNumber:  1, group: "A", home: "MEX", away: "RSA", date: "2026-06-11T15:00:00", venue: "Ciudad de México" },
  { matchNumber:  2, group: "A", home: "KOR", away: "CZE", date: "2026-06-11T19:00:00", venue: "Guadalajara" },
  { matchNumber:  3, group: "A", home: "CZE", away: "RSA", date: "2026-06-18T15:00:00", venue: "Atlanta" },
  { matchNumber:  4, group: "A", home: "MEX", away: "KOR", date: "2026-06-18T19:00:00", venue: "Guadalajara" },
  { matchNumber:  5, group: "A", home: "CZE", away: "MEX", date: "2026-06-24T15:00:00", venue: "Ciudad de México" },
  { matchNumber:  6, group: "A", home: "RSA", away: "KOR", date: "2026-06-24T19:00:00", venue: "Monterrey" },

  // GRUPO B — Canadá, Bosnia-Herzegovina, Qatar, Suiza
  { matchNumber:  7, group: "B", home: "CAN", away: "BIH", date: "2026-06-12T15:00:00", venue: "Toronto" },
  { matchNumber:  8, group: "B", home: "QAT", away: "SUI", date: "2026-06-13T15:00:00", venue: "San Francisco" },
  { matchNumber:  9, group: "B", home: "SUI", away: "BIH", date: "2026-06-18T15:00:00", venue: "Los Ángeles" },
  { matchNumber: 10, group: "B", home: "CAN", away: "QAT", date: "2026-06-18T19:00:00", venue: "Vancouver" },
  { matchNumber: 11, group: "B", home: "SUI", away: "CAN", date: "2026-06-24T15:00:00", venue: "Vancouver" },
  { matchNumber: 12, group: "B", home: "BIH", away: "QAT", date: "2026-06-24T19:00:00", venue: "Seattle" },

  // GRUPO C — Brasil, Marruecos, Haití, Escocia
  { matchNumber: 13, group: "C", home: "BRA", away: "MAR", date: "2026-06-13T19:00:00", venue: "Nueva York" },
  { matchNumber: 14, group: "C", home: "HAI", away: "SCO", date: "2026-06-13T22:00:00", venue: "Boston" },
  { matchNumber: 15, group: "C", home: "SCO", away: "MAR", date: "2026-06-19T15:00:00", venue: "Boston" },
  { matchNumber: 16, group: "C", home: "BRA", away: "HAI", date: "2026-06-19T19:00:00", venue: "Filadelfia" },
  { matchNumber: 17, group: "C", home: "SCO", away: "BRA", date: "2026-06-24T15:00:00", venue: "Miami" },
  { matchNumber: 18, group: "C", home: "MAR", away: "HAI", date: "2026-06-24T19:00:00", venue: "Atlanta" },

  // GRUPO D — Estados Unidos, Paraguay, Australia, Turquía
  { matchNumber: 19, group: "D", home: "USA", away: "PAR", date: "2026-06-12T19:00:00", venue: "Los Ángeles" },
  { matchNumber: 20, group: "D", home: "AUS", away: "TUR", date: "2026-06-13T15:00:00", venue: "Vancouver" },
  { matchNumber: 21, group: "D", home: "USA", away: "AUS", date: "2026-06-19T15:00:00", venue: "Seattle" },
  { matchNumber: 22, group: "D", home: "TUR", away: "PAR", date: "2026-06-19T19:00:00", venue: "San Francisco" },
  { matchNumber: 23, group: "D", home: "TUR", away: "USA", date: "2026-06-25T15:00:00", venue: "Los Ángeles" },
  { matchNumber: 24, group: "D", home: "PAR", away: "AUS", date: "2026-06-25T19:00:00", venue: "San Francisco" },

  // GRUPO E — Alemania, Curazao, Costa de Marfil, Ecuador
  { matchNumber: 25, group: "E", home: "GER", away: "CUR", date: "2026-06-14T15:00:00", venue: "Houston" },
  { matchNumber: 26, group: "E", home: "CIV", away: "ECU", date: "2026-06-14T19:00:00", venue: "Filadelfia" },
  { matchNumber: 27, group: "E", home: "GER", away: "CIV", date: "2026-06-20T15:00:00", venue: "Toronto" },
  { matchNumber: 28, group: "E", home: "ECU", away: "CUR", date: "2026-06-20T19:00:00", venue: "Kansas City" },
  { matchNumber: 29, group: "E", home: "ECU", away: "GER", date: "2026-06-25T15:00:00", venue: "Nueva York" },
  { matchNumber: 30, group: "E", home: "CUR", away: "CIV", date: "2026-06-25T19:00:00", venue: "Filadelfia" },

  // GRUPO F — Países Bajos, Japón, Suecia, Túnez
  { matchNumber: 31, group: "F", home: "NED", away: "JPN", date: "2026-06-14T15:00:00", venue: "Dallas" },
  { matchNumber: 32, group: "F", home: "SWE", away: "TUN", date: "2026-06-14T19:00:00", venue: "Monterrey" },
  { matchNumber: 33, group: "F", home: "NED", away: "SWE", date: "2026-06-20T15:00:00", venue: "Houston" },
  { matchNumber: 34, group: "F", home: "TUN", away: "JPN", date: "2026-06-20T19:00:00", venue: "Monterrey" },
  { matchNumber: 35, group: "F", home: "JPN", away: "SWE", date: "2026-06-25T15:00:00", venue: "Dallas" },
  { matchNumber: 36, group: "F", home: "TUN", away: "NED", date: "2026-06-25T19:00:00", venue: "Kansas City" },

  // GRUPO G — Bélgica, Egipto, Irán, Nueva Zelanda
  { matchNumber: 37, group: "G", home: "BEL", away: "EGY", date: "2026-06-15T15:00:00", venue: "Seattle" },
  { matchNumber: 38, group: "G", home: "IRA", away: "NZL", date: "2026-06-15T19:00:00", venue: "Los Ángeles" },
  { matchNumber: 39, group: "G", home: "BEL", away: "IRA", date: "2026-06-21T15:00:00", venue: "Los Ángeles" },
  { matchNumber: 40, group: "G", home: "NZL", away: "EGY", date: "2026-06-21T19:00:00", venue: "Vancouver" },
  { matchNumber: 41, group: "G", home: "NZL", away: "BEL", date: "2026-06-26T15:00:00", venue: "Vancouver" },
  { matchNumber: 42, group: "G", home: "EGY", away: "IRA", date: "2026-06-26T19:00:00", venue: "Seattle" },

  // GRUPO H — España, Cabo Verde, Arabia Saudita, Uruguay
  { matchNumber: 43, group: "H", home: "ESP", away: "CPV", date: "2026-06-15T15:00:00", venue: "Atlanta" },
  { matchNumber: 44, group: "H", home: "SAU", away: "URU", date: "2026-06-15T19:00:00", venue: "Miami" },
  { matchNumber: 45, group: "H", home: "ESP", away: "SAU", date: "2026-06-21T15:00:00", venue: "Atlanta" },
  { matchNumber: 46, group: "H", home: "URU", away: "CPV", date: "2026-06-21T19:00:00", venue: "Miami" },
  { matchNumber: 47, group: "H", home: "URU", away: "ESP", date: "2026-06-26T15:00:00", venue: "Guadalajara" },
  { matchNumber: 48, group: "H", home: "CPV", away: "SAU", date: "2026-06-26T19:00:00", venue: "Houston" },

  // GRUPO I — Francia, Senegal, Iraq, Noruega
  { matchNumber: 49, group: "I", home: "FRA", away: "SEN", date: "2026-06-16T15:00:00", venue: "Nueva York" },
  { matchNumber: 50, group: "I", home: "IRQ", away: "NOR", date: "2026-06-16T19:00:00", venue: "Boston" },
  { matchNumber: 51, group: "I", home: "FRA", away: "IRQ", date: "2026-06-22T15:00:00", venue: "Filadelfia" },
  { matchNumber: 52, group: "I", home: "NOR", away: "SEN", date: "2026-06-22T19:00:00", venue: "Nueva York" },
  { matchNumber: 53, group: "I", home: "NOR", away: "FRA", date: "2026-06-26T15:00:00", venue: "Boston" },
  { matchNumber: 54, group: "I", home: "SEN", away: "IRQ", date: "2026-06-26T19:00:00", venue: "Toronto" },

  // GRUPO J — Argentina, Argelia, Austria, Jordania
  { matchNumber: 55, group: "J", home: "ARG", away: "ALG", date: "2026-06-16T15:00:00", venue: "Kansas City" },
  { matchNumber: 56, group: "J", home: "AUT", away: "JOR", date: "2026-06-16T19:00:00", venue: "San Francisco" },
  { matchNumber: 57, group: "J", home: "ARG", away: "AUT", date: "2026-06-22T15:00:00", venue: "Dallas" },
  { matchNumber: 58, group: "J", home: "JOR", away: "ALG", date: "2026-06-22T19:00:00", venue: "San Francisco" },
  { matchNumber: 59, group: "J", home: "ALG", away: "AUT", date: "2026-06-27T15:00:00", venue: "Kansas City" },
  { matchNumber: 60, group: "J", home: "JOR", away: "ARG", date: "2026-06-27T19:00:00", venue: "Dallas" },

  // GRUPO K — Portugal, DR Congo, Uzbekistán, Colombia
  { matchNumber: 61, group: "K", home: "POR", away: "RDC", date: "2026-06-17T15:00:00", venue: "Houston" },
  { matchNumber: 62, group: "K", home: "UZB", away: "COL", date: "2026-06-17T19:00:00", venue: "Ciudad de México" },
  { matchNumber: 63, group: "K", home: "POR", away: "UZB", date: "2026-06-23T15:00:00", venue: "Houston" },
  { matchNumber: 64, group: "K", home: "COL", away: "RDC", date: "2026-06-23T19:00:00", venue: "Guadalajara" },
  { matchNumber: 65, group: "K", home: "COL", away: "POR", date: "2026-06-27T15:00:00", venue: "Miami" },
  { matchNumber: 66, group: "K", home: "RDC", away: "UZB", date: "2026-06-27T19:00:00", venue: "Atlanta" },

  // GRUPO L — Inglaterra, Croacia, Ghana, Panamá
  { matchNumber: 67, group: "L", home: "ENG", away: "CRO", date: "2026-06-17T15:00:00", venue: "Dallas" },
  { matchNumber: 68, group: "L", home: "GHA", away: "PAN", date: "2026-06-17T19:00:00", venue: "Toronto" },
  { matchNumber: 69, group: "L", home: "ENG", away: "GHA", date: "2026-06-23T15:00:00", venue: "Boston" },
  { matchNumber: 70, group: "L", home: "PAN", away: "CRO", date: "2026-06-23T19:00:00", venue: "Toronto" },
  { matchNumber: 71, group: "L", home: "PAN", away: "ENG", date: "2026-06-27T15:00:00", venue: "Nueva York" },
  { matchNumber: 72, group: "L", home: "CRO", away: "GHA", date: "2026-06-27T19:00:00", venue: "Filadelfia" },
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

  await Promise.all(
    FIXTURES.map((f) =>
      prisma.match.create({
        data: {
          matchNumber: f.matchNumber,
          stageId: groupStage.id,
          homeTeamId: getTeam(f.home).id,
          awayTeamId: getTeam(f.away).id,
          scheduledAt: new Date(f.date),
          groupName: f.group,
          venue: f.venue,
          status: MatchStatus.UPCOMING,
          isLocked: false,
        },
      })
    )
  );
  console.log(`✅ ${FIXTURES.length} partidos de fase de grupos creados (72 partidos, 6 por grupo)`);

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
  console.log(`   • 72 partidos de fase de grupos con sedes reales`);
  console.log(`   • Fechas: 11 Jun — 27 Jun 2026 (fase de grupos)`);
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
