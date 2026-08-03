/**
 * SplashScreen — Ãtaca App
 *
 * Abertura do app: mapa em SVG com fade-in/desenho, título, subtítulo e
 * dica. Avança automaticamente após 3000ms ou ao toque na tela (equivalente
 * a `splashActive`/`skipSplash` do protótipo `Itaca App.dc.html`).
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SplashMapSvg } from '../components/SplashMapSvg';
import { spacing, typography, type ThemeColors } from '../theme/tokens';
import { useThemeColors } from '../theme/useThemeColors';

const SPLASH_DURATION_MS = 3000;

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const fade = useRef(new Animated.Value(0)).current;
  const finishedRef = useRef(false);
  const insets = useSafeAreaInsets();

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  };

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(finish, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Pressable
      style={[styles.container, { paddingTop: spacing.xl + insets.top, paddingBottom: spacing.xl + insets.bottom }]}
      onPress={finish}
    >
      <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
        <SplashMapSvg />
        <Text style={styles.title}>ÃTACA</Text>
        <Text style={styles.subtitle}>navegação para heróis que demoram a chegar</Text>
        <Text style={styles.hint}>toque para pular a saga</Text>
      </Animated.View>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      marginTop: 28,
      fontFamily: 'Cinzel_900Black',
      fontSize: typography.fontSize.splash,
      letterSpacing: 6,
      color: colors.textPrimary,
    },
    subtitle: {
      marginTop: 8,
      fontFamily: 'Inter_400Regular',
      fontSize: typography.fontSize.captionLarge,
      color: colors.textSecondary,
      letterSpacing: 1,
    },
    hint: {
      marginTop: 20,
      fontFamily: 'Inter_400Regular',
      fontSize: typography.fontSize.caption,
      color: colors.textTertiary,
    },
  });
}
