import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Player } from '../../model/types';
import { Colors, Spacing, Typography } from '../../../shared/theme';

interface LeaderboardProps {
  players: Player[];
  currentUserId?: string;
  onPlayerPress?: (player: Player) => void;
}

export function Leaderboard({ players, currentUserId, onPlayerPress }: LeaderboardProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {players.map((player, index) => (
        <Animated.View
          key={player.id}
          entering={FadeInUp.delay(index * 50)}
        >
          <PlayerRow
            player={player}
            isCurrentUser={player.id === currentUserId}
            onPress={() => onPlayerPress?.(player)}
          />
        </Animated.View>
      ))}
    </ScrollView>
  );
}

interface PlayerRowProps {
  player: Player;
  isCurrentUser: boolean;
  onPress: () => void;
}

function PlayerRow({ player, isCurrentUser, onPress }: PlayerRowProps) {
  const getRankTitle = (rank: number) => {
    if (rank === 1) return '👑 King';
    if (rank <= 3) return '⚔️ Court';
    if (rank <= 6) return '🛡️ Knight';
    return '⚪ Challenger';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank <= 3) return '#C0C0C0';
    if (rank <= 6) return '#CD7F32';
    return Colors.grey3;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.row,
        isCurrentUser && styles.currentUserRow
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.rankContainer}>
        <Text style={[styles.rank, { color: getRankColor(player.rank) }]}>
          #{player.rank}
        </Text>
        <Text style={styles.rankTitle}>{getRankTitle(player.rank)}</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{player.avatar || '🎱'}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{player.nickname || player.name}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.stats}>
            {player.stats.matchesWon}W - {player.stats.matchesLost}L
          </Text>
          {player.stats.winStreak > 0 && (
            <Text style={styles.streak}>🔥 {player.stats.winStreak}</Text>
          )}
        </View>
      </View>

      <View style={styles.statusContainer}>
        {!player.monthlyFeePaid && (
          <View style={styles.unpaidBadge}>
            <Text style={styles.unpaidText}>$10 Due</Text>
          </View>
        )}
        {player.status === 'active' && player.monthlyFeePaid && (
          <View style={styles.activeIndicator} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentUserRow: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primaryDim,
  },
  rankContainer: {
    width: 70,
    alignItems: 'center',
  },
  rank: {
    ...Typography.h2,
    fontWeight: '900',
  },
  rankTitle: {
    ...Typography.small,
    color: Colors.grey3,
    fontSize: 10,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatar: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stats: {
    ...Typography.small,
    color: Colors.grey2,
  },
  streak: {
    ...Typography.small,
    color: Colors.accept,
    marginLeft: Spacing.sm,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  unpaidBadge: {
    backgroundColor: Colors.declineDim,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  unpaidText: {
    ...Typography.small,
    color: Colors.decline,
    fontWeight: '700',
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accept,
  },
});
