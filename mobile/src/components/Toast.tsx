/**
 * Toast — Ítaca App
 *
 * Réplica do toast do protótipo (`Itaca App.dc.html`): caixa escura com
 * fade/scale de entrada. Componente controlado — não se auto-posiciona;
 * quem usa define o posicionamento via prop `style`.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { radius, shadows, spacing, typography, type ThemeColors } from '../theme/tokens';
import { useThemeColors } from '../theme/useThemeColors';

interface ToastProps {
  visible: boolean;
  message: string;
  style?: StyleProp<ViewStyle>;
}

export function Toast({ visible, message, style }: ToastProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: visible ? 300 : 150,
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  return (
    <Animated.View
      pointerEvents="none"
      accessible
      accessibilityLiveRegion="polite"
      accessibilityLabel={visible ? message : undefined}
      style={[
        styles.toast,
        style,
        {
          opacity: anim,
          transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    toast: {
      backgroundColor: colors.textPrimary,
      borderRadius: radius.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: 13,
      maxWidth: 220,
      ...shadows.toast,
    },
    text: {
      fontFamily: 'Inter_400Regular',
      fontSize: typography.fontSize.caption,
      color: colors.background,
    },
  });
}
