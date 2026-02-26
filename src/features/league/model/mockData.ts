import { Player, Challenge, Match, League, LeagueRules, PlayerStats, ChallengeValidation, CooldownStatus } from './types';

// League rules - configurable per league
export const DEFAULT_LEAGUE_RULES: LeagueRules = {
  maxChallengeDistance: 5,
  cooldownHoursAfterLoss: 24,
  matchWagerAmount: 5,
  monthlyMinimumFee: 10,
  challengeExpirationHours: 48,
  inactiveDaysThreshold: 30,
  gamesPerMatch: 3, // Best of 3
};

// Mock league
export const MOCK_LEAGUE: League = {
  id: 'league_001',
  name: 'Metro City Pool League',
  city: 'Metro City',
  createdAt: '2024-01-15T00:00:00Z',
  ownerId: 'player_001',
  rules: DEFAULT_LEAGUE_RULES,
  totalPlayers: 12,
  activePlayers: 10,
  totalMatchesPlayed: 156,
  totalPrizePool: 2840,
};

// Mock players - King of the Hill ranking
export const MOCK_PLAYERS: Player[] = [
  {
    id: 'player_001',
    name: 'Marcus "The Shark" Johnson',
    nickname: 'The Shark',
    avatar: '🦈',
    rank: 1,
    joinedAt: '2024-01-15T00:00:00Z',
    stats: {
      matchesPlayed: 23,
      matchesWon: 19,
      matchesLost: 4,
      challengesIssued: 8,
      challengesReceived: 15,
      winStreak: 7,
      bestWinStreak: 9,
      totalWagered: 115,
      totalWon: 95,
      totalLost: 20,
    },
    status: 'active',
    lastMatchAt: '2024-02-20T18:30:00Z',
    monthlyFeePaid: true,
  },
  {
    id: 'player_002',
    name: 'Sarah Chen',
    nickname: 'Silent Assassin',
    avatar: '🎯',
    rank: 2,
    joinedAt: '2024-01-20T00:00:00Z',
    stats: {
      matchesPlayed: 31,
      matchesWon: 24,
      matchesLost: 7,
      challengesIssued: 18,
      challengesReceived: 13,
      winStreak: 2,
      bestWinStreak: 6,
      totalWagered: 155,
      totalWon: 120,
      totalLost: 35,
    },
    status: 'active',
    lastMatchAt: '2024-02-21T14:00:00Z',
    monthlyFeePaid: true,
  },
  {
    id: 'player_003',
    name: 'Big Mike Torres',
    nickname: 'Big Mike',
    avatar: '🎱',
    rank: 3,
    joinedAt: '2024-01-18T00:00:00Z',
    stats: {
      matchesPlayed: 28,
      matchesWon: 20,
      matchesLost: 8,
      challengesIssued: 12,
      challengesReceived: 16,
      winStreak: 0,
      bestWinStreak: 5,
      totalWagered: 140,
      totalWon: 100,
      totalLost: 40,
    },
    status: 'active',
    lastMatchAt: '2024-02-19T20:00:00Z',
    monthlyFeePaid: true,
  },
  {
    id: 'player_004',
    name: 'Jennifer Wu',
    nickname: 'J-Dub',
    avatar: '🔥',
    rank: 4,
    joinedAt: '2024-02-01T00:00:00Z',
    stats: {
      matchesPlayed: 15,
      matchesWon: 10,
      matchesLost: 5,
      challengesIssued: 9,
      challengesReceived: 6,
      winStreak: 3,
      bestWinStreak: 4,
      totalWagered: 75,
      totalWon: 50,
      totalLost: 25,
    },
    status: 'active',
    lastMatchAt: '2024-02-21T16:30:00Z',
    monthlyFeePaid: true,
  },
  {
    id: 'player_005',
    name: 'Robert Kim',
    nickname: 'The Professor',
    avatar: '🎓',
    rank: 5,
    joinedAt: '2024-01-25T00:00:00Z',
    stats: {
      matchesPlayed: 19,
      matchesWon: 11,
      matchesLost: 8,
      challengesIssued: 7,
      challengesReceived: 12,
      winStreak: 1,
      bestWinStreak: 3,
      totalWagered: 95,
      totalWon: 55,
      totalLost: 40,
    },
    status: 'active',
    lastMatchAt: '2024-02-20T19:00:00Z',
    monthlyFeePaid: true,
  },
  {
    id: 'player_006',
    name: 'Lisa Rodriguez',
    nickname: 'Lightning',
    avatar: '⚡',
    rank: 6,
    joinedAt: '2024-02-05T00:00:00Z',
    stats: {
      matchesPlayed: 12,
      matchesWon: 7,
      matchesLost: 5,
      challengesIssued: 5,
      challengesReceived: 7,
      winStreak: 0,
      bestWinStreak: 2,
      totalWagered: 60,
      totalWon: 35,
      totalLost: 25,
    },
    status: 'active',
    lastMatchAt: '2024-02-18T15:00:00Z',
    monthlyFeePaid: false, // Needs to pay
  },
  {
    id: 'player_007',
    name: 'David Park',
    nickname: 'DP',
    avatar: '🎯',
    rank: 7,
    joinedAt: '2024-02-10T00:00:00Z',
    stats: {
      matchesPlayed: 8,
      matchesWon: 4,
      matchesLost: 4,
      challengesIssued: 4,
      challengesReceived: 4,
      winStreak: 0,
      bestWinStreak: 2,
      totalWagered: 40,
      totalWon: 20,
      totalLost: 20,
    },
    status: 'active',
    lastMatchAt: '2024-02-17T14:00:00Z',
    monthlyFeePaid: true,
  },
  {
    id: 'player_008',
    name: 'Amanda Foster',
    nickname: 'The Rookie',
    avatar: '🌟',
    rank: 8,
    joinedAt: '2024-02-15T00:00:00Z',
    stats: {
      matchesPlayed: 5,
      matchesWon: 2,
      matchesLost: 3,
      challengesIssued: 3,
      challengesReceived: 2,
      winStreak: 0,
      bestWinStreak: 1,
      totalWagered: 25,
      totalWon: 10,
      totalLost: 15,
    },
    status: 'active',
    lastMatchAt: '2024-02-16T18:00:00Z',
    monthlyFeePaid: true,
  },
];

