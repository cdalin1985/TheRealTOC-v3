import { useState, useCallback } from 'react';
import { Challenge } from './types';
import { MOCK_CHALLENGES } from './mockData';

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);

  const resolveChallenge = useCallback((id: string, status: 'accepted' | 'declined') => {
    setChallenges((prev) => prev.filter((c) => c.id !== id));
    console.log(`Challenge ${id} ${status}`);
  }, []);

  return { challenges, resolveChallenge };
}
