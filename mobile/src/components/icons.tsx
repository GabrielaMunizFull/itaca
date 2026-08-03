/**
 * Ícones SVG lineares — Ítaca App
 *
 * Traçados copiados 1:1 de `Itaca App.dc.html` (stroke-width 1.5–1.6, sem
 * preenchimento sólido), convertidos para `react-native-svg`.
 */

import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

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

export function CyclopsIcon({ color, size = 21 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.5}>
      <Circle cx={12} cy={12} r={7} />
      <Circle cx={12} cy={12} r={2.2} fill={color} stroke="none" />
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

export function BellIcon({ color, size = 17 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.6}>
      <Path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z" />
      <Path d="M10 19a2 2 0 0 0 4 0" />
    </Svg>
  );
}

export function AnchorIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.6}>
      <Circle cx={12} cy={5} r={2} />
      <Path d="M12 7v13M7 12H3a9 9 0 0 0 9 9 9 9 0 0 0 9-9h-4" strokeLinecap="round" />
    </Svg>
  );
}

export function ShieldIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.6}>
      <Path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
    </Svg>
  );
}

export function QuestionIcon({ color, size = 24 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.6}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7" />
      <Circle cx={12} cy={17} r={0.3} fill={color} stroke="none" />
    </Svg>
  );
}

export function PenelopeIcon({ color, size = 21 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.5}>
      <Rect x={5} y={4} width={14} height={16} rx={1.5} />
      <Path d="M8 9h8M8 12.5h8M8 16h5" />
    </Svg>
  );
}

export function DivineIcon({ color, size = 21 }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.5}>
      <Path d="M13 2 L4 14 h6 l-1 8 L20 10 h-6 Z" strokeLinejoin="round" />
    </Svg>
  );
}
