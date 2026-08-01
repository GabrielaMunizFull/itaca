/**
 * TabWipeOverlay — Ãtaca App
 *
 * Transição "rasgo de papiro" entre abas (equivalente a `navWipe`/
 * `wipeTear` de `Itaca App.dc.html`): overlay absoluto, sem interação,
 * cobrindo a área de conteúdo do `MainTabs` (não a tab bar), que desliza da
 * esquerda pra direita cobrindo e descobrindo a tela em ~520ms.
 */

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/tokens';

export interface TabWipeOverlayHandle {
  play: () => Promise<void>;
}

interface TabWipeOverlayProps {
  style?: StyleProp<ViewStyle>;
  onWipeComplete?: () => void;
}

// `clip-path: polygon(0 0,92% 0,88% 8%,96% 18%,85% 30%,94% 42%,87% 55%,95%
// 68%,89% 80%,93% 92%,90% 100%,0 100%)` de `Itaca App.dc.html`, convertido
// pra pontos "x,y" em viewBox 0-100.
const WIPE_PATH = 'M0,0 L92,0 L88,8 L96,18 L85,30 L94,42 L87,55 L95,68 L89,80 L93,92 L90,100 L0,100 Z';

const PHASE_IN_MS = 234;
const PHASE_HOLD_MS = 52;
const PHASE_OUT_MS = 234;

export const TabWipeOverlay = forwardRef<TabWipeOverlayHandle, TabWipeOverlayProps>(
  function TabWipeOverlay({ style, onWipeComplete }, ref) {
    const { width } = useWindowDimensions();
    const offset = width * 1.08;
    const translateX = useRef(new Animated.Value(-offset)).current;
    const isAnimating = useRef(false);

    useImperativeHandle(
      ref,
      () => ({
        /**
         * Toca a animação de rasgo. Idempotente: se já houver uma animação
         * em andamento, chamadas concorrentes são ignoradas (a Promise
         * resolve imediatamente, sem reiniciar o `Animated.Value` nem
         * disparar uma segunda sequência por cima da primeira).
         */
        play: () => {
          if (isAnimating.current) {
            return Promise.resolve();
          }
          isAnimating.current = true;
          return new Promise<void>((resolve) => {
            translateX.setValue(-offset);
            Animated.sequence([
              Animated.timing(translateX, {
                toValue: 0,
                duration: PHASE_IN_MS,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.delay(PHASE_HOLD_MS),
              Animated.timing(translateX, {
                toValue: offset,
                duration: PHASE_OUT_MS,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
            ]).start(() => {
              isAnimating.current = false;
              onWipeComplete?.();
              resolve();
            });
          });
        },
      }),
      [offset, onWipeComplete, translateX]
    );

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, transform: [{ translateX }] },
          style,
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Path fill={colors.primary} d={WIPE_PATH} />
        </Svg>
      </Animated.View>
    );
  }
);
