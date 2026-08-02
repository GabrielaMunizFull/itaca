/**
 * CyclopsViewfinderSvg — Ãtaca App
 *
 * Ilustração do olho de ciclope + moldura de foco do viewfinder na tela
 * Scanner de Ciclope. Traçados copiados 1:1 de `Itaca App.dc.html`. Durante
 * o scan, uma barra horizontal sobe/desce (equivalente RN da animação CSS
 * `floatBob`, via `Animated`).
 */

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/tokens';

interface CyclopsViewfinderSvgProps {
  scanning: boolean;
  focused: boolean;
  /**
   * 'full' (padrão) desenha o fundo do viewfinder + ilustração do olho de
   * ciclope — usado como fallback visual antes da permissão de câmera ser
   * concedida. 'frame' desenha só a moldura de foco (cantos) + linha de
   * scan, com fundo transparente — usado como overlay por cima do
   * `CameraView` real quando a câmera está ativa.
   */
  variant?: 'full' | 'frame';
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function CyclopsViewfinderSvg({ scanning, focused, variant = 'full' }: CyclopsViewfinderSvgProps) {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!scanning) {
      bob.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 550, useNativeDriver: false }),
        Animated.timing(bob, { toValue: 0, duration: 550, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanning, bob]);

  const scanLineY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, 103] });

  return (
    <Svg viewBox="0 0 100 105" width="100%" height="100%" style={{ display: 'flex' }}>
      {variant === 'full' && (
        <>
          <Rect width={100} height={105} fill={colors.viewfinderBg} />
          <Path d="M20,80 Q30,40 50,35 Q70,40 80,80 Z" fill="#3a2a1c" opacity={0.7} />
          <Circle cx={50} cy={50} r={9} fill="#e8dcb8" />
          <Circle cx={50} cy={50} r={4.4} fill={colors.textPrimary} />
          <Circle cx={50} cy={47} r={1.6} fill="#fff" opacity={0.7} />
        </>
      )}
      <G stroke={colors.oliveDark} fill="none" opacity={focused ? 1 : 0.35}>
        <Path d="M32,28 v-6 h6" />
        <Path d="M68,28 v-6 h-6" />
        <Path d="M32,88 v6 h6" />
        <Path d="M68,88 v6 h-6" />
        <Rect x={32} y={22} width={36} height={72} strokeWidth={0.8} />
      </G>
      {scanning && (
        <AnimatedRect x={15} y={scanLineY} width={70} height={2.2} fill={colors.oliveDark} opacity={0.8} />
      )}
    </Svg>
  );
}