// Mock challenges
export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'challenge_001',
    challengerId: 'player_002',
    challengerRank: 2,
    opponentId: 'player_001',
    opponentRank: 1,
    status: 'pending',
    createdAt: '2024-02-21T10:00:00Z',
    expiresAt: '2024-02-23T10:00:00Z',
    wagerAmount: 5,
  },
  {
    id: 'challenge_002',
    challengerId: 'player_004',
    challengerRank: 4,
    opponentId: 'player_002',
    opponentRank: 2,
    status: 'accepted',
    createdAt: '2024-02-20T14:00:00Z',
    expiresAt: '2024-02-22T14:00:00Z',
    acceptedAt: '2024-02-20T15:30:00Z',
    wagerAmount: 5,
  },
];

// Mock matches
export const MOCK_MATCHES: Match[] = [
  {
    id: 'match_001',
    challengeId: 'challenge_003',
    winnerId: 'player_001',
    loserId: 'player_003',
    winnerRank: 1,
    loserRank: 3,
    winnerScore: 2,
    loserScore: 1,
    gamesPlayed: 3,
    playedAt: '2024-02-20T18:30:00Z',
    venue: 'Break Room Billiards',
    verifiedBy: 'player_001',
    confirmedBy: 'player_003',
    disputed: false,
    paymentStatus: 'complete',
  },
  {
    id: 'match_002',
    challengeId: 'challenge_004',
    winnerId: 'player_002',
    loserId: 'player_005',
    winnerRank: 2,
    loserRank: 5,
    winnerScore: 2,
    loserScore: 0,
    gamesPlayed: 3,
    playedAt: '2024-02-19T20:00:00Z',
    venue: 'Cue Stick Cafe',
    verifiedBy: 'player_002',
    confirmedBy: 'player_005',
    disputed: false,
    paymentStatus: 'complete',
  },
];

// Helper functions for validation
export function canChallenge(challengerRank: number, opponentRank: number, rules: LeagueRules): ChallengeValidation {
  const distance = Math.abs(challengerRank - opponentRank);
  
  if (distance === 0) {
    return { valid: false, canChallenge: false, reason: 'Cannot challenge yourself' };
  }
  
  if (distance > rules.maxChallengeDistance) {
    return { 
      valid: false, 
      canChallenge: false, 
      reason: `Can only challenge within ${rules.maxChallengeDistance} spots` 
    };
  }
  
  // King can only be challenged by #2
  if (opponentRank === 1 && challengerRank !== 2) {
    return { valid: false, canChallenge: false, reason: 'Only #2 can challenge the King' };
  }
  
  return { valid: true, canChallenge: true };
}

export function getCooldownStatus(lastLossAt: string | undefined, rules: LeagueRules): CooldownStatus {
  if (!lastLossAt) {
    return { onCooldown: false, hoursRemaining: 0 };
  }
  
  const lastLoss = new Date(lastLossAt);
  const now = new Date();
  const cooldownEnd = new Date(lastLoss.getTime() + rules.cooldownHoursAfterLoss * 60 * 60 * 1000);
  
  if (now < cooldownEnd) {
    const hoursRemaining = Math.ceil((cooldownEnd.getTime() - now.getTime()) / (60 * 60 * 1000));
    return { 
      onCooldown: true, 
      cooldownEndsAt: cooldownEnd.toISOString(),
      hoursRemaining 
    };
  }
  
  return { onCooldown: false, hoursRemaining: 0 };
}

export function getValidChallengeTargets(playerRank: number, allPlayers: Player[], rules: LeagueRules): Player[] {
  return allPlayers.filter(p => {
    if (p.rank === playerRank) return false;
    const validation = canChallenge(playerRank, p.rank, rules);
    return validation.canChallenge;
  });
}

export function calculateRankChange(winnerRank: number, loserRank: number): { newWinnerRank: number; newLoserRank: number } {
  // If lower rank (higher number) beats higher rank (lower number), they swap
  if (winnerRank > loserRank) {
    return { newWinnerRank: loserRank, newLoserRank: winnerRank };
  }
  // If higher rank beats lower rank, no change
  return { newWinnerRank: winnerRank, newLoserRank: loserRank };
}
