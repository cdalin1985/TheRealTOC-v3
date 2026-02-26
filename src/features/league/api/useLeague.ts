import { useState, useCallback, useMemo } from 'react';
import { Player, Challenge, Match, League, ChallengeValidation, CooldownStatus } from '../model/types';
import { 
  MOCK_LEAGUE, 
  MOCK_PLAYERS, 
  MOCK_CHALLENGES, 
  MOCK_MATCHES,
  canChallenge,
  getCooldownStatus,
  getValidChallengeTargets,
  calculateRankChange
} from '../model/mockData';

// Current user (for demo)
const CURRENT_USER_ID = 'player_003'; // Big Mike Torres, rank 3

export function useLeague() {
  const [league] = useState<League>(MOCK_LEAGUE);
  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useMemo(() => 
    players.find(p => p.id === CURRENT_USER_ID),
    [players]
  );

  // Get ranked list (1st to last)
  const rankedPlayers = useMemo(() => 
    [...players].sort((a, b) => a.rank - b.rank),
    [players]
  );

  // Get valid challenge targets for current user
  const validChallengeTargets = useMemo(() => {
    if (!currentUser) return [];
    return getValidChallengeTargets(currentUser.rank, players, league.rules);
  }, [currentUser, players, league.rules]);

  // Get cooldown status for current user
  const cooldownStatus = useMemo(() => {
    if (!currentUser) return { onCooldown: false, hoursRemaining: 0 };
    // Find last loss
    const lastLoss = matches
      .filter(m => m.loserId === currentUser.id)
      .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())[0];
    return getCooldownStatus(lastLoss?.playedAt, league.rules);
  }, [currentUser, matches, league.rules]);

  // Get pending challenges for current user
  const pendingChallenges = useMemo(() => {
    if (!currentUser) return { incoming: [], outgoing: [] };
    return {
      incoming: challenges.filter(c => 
        c.opponentId === currentUser.id && c.status === 'pending'
      ),
      outgoing: challenges.filter(c => 
        c.challengerId === currentUser.id && c.status === 'pending'
      ),
    };
  }, [challenges, currentUser]);

  // Get active match (accepted but not completed)
  const activeMatch = useMemo(() => {
    if (!currentUser) return null;
    const activeChallenge = challenges.find(c => 
      (c.challengerId === currentUser.id || c.opponentId === currentUser.id) &&
      c.status === 'accepted'
    );
    if (!activeChallenge) return null;
    return matches.find(m => m.challengeId === activeChallenge.id) || null;
  }, [challenges, matches, currentUser]);

  // Create a challenge
  const createChallenge = useCallback(async (opponentId: string): Promise<Challenge | null> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const opponent = players.find(p => p.id === opponentId);
    if (!opponent || !currentUser) {
      setIsLoading(false);
      return null;
    }

    // Validate
    const validation = canChallenge(currentUser.rank, opponent.rank, league.rules);
    if (!validation.valid) {
      setIsLoading(false);
      return null;
    }

    const newChallenge: Challenge = {
      id: `challenge_${Date.now()}`,
      challengerId: currentUser.id,
      challengerRank: currentUser.rank,
      opponentId: opponent.id,
      opponentRank: opponent.rank,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + league.rules.challengeExpirationHours * 60 * 60 * 1000).toISOString(),
      wagerAmount: league.rules.matchWagerAmount,
    };

    setChallenges(prev => [...prev, newChallenge]);
    setIsLoading(false);
    return newChallenge;
  }, [currentUser, players, league.rules]);

  // Accept a challenge
  const acceptChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, status: 'accepted', acceptedAt: new Date().toISOString() }
        : c
    ));
    
    setIsLoading(false);
    return true;
  }, []);

  // Decline a challenge
  const declineChallenge = useCallback(async (challengeId: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, status: 'declined' }
        : c
    ));
    
    setIsLoading(false);
    return true;
  }, []);

  // Report match result
  const reportMatchResult = useCallback(async (
    challengeId: string,
    winnerId: string,
    winnerScore: number,
    loserScore: number
  ): Promise<Match | null> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
      setIsLoading(false);
      return null;
    }

    const loserId = challenge.challengerId === winnerId ? challenge.opponentId : challenge.challengerId;
    const winner = players.find(p => p.id === winnerId);
    const loser = players.find(p => p.id === loserId);
    
    if (!winner || !loser) {
      setIsLoading(false);
      return null;
    }

    const newMatch: Match = {
      id: `match_${Date.now()}`,
      challengeId,
      winnerId,
      loserId,
      winnerRank: winner.rank,
      loserRank: loser.rank,
      winnerScore,
      loserScore,
      gamesPlayed: winnerScore + loserScore,
      playedAt: new Date().toISOString(),
      verifiedBy: CURRENT_USER_ID,
      disputed: false,
      paymentStatus: 'pending',
    };

    setMatches(prev => [...prev, newMatch]);
    
    // Update challenge status
    setChallenges(prev => prev.map(c => 
      c.id === challengeId 
        ? { ...c, status: 'completed', completedAt: new Date().toISOString(), matchId: newMatch.id }
        : c
    ));

    // Update rankings if upset
    if (winner.rank > loser.rank) {
      const { newWinnerRank, newLoserRank } = calculateRankChange(winner.rank, loser.rank);
      setPlayers(prev => prev.map(p => {
        if (p.id === winnerId) return { ...p, rank: newWinnerRank };
        if (p.id === loserId) return { ...p, rank: newLoserRank };
        return p;
      }));
    }

    setIsLoading(false);
    return newMatch;
  }, [challenges, players]);

  // Get match history for a player
  const getPlayerMatchHistory = useCallback((playerId: string): Match[] => {
    return matches
      .filter(m => m.winnerId === playerId || m.loserId === playerId)
      .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
  }, [matches]);

  // Get recent league activity
  const recentActivity = useMemo(() => {
    return matches
      .slice(-10)
      .reverse()
      .map(m => {
        const winner = players.find(p => p.id === m.winnerId);
        const loser = players.find(p => p.id === m.loserId);
        return {
          ...m,
          winnerName: winner?.nickname || winner?.name || 'Unknown',
          loserName: loser?.nickname || loser?.name || 'Unknown',
        };
      });
  }, [matches, players]);

  return {
    league,
    currentUser,
    rankedPlayers,
    validChallengeTargets,
    cooldownStatus,
    pendingChallenges,
    activeMatch,
    recentActivity,
    isLoading,
    createChallenge,
    acceptChallenge,
    declineChallenge,
    reportMatchResult,
    getPlayerMatchHistory,
  };
}
