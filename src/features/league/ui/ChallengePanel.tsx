import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Player, CooldownStatus } from '../../model/types';
import { Colors, Spacing, Typography } from '../../../shared/theme';

interface ChallengePanelProps {
  validTargets: Player[];
  cooldownStatus: CooldownStatus;
  pendingIncoming: number;
  pendingOutgoing: number;
  onChallengePlayer: (playerId: string) => void;
  onViewPending: () => void;
}

export function ChallengePanel({
  validTargets,
  cooldownStatus,
  pendingIncoming,
  pendingOutgoing,
  onChallengePlayer,
  onViewPending,
}: ChallengePanelProps) {
  if (cooldownStatus.onCooldown) {
    return (
      <Animated.View entering={FadeIn} style={styles.cooldownContainer}>
        <Text style={styles.cooldownTitle}>⏰ Challenge Cooldown</Text>
        <Text style={styles.cooldownText}>
          You lost your last match. Wait {cooldownStatus.hoursRemaining}h before challenging.
        </Text>
        <View style={styles.cooldownBar}>
          <View style={[styles.cooldownFill, { width: `${((24 - cooldownStatus.hoursRemaining) / 24) * 100}%` }]} />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚔️ Challenge</Text>
        <Text style={styles.subtitle}>{validTargets.length} players available</Text>
      </View>

      {(pendingIncoming > 0 || pendingOutgoing > 0) && (
        <TouchableOpacity style={styles.pendingButton} onPress={onViewPending}>
          <Text style={styles.pendingText}>
            {pendingIncoming > 0 && `📩 ${pendingIncoming} incoming`}
            {pendingIncoming > 0 && pendingOutgoing > 0 && ' · '}
            {pendingOutgoing > 0 && `📤 ${pendingOutgoing} outgoing`}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.targetsContainer}>
        {validTargets.slice(0, 5).map((player, index) => (
          <TouchableOpacity
            key={player.id}
            style={styles.targetButton}
            onPress={() => onChallengePlayer(player.id)}
          >
            <Text style={styles.targetAvatar}>{player.avatar || '🎱'}</Text>
            <View style={styles.targetInfo}>
              <Text style={styles.targetName}>{player.nickname || player.name}</Text>
              <Text style={styles.targetRank}>Rank #{player.rank}</Text>
            </View>
            <View style={styles.challengeBadge}>
              <Text style={styles.challengeText}>Challenge</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {validTargets.length > 5 && (
        <Text style={styles.moreText}>+{validTargets.length - 5} more players...</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cooldownContainer: {
    backgroundColor: Colors.declineDim,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.decline,
  },
  cooldownTitle: {
    ...Typography.h3,
    color: Colors.decline,
    marginBottom: Spacing.sm,
  },
  cooldownText: {
    ...Typography.body,
    color: Colors.grey1,
    marginBottom: Spacing.md,
  },
  cooldownBar: {
    height: 8,
    backgroundColor: Colors.bgElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cooldownFill: {
    height: '100%',
    backgroundColor: Colors.decline,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.white,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.grey2,
  },
  pendingButton: {
    backgroundColor: Colors.primaryDim,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  pendingText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  targetsContainer: {
    gap: Spacing.sm,
  },
  targetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgElevated,
    padding: Spacing.md,
    borderRadius: 12,
  },
  targetAvatar: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  targetInfo: {
    flex: 1,
  },
  targetName: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '600',
  },
  targetRank: {
    ...Typography.small,
    color: Colors.grey2,
  },
  challengeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  challengeText: {
    ...Typography.small,
    color: Colors.white,
    fontWeight: '700',
  },
  moreText: {
    ...Typography.caption,
    color: Colors.grey3,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
