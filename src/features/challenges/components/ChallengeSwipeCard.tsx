import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { Challenge } from '../types';
import { Colors, Spacing, Typography } from '../../../shared/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const CARD_WIDTH = SCREEN_WIDTH - Spacing.xl * 2;
const CARD_HEIGHT = 240;

interface Props {
  challenge: Challenge;
  onResolve: (id: string, status: 'accepted' | 'declined') => void;
  index: number;
}

function BackCard({ challenge, index }: { challenge: Challenge; index: number }) {
  const stackOffset = index * 10;
  const stackScale = 1 - index * 0.05;

  return (
    <View
      style={[
        styles.cardWrapper,
        {
          transform: [{ translateY: -stackOffset }, { scaleX: stackScale }],
          opacity: 1 - index * 0.2,
          zIndex: 10 - index,
        },
      ]}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={CARD_WIDTH} height={CARD_HEIGHT} r={24}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(CARD_WIDTH, CARD_HEIGHT)}
            colors={['rgba(99, 102, 241, 0.6)', 'rgba(10, 10, 20, 0.9)']}
          />
        </Rect>
      </Canvas>
      <View style={styles.content}>
        <Text style={styles.challengerName}>⚔️  {challenge.challenger_name}</Text>
      </View>
    </View>
  );
}

function TopCard({ challenge, onResolve }: { challenge: Challenge; onResolve: Props['onResolve'] }) {
  const translateX = useSharedValue(0);

  const handleResolve = (status: 'accepted' | 'declined') => {
    Haptics.impactAsync(
      status === 'accepted'
        ? Haptics.ImpactFeedbackStyle.Heavy
        : Haptics.ImpactFeedbackStyle.Rigid
    );
    onResolve(challenge.id, status);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        const accepted = e.translationX > 0;
        translateX.value = withSpring(
          Math.sign(e.translationX) * SCREEN_WIDTH * 1.5,
          { damping: 20, stiffness: 180 },
          () => runOnJS(handleResolve)(accepted ? 'accepted' : 'declined')
        );
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 200 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      {
        rotateZ: `${interpolate(
          translateX.value,
          [-SCREEN_WIDTH, SCREEN_WIDTH],
          [-15, 15],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
    opacity: interpolate(
      Math.abs(translateX.value),
      [0, SCREEN_WIDTH * 0.7],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const acceptOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const declineOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardWrapper, styles.topCard, cardStyle]}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={CARD_WIDTH} height={CARD_HEIGHT} r={24}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(CARD_WIDTH, CARD_HEIGHT)}
              colors={['rgba(99, 102, 241, 0.9)', 'rgba(10, 10, 20, 0.98)']}
            />
          </Rect>
        </Canvas>

        <Animated.View style={[styles.overlayBadge, styles.overlayLeft, acceptOverlay]}>
          <Text style={styles.overlayAcceptText}>ACCEPT</Text>
        </Animated.View>
        <Animated.View style={[styles.overlayBadge, styles.overlayRight, declineOverlay]}>
          <Text style={styles.overlayDeclineText}>DECLINE</Text>
        </Animated.View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.challengerName}>⚔️  {challenge.challenger_name}</Text>
            <View style={styles.expiryBadge}>
              <Text style={styles.expiryText}>{challenge.expires_at}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>RANK</Text>
              <Text style={styles.metaValue}>{challenge.challenger_rank}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>MODE</Text>
              <Text style={styles.metaValue}>{challenge.game_mode}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>WAGER</Text>
              <Text style={[styles.metaValue, styles.wagerText]}>{challenge.wager}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Text style={styles.declineHint}>👈 DECLINE</Text>
            <Text style={styles.acceptHint}>ACCEPT 👉</Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export function ChallengeSwipeCard({ challenge, onResolve, index }: Props) {
  if (index === 0) {
    return <TopCard challenge={challenge} onResolve={onResolve} />;
  }
  return <BackCard challenge={challenge} index={index} />;
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  topCard: {
    zIndex: 10,
  },
  overlayBadge: {
    position: 'absolute',
    top: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 3,
    zIndex: 20,
  },
  overlayLeft: {
    left: Spacing.lg,
    borderColor: Colors.accept,
  },
  overlayRight: {
    right: Spacing.lg,
    borderColor: Colors.decline,
  },
  overlayAcceptText: {
    color: Colors.accept,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  overlayDeclineText: {
    color: Colors.decline,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  challengerName: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
    marginRight: Spacing.sm,
  },
  expiryBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expiryText: {
    color: Colors.grey1,
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: Colors.grey2,
    ...Typography.label,
    fontSize: 11,
    marginBottom: 2,
  },
  metaValue: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  wagerText: {
    color: Colors.accept,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  declineHint: {
    color: Colors.decline,
    ...Typography.label,
    fontSize: 13,
  },
  acceptHint: {
    color: Colors.accept,
    ...Typography.label,
    fontSize: 13,
  },
});
