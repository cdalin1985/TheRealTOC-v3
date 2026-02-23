import { View, Text, StyleSheet } from 'react-native';
import { ChallengeSwipeCard } from '../features/challenges/components/ChallengeSwipeCard';

export default function Home() {
  const mockChallenge = { id: 'match_999', challenger_name: 'Darth Vader' };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pending Challenges</Text>
        <Text style={styles.subtitle}>Swipe right to accept, left to decline.</Text>
      </View>
      <View style={styles.cardContainer}>
        <ChallengeSwipeCard challenge={mockChallenge} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: { padding: 32, paddingTop: 80 },
  title: { color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: '#888', fontSize: 16, marginTop: 8 },
  cardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }
});
