/**
 * DangerMapSvg — Ãtaca App
 *
 * Mapa de perigo da tela Sereia: mesma rota do card "ROTA ATUAL" (em
 * dourado semi-transparente) sobre fundo escuro, com zona de perigo
 * pulsante. Equivalente RN da animação CSS `pulseZone` (`Itaca App.dc.html`)
 * usando `Animated`.
 */

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme/tokens';

const ROUTE_D =
  'M85,12 Q76,19 68,26 Q58,21 48,16 Q38,24 28,32 Q40,39 52,46 Q63,51 74,56 Q56,61 38,66 Q28,59 18,52 Q16,63 14,74 Q23,81 33,88 Q20,91 8,94';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function DangerMapSvg() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const pulseRadius = pulse.interpolate({ inputRange: [0, 1], outputRange: [14, 16.5] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.25] });

  return (
    <Svg viewBox="0 0 100 100" width="100%" height={200}>
      <Rect width={100} height={100} fill={colors.dangerMapInner} />
      <Path d={ROUTE_D} fill="none" stroke={colors.gold} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
      <AnimatedCircle cx={18} cy={52} r={pulseRadius} fill={colors.danger} opacity={pulseOpacity} />
      <Circle cx={18} cy={52} r={7} fill={colors.danger} opacity={0.6} />
      <Circle cx={18} cy={52} r={2.2} fill={colors.cardWhite} />
      <SvgText x={18} y={42} fontSize={3.6} fill={colors.cardWhite} textAnchor="middle" fontWeight="700">
        ZONA DE PERIGO
      </SvgText>
    </Svg>
  );
}
