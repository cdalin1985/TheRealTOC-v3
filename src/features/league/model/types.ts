// Pool League Core Types
// King of the Hill ranking system

export type PlayerRank = number; // 1 = King, 2-6 = Royal Court, etc.

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  avatar?: string;
  rank: PlayerRank;
  joinedAt: string;
  stats: PlayerStats;
  status: 'active' | 'inactive' | 'suspended';
  lastMatchAt?: string;
  monthlyFeePaid: boolean;
}

export interface PlayerStats {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  challengesIssued: number;
  challengesReceived: number;
  winStreak: number;
  bestWinStreak: number;
  totalWagered: number;
  totalWon: number;
  totalLost: number;
}

export type ChallengeStatus = 
  | 'pending'    // Waiting for opponent to accept
  | 'accepted'   // Accepted, waiting to play
  | 'completed'  // Match finished
  | 'declined'   // Opponent declined
  | 'expired'    // No response in time
  | 'cancelled'; // Cancelled by either player

export interface Challenge {
  id: string;
  challengerId: string;
  challengerRank: PlayerRank;
  opponentId: string;
  opponentRank: PlayerRank;
  status: ChallengeStatus;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  completedAt?: string;
  matchId?: string;
  wagerAmount: number; // $5 per player = $10 total pot
}

export interface Match {
  id: string;
  challengeId: string;
  winnerId: string;
  loserId: string;
  winnerRank: PlayerRank;
  loserRank: PlayerRank;
  winnerScore: number;
  loserScore: number;
  gamesPlayed: number; // Best of 3, 5, etc.
  playedAt: string;
  venue?: string;
  verifiedBy?: string; // ID of player who reported (other must confirm)
  confirmedBy?: string; // ID of player who confirmed
  disputed: boolean;
  disputeReason?: string;
  paymentStatus: 'pending' | 'complete';
}

export interface LeagueRules {
  maxChallengeDistance: number; // 5 spots
  cooldownHoursAfterLoss: number; // 24 hours
  matchWagerAmount: number; // $5 per player
  monthlyMinimumFee: number; // $10
  challengeExpirationHours: number; // 48 hours to accept
  inactiveDaysThreshold: number; // 30 days before forced $10 fee
  gamesPerMatch: number; // 1, 3, or 5
}

export interface League {
  id: string;
  name: string;
  city: string;
  createdAt: string;
  ownerId: string;
  rules: LeagueRules;
  totalPlayers: number;
  activePlayers: number;
  totalMatchesPlayed: number;
  totalPrizePool: number;
}

// Validation helpers
export interface ChallengeValidation {
  valid: boolean;
  reason?: string;
  canChallenge: boolean;
}

export interface CooldownStatus {
  onCooldown: boolean;
  cooldownEndsAt?: string;
  hoursRemaining: number;
}
