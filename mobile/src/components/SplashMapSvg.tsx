/**
 * SplashMapSvg — Ãtaca App
 *
 * Versão simplificada do mapa animado da splash do protótipo
 * (`Itaca App.dc.html`): em vez de replicar o rasgo via `clip-path`, o
 * traçado se desenha (`strokeDashoffset`) e o conjunto aparece com fade-in.
 */

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

interface SplashMapSvgProps {
  size?: number;
}

export function SplashMapSvg({ size = 220 }: SplashMapSvgProps) {
  const draw = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(draw, {
      toValue: 1,
      duration: 1700,
      useNativeDriver: false,
    }).start();
  }, [draw]);

  const strokeDashoffset = draw.interpolate({ inputRange: [0, 1], outputRange: [900, 0] });

  return (
    <Svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: 'visible' }}>
      <AnimatedPolyline
        points="85,12 68,26 48,16 28,32 52,46 74,56 38,66 18,52 14,74 33,88 8,94"
        fill="none"
        stroke="#BF5B33"
        strokeWidth={1.6}
        strokeDasharray="900"
        strokeDashoffset={strokeDashoffset}
      />
      <Circle cx={85} cy={12} r={2.2} fill="#8F4023" />
      <Circle cx={8} cy={94} r={2.6} fill="#17454F" />
      <Path d="M60,5 Q75,0 90,8 Q95,18 88,25 Q78,20 70,22 Q62,15 60,5Z" fill="#2B6E82" opacity={0.35} />
      <Path d="M0,80 Q10,72 22,80 Q18,92 4,96 Q-2,88 0,80Z" fill="#2B6E82" opacity={0.35} />
    </Svg>
  );
}
