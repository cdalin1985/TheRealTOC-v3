import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLeague } from '../../features/league/api/useLeague';
import { Leaderboard } from '../../features/league/ui/Leaderboard';
import { ChallengePanel } from '../../features/league/ui/ChallengePanel';
import { Card } from '../../shared/ui';
import { Colors, Spacing, Typography } from '../../shared/theme';

const CURRENT_USER_ID = 'player_003'; // Big Mike Torres

export default function LeagueScreen() {
  const {
    league,
    currentUser,
    rankedPlayers,
    validChallengeTargets,
    cooldownStatus,
    pendingChallenges,
    recentActivity,
    isLoading,
    createChallenge,
  } = useLeague();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // In real app, would refresh data here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleChallengePlayer = async (playerId: string) => {
    const challenge = await createChallenge(playerId);
    if (challenge) {
      // Show success, navigate to challenge detail, etc.
      console.log('Challenge created:', challenge.id);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{league.name}</Text>
          <Text style={styles.subtitle}>{league.city} · {league.totalPlayers} players</Text>
        </View>
        <View style={styles.prizePool}>
          <Text style={styles.prizeLabel}>Prize Pool</Text>
          <Text style={styles.prizeAmount}>${league.totalPrizePool.toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Current User Status */}
        {currentUser && (
          <Card variant="gradient" padding="lg" style={styles.userCard}>
            <View style={styles.userHeader}>
              <Text style={styles.userAvatar}>{currentUser.avatar || '🎱'}</Text>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{currentUser.nickname || currentUser.name}</Text>
                <Text style={styles.userRank}>Rank #{currentUser.rank}</Text>
              </View>
            </View>
            <View style={styles.userStats}>
              <StatBox label="Wins" value={currentUser.stats.matchesWon} />
              <StatBox label="Losses" value={currentUser.stats.matchesLost} />
              <StatBox label="Streak" value={currentUser.stats.winStreak} highlight />
              <StatBox label="Won" value={`$${currentUser.stats.totalWon}`} />
            </View>
          </Card>
        )}

        {/* Challenge Panel */}
        <ChallengePanel
          validTargets={validChallengeTargets}
          cooldownStatus={cooldownStatus}
          pendingIncoming={pendingChallenges.incoming.length}
          pendingOutgoing={pendingChallenges.outgoing.length}
          onChallengePlayer={handleChallengePlayer}
          onViewPending={() => {}}
        />

        {/* Rules Reminder */}
        <Card variant="glass" padding="md" style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>📋 League Rules</Text>
          <View style={styles.rulesList}>
            <RuleItem icon="⚔️" text={`Challenge within ${league.rules.maxChallengeDistance} ranks`} />
            <RuleItem icon="⏰" text={`${league.rules.cooldownHoursAfterLoss}h cooldown after loss`} />
            <RuleItem icon="💰" text={`$${league.rules.matchWagerAmount} per match ($10 total)`} />
            <RuleItem icon="📅" text={`$${league.rules.monthlyMinimumFee}/month minimum`} />
          </View>
        </Card>

        {/* Leaderboard */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>🏆 Leaderboard</Text>
          <Leaderboard
            players={rankedPlayers}
            currentUserId={CURRENT_USER_ID}
            onPlayerPress={(player) => console.log('Player pressed:', player.name)}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, highlight && styles.statHighlight]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function RuleItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.ruleItem}>
      <Text style={styles.ruleIcon}>{icon}</Text>
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  title: {
    ...Typography.hero,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.grey2,
  },
  prizePool: {
    alignItems: 'flex-end',
  },
  prizeLabel: {
    ...Typography.label,
    color: Colors.grey2,
    fontSize: 11,
  },
  prizeAmount: {
    ...Typography.h2,
    color: Colors.accept,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  userCard: {
    marginBottom: Spacing.lg,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userAvatar: {
    fontSize: 48,
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.h2,
    color: Colors.white,
  },
  userRank: {
    ...Typography.body,
    color: Colors.grey2,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h3,
    color: Colors.white,
  },
  statHighlight: {
    color: Colors.accept,
  },
  statLabel: {
    ...Typography.small,
    color: Colors.grey3,
    marginTop: 2,
  },
  rulesCard: {
    marginBottom: Spacing.lg,
  },
  rulesTitle: {
    ...Typography.h3,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  rulesList: {
    gap: Spacing.sm,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ruleIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
    width: 24,
  },
  ruleText: {
    ...Typography.body,
    color: Colors.grey1,
    fontSize: 14,
  },
  leaderboardSection: {
    flex: 1,
  },
  sectionTitle: {
    ...Typography.h2,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  bottomPadding: {
    height: Spacing.xxxl,
  },
});
