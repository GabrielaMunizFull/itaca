/**
 * SaveFab — Ãtaca App
 *
 * Botão flutuante "salvar progresso" (equivalente ao FAB de
 * `Itaca App.dc.html`, `saveProgress`/`fabPulse`): pulso contínuo sutil,
 * âncora que "cai" ao toque e toast satírico. Renderizado uma única vez em
 * `MainTabs`, visível por cima do conteúdo das tabs.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AnchorIcon } from './icons';
import { Toast } from './Toast';
import { colors, radius, spacing } from '../theme/tokens';

interface SaveFabProps {
  bottomOffset: number;
}

const TOAST_MESSAGE = 'Progresso salvo. Pena que sua vida não vem com esse recurso.';
const TOAST_VISIBLE_MS = 2800;
const ANCHOR_RAISED = -34;
const ANCHOR_DROPPED = 6;

export function SaveFab({ bottomOffset }: SaveFabProps) {
  const pulse = useRef(new Animated.Value(0)).current;
  const anchorY = useRef(new Animated.Value(ANCHOR_RAISED)).current;
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(
    () => () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    },
    []
  );

  const handlePress = () => {
    Animated.spring(anchorY, {
      toValue: ANCHOR_DROPPED,
      useNativeDriver: true,
      speed: 6,
      bounciness: 10,
    }).start();

    setToastVisible(true);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => {
      setToastVisible(false);
      Animated.spring(anchorY, {
        toValue: ANCHOR_RAISED,
        useNativeDriver: true,
        speed: 6,
        bounciness: 6,
      }).start();
    }, TOAST_VISIBLE_MS);
  };

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]} pointerEvents="box-none">
      <Toast visible={toastVisible} message={TOAST_MESSAGE} style={styles.toastPosition} />
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Salvar progresso"
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.pulseRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
        />
        <Animated.View style={{ transform: [{ translateY: anchorY }] }}>
          <AnchorIcon color={colors.background} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: spacing.base,
    alignItems: 'flex-end',
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  pulseRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  toastPosition: {
    position: 'absolute',
    bottom: 60,
    right: 0,
  },
});
