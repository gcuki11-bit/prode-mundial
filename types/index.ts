import type { 
  User, Match, Team, Prediction, TournamentStage, 
  MatchStatus, TournamentStageType, UserRole 
} from "@prisma/client";

// Re-export Prisma types
export type { User, Match, Team, Prediction, TournamentStage, MatchStatus, TournamentStageType, UserRole };

// Extended types with relations
export type MatchWithTeams = Match & {
  homeTeam: Team;
  awayTeam: Team;
  stage: TournamentStage;
  predictions?: PredictionWithUser[];
  userPrediction?: Prediction | null;
};

export type PredictionWithUser = Prediction & {
  user: Pick<User, "id" | "name" | "image" | "username">;
};

export type PredictionWithMatch = Prediction & {
  match: MatchWithTeams;
};

export type UserWithStats = User & {
  favoriteTeam?: Team | null;
  _count?: {
    predictions: number;
  };
};

export type RankingEntry = {
  position: number;
  user: UserWithStats;
  points: number;
  exactPicks: number;
  correctPicks: number;
  totalPicks: number;
  accuracy: number;
};

export type GroupStanding = {
  group: string;
  teams: {
    team: Team;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  }[];
};

export type BracketMatch = {
  id: string;
  matchNumber: number;
  round: TournamentStageType;
  homeTeam?: Team | null;
  awayTeam?: Team | null;
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
  scheduledAt: Date;
  winner?: Team | null;
};

export type DashboardStats = {
  totalUsers: number;
  totalPredictions: number;
  totalMatches: number;
  completedMatches: number;
  upcomingMatches: number;
};

// Form types
export type PredictionFormData = {
  matchId: string;
  homeScore: number;
  awayScore: number;
};

export type MatchFormData = {
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: Date;
  stageId: string;
  venue?: string;
  groupName?: string;
};

// API Response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};
