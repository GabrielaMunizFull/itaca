/**
 * RouteMapSvg — Ítaca App
 *
 * Mapa de rota exibido no card "ROTA ATUAL" da Home. Curvas, pontos e
 * labels copiados 1:1 de `Itaca App.dc.html`.
 */

import React, { useMemo } from 'react';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { useThemeColors } from '../theme/useThemeColors';
import type { ThemeColors } from '../theme/tokens';

const ROUTE_D =
  'M85,12 Q76,19 68,26 Q58,21 48,16 Q38,24 28,32 Q40,39 52,46 Q63,51 74,56 Q56,61 38,66 Q28,59 18,52 Q16,63 14,74 Q23,81 33,88 Q20,91 8,94';

function getWaypoints(colors: ThemeColors): Array<{ cx: number; cy: number; r: number; fill: string }> {
  return [
    { cx: 85, cy: 12, r: 2.4, fill: colors.secondary },
    { cx: 68, cy: 26, r: 1.6, fill: colors.primaryDark },
    { cx: 48, cy: 16, r: 1.6, fill: colors.primaryDark },
    { cx: 28, cy: 32, r: 1.6, fill: colors.primaryDark },
    { cx: 52, cy: 46, r: 1.6, fill: colors.primaryDark },
    { cx: 74, cy: 56, r: 1.6, fill: colors.primaryDark },
    { cx: 38, cy: 66, r: 1.6, fill: colors.primaryDark },
    { cx: 18, cy: 52, r: 2, fill: colors.danger },
    { cx: 14, cy: 74, r: 1.6, fill: colors.primaryDark },
    { cx: 33, cy: 88, r: 1.6, fill: colors.primaryDark },
    { cx: 8, cy: 94, r: 2.6, fill: colors.secondaryLight },
  ];
}

export function RouteMapSvg() {
  const colors = useThemeColors();
  const WAYPOINTS = useMemo(() => getWaypoints(colors), [colors]);
  return (
    <Svg viewBox="0 0 100 100" width="100%" height={230}>
      <Path d={ROUTE_D} fill="none" stroke={colors.primary} strokeWidth={1.4} strokeDasharray="3 2.4" />
      <Line
        x1={85}
        y1={12}
        x2={8}
        y2={94}
        stroke={colors.gold}
        strokeWidth={0.6}
        strokeDasharray="1 3"
        opacity={0.5}
      />
      {WAYPOINTS.map((p, i) => (
        <Circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill={p.fill} />
      ))}
      <SvgText x={85} y={9} fontSize={3.4} fill={colors.textSecondary} textAnchor="end">
        Troia
      </SvgText>
      <SvgText x={18} y={49} fontSize={3.4} fill={colors.danger} textAnchor="middle">
        Sereias
      </SvgText>
      <SvgText x={8} y={99} fontSize={3.6} fill={colors.secondary} textAnchor="start" fontWeight="700">
        Ítaca
      </SvgText>
    </Svg>
  );
}
