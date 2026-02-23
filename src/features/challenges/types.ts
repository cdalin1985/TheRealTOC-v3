export type ChallengeStatus = 'pending' | 'accepted' | 'declined';

export interface Challenge {
  id: string;
  challenger_name: string;
  challenger_rank: string;
  wager: string;
  game_mode: string;
  expires_at: string;
  status: ChallengeStatus;
}
