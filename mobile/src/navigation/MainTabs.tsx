/**
 * MainTabs — Ãtaca App
 *
 * Bottom tabs das 5 telas principais: "Início", "Sereia", "Ciclope",
 * "Penélope" e "Divina". Ícones lineares em `react-native-svg`, cor
 * ativa `colors.primary`, inativa `colors.textTertiary`. `SaveFab` e
 * `TabWipeOverlay` (transição "rasgo de papiro" entre abas, equivalente a
 * `navWipe` de `Itaca App.dc.html`) são renderizados aqui, uma única vez,
 * por cima do conteúdo das telas e abaixo da tab bar.
 */

import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CyclopsIcon, DivineIcon, HomeIcon, PenelopeIcon, SirenIcon } from '../components/icons';
import { SaveFab } from '../components/SaveFab';
import { TabWipeOverlay, type TabWipeOverlayHandle } from '../components/TabWipeOverlay';
import { CyclopsScreen } from '../screens/CyclopsScreen';
import { DivineScreen } from '../screens/DivineScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PenelopeScreen } from '../screens/PenelopeScreen';
import { SirenScreen } from '../screens/SirenScreen';
import { spacing, typography } from '../theme/tokens';
import { useThemeColors } from '../theme/useThemeColors';
import type { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Delay antes de navegar de fato, igual ao `_wipeTimer` (190ms) do
// protótipo — a troca de tela acontece enquanto o rasgo cobre a tela.
const WIPE_NAVIGATE_DELAY_MS = 190;

export function MainTabs() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const wipeRef = useRef<TabWipeOverlayHandle>(null);
  const wipeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabBarHeight = spacing.bottomNavHeight + insets.bottom;

  // Cancela o timer de navegação pendente no unmount, evitando `navigate`
  // depois que o `MainTabs` já saiu da árvore.
  useEffect(
    () => () => {
      if (wipeTimerRef.current) {
        clearTimeout(wipeTimerRef.current);
      }
    },
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenListeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const activeRouteName = state.routes[state.index]?.name;
            if (route.name === activeRouteName) {
              return;
            }
            e.preventDefault();
            // Cancela um wipe/navegação anterior ainda pendente antes de
            // agendar o próximo — evita corrida se o usuário trocar de aba
            // rápido demais (equivalente ao `clearTimeout` de `go()` no
            // protótipo).
            if (wipeTimerRef.current) {
              clearTimeout(wipeTimerRef.current);
            }
            wipeRef.current?.play();
            wipeTimerRef.current = setTimeout(() => {
              navigation.navigate(route.name as never);
              wipeTimerRef.current = null;
            }, WIPE_NAVIGATE_DELAY_MS);
          },
        })}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            height: tabBarHeight,
            backgroundColor: colors.cardBeige,
            borderTopWidth: 1,
            borderTopColor: colors.tabBarBorder,
            paddingBottom: 6 + insets.bottom,
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter_600SemiBold',
            fontSize: typography.fontSize.micro,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Início',
            tabBarAccessibilityLabel: 'Início',
            tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          }}
        />
        <Tab.Screen
          name="Siren"
          component={SirenScreen}
          options={{
            tabBarLabel: 'Sereia',
            tabBarAccessibilityLabel: 'Sereia',
            tabBarIcon: ({ color }) => <SirenIcon color={color} />,
          }}
        />
        <Tab.Screen
          name="Cyclops"
          component={CyclopsScreen}
          options={{
            tabBarLabel: 'Ciclope',
            tabBarAccessibilityLabel: 'Ciclope',
            tabBarIcon: ({ color }) => <CyclopsIcon color={color} />,
          }}
        />
        <Tab.Screen
          name="Penelope"
          component={PenelopeScreen}
          options={{
            tabBarLabel: 'Penélope',
            tabBarAccessibilityLabel: 'Penélope',
            tabBarIcon: ({ color }) => <PenelopeIcon color={color} />,
          }}
        />
        <Tab.Screen
          name="Divine"
          component={DivineScreen}
          options={{
            tabBarLabel: 'Divina',
            tabBarAccessibilityLabel: 'Divina',
            tabBarIcon: ({ color }) => <DivineIcon color={color} />,
          }}
        />
      </Tab.Navigator>

      <TabWipeOverlay ref={wipeRef} style={{ bottom: tabBarHeight }} />
      <SaveFab bottomOffset={tabBarHeight + 18} />
    </View>
  );
}
