/**
 * MainTabs — Ãtaca App
 *
 * Bottom tabs do MVP: apenas "Início" e "Sereia" (escopo reduzido do
 * protótipo, que tem 5 abas). Ícones lineares em `react-native-svg`, cor
 * ativa `colors.primary`, inativa `colors.textTertiary`.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeIcon, SirenIcon } from '../components/icons';
import { HomeScreen } from '../screens/HomeScreen';
import { SirenScreen } from '../screens/SirenScreen';
import { colors, spacing, typography } from '../theme/tokens';
import type { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          height: spacing.bottomNavHeight + insets.bottom,
          backgroundColor: colors.cardBeige,
          borderTopWidth: 1,
          borderTopColor: 'rgba(46,36,24,.1)',
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
    </Tab.Navigator>
  );
}
