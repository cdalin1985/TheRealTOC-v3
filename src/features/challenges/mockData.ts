import { Challenge } from './types';

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'match_001',
    challenger_name: 'Darth Vader',
    challenger_rank: 'Grand Master',
    wager: '$50',
    game_mode: '1v1 · Best of 3',
    expires_at: '23m',
    status: 'pending',
  },
  {
    id: 'match_002',
    challenger_name: 'Rey Skywalker',
    challenger_rank: 'Diamond I',
    wager: '$25',
    game_mode: '1v1 · Single',
    expires_at: '1h 12m',
    status: 'pending',
  },
  {
    id: 'match_003',
    challenger_name: 'Kylo Ren',
    challenger_rank: 'Platinum III',
    wager: '$100',
    game_mode: '1v1 · Best of 5',
    expires_at: '45m',
    status: 'pending',
  },
  {
    id: 'match_004',
    challenger_name: 'Mace Windu',
    challenger_rank: 'Legend',
    wager: '$10',
    game_mode: '1v1 · Single',
    expires_at: '2h',
    status: 'pending',
  },
];
