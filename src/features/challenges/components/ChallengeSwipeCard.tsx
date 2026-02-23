import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, interpolate } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export const ChallengeSwipeCard = ({ challenge }: { challenge: any }) => {
  const translateX = useSharedValue(0);

  const resolveChallenge = (status: string) => { console.log(`Challenge ${status}!`); };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => { translateX.value = event.translationX; })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const isAccepted = event.translationX > 0;
        translateX.value = withSpring(Math.sign(event.translationX) * SCREEN_WIDTH, {}, () => {
          runOnJS(Haptics.impactAsync)(isAccepted ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Rigid);
          runOnJS(resolveChallenge)(isAccepted ? 'accepted' : 'declined');
        });
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotateZ: `${interpolate(translateX.value, [-SCREEN_WIDTH, SCREEN_WIDTH], [-15, 15])}deg` }],
    opacity: interpolate(Math.abs(translateX.value), [0, SCREEN_WIDTH * 0.8], [1, 0])
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedStyle, styles.cardWrapper]}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={SCREEN_WIDTH - 32} height={220} r={24}>
            <LinearGradient start={vec(0, 0)} end={vec(SCREEN_WIDTH, 220)} colors={['rgba(99, 102, 241, 0.9)', 'rgba(15, 15, 15, 0.95)']} />
          </Rect>
        </Canvas>
        <View style={styles.content}>
          <Text style={styles.challengerText}>⚔️ {challenge.challenger_name}</Text>
          <View style={styles.actions}>
            <Text style={styles.declineText}>DECLINE 👈</Text>
            <Text style={styles.acceptText}>👉 ACCEPT</Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardWrapper: { position: 'absolute', width: SCREEN_WIDTH - 32, height: 220, borderRadius: 24, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  content: { flex: 1, padding: 24, justifyContent: 'space-between' },
  challengerText: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  declineText: { color: '#ef4444', fontWeight: '800', letterSpacing: 1 },
  acceptText: { color: '#22c55e', fontWeight: '800', letterSpacing: 1 }
});
