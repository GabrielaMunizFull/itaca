/**
 * Ícones SVG lineares — Ãtaca App
 *
 * Traçados copiados 1:1 de `Itaca App.dc.html` (stroke-width 1.5–1.6, sem
 * preenchimento sólido), convertidos para `react-native-svg`.
 */

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
}

export function HomeIcon({ color, size = 21 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.5}>
      <Path d="M12 4 L12 13" />
      <Path d="M12 6 L18 12 L12 12 Z" />
      <Path d="M6 17 L18 17 L16.5 20 L7.5 20 Z" />
    </Svg>
  );
}

export function SirenIcon({ color, size = 21 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.5}>
      <Path d="M3 13c2-5 5-5 7-1s5 4 7-1 5-5 4-1" />
      <Circle cx={12} cy={6} r={2} />
    </Svg>
  );
}

export function GearIcon({ color, size = 17 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.6}>
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.067-.4.1-.8.1-1.2Z" />
    </Svg>
  );
}

export function SunIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.5}>
      <Circle cx={12} cy={12} r={5} />
      <Path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </Svg>
  );
}
