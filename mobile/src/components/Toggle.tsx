/**
 * Toggle — Ãtaca App
 *
 * Réplica do toggle do protótipo (`Itaca App.dc.html`): track 44x26,
 * radius 20, knob 22px deslizando de 2px a 20px, cor on `#6E8F4B` / off
 * `#c9bb96`, animação de 0.2s.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import type { ThemeColors } from '../theme/tokens';
import { useThemeColors } from '../theme/useThemeColors';

interface ToggleProps {
  value: boolean;
  onValueChange: () => void;
}

export function Toggle({ value, onValueChange }: ToggleProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.toggleOff, colors.oliveDark],
  });
  const knobLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20],
  });

  return (
    <Pressable
      onPress={onValueChange}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.knob, { left: knobLeft }]} />
      </Animated.View>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    track: {
      width: 44,
      height: 26,
      borderRadius: 20,
    },
    knob: {
      position: 'absolute',
      top: 2,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.cardWhite,
    },
  });
}
