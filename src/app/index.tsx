import { View, Text, StyleSheet } from 'react-native';
import { useChallenges } from '../features/challenges/useChallenges';
import { ChallengeSwipeCard } from '../features/challenges/components/ChallengeSwipeCard';
import { Colors, Spacing, Typography } from '../shared/theme';

export default function Home() {
  const { challenges, resolveChallenge } = useChallenges();

  const visibleChallenges = challenges.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pending Challenges</Text>
        <Text style={styles.subtitle}>
          {challenges.length > 0
            ? `${challenges.length} waiting · Swipe right to accept`
            : 'All caught up'}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {challenges.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyTitle}>No Pending Challenges</Text>
            <Text style={styles.emptySubtitle}>Check back soon or send a challenge.</Text>
          </View>
        ) : (
          [...visibleChallenges].reverse().map((challenge, reversedIndex) => {
            const index = visibleChallenges.length - 1 - reversedIndex;
            return (
              <ChallengeSwipeCard
                key={challenge.id}
                challenge={challenge}
                onResolve={resolveChallenge}
                index={index}
              />
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    padding: Spacing.xl,
    paddingTop: 80,
  },
  title: {
    color: Colors.white,
    ...Typography.hero,
  },
  subtitle: {
    color: Colors.grey2,
    fontSize: 16,
    marginTop: Spacing.sm,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    color: Colors.white,
    ...Typography.title,
  },
  emptySubtitle: {
    color: Colors.grey2,
    fontSize: 15,
    textAlign: 'center',
  },
});
