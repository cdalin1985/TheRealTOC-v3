import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../shared/theme';

function TabIcon({ emoji, label, isFocused }: { emoji: string; label: string; isFocused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabEmoji, isFocused && styles.tabEmojiFocused]}>{emoji}</Text>
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>{label}</Text>
      {isFocused && <View style={styles.tabIndicator} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="league"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏆" label="League" isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚔️" label="Challenges" isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎱" label="Matches" isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" isFocused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 80,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  tabEmoji: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  tabEmojiFocused: {
    opacity: 1,
  },
  tabLabel: {
    ...Typography.small,
    color: Colors.grey3,
    fontSize: 10,
  },
  tabLabelFocused: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    top: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
