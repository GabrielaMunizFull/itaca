/**
 * RootNavigator — Ítaca App
 *
 * Mostra a `SplashScreen` primeiro (controlada por estado local
 * `splashActive`, não pelo store) e também enquanto o estado persistido
 * (Zustand `persist`/AsyncStorage) ainda não terminou de reidratar
 * (`hasHydrated`), evitando um flash de `OnboardingScreen` antes de saber se
 * o usuário já completou o onboarding. Em seguida, um native-stack decide
 * entre `OnboardingScreen` (se `!onboarded`) ou `MainTabs`. `SettingsScreen`
 * fica empilhada como modal sobre `MainTabs`, acessível a partir do ícone de
 * engrenagem na Home.
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabs } from './MainTabs';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { useAppStore } from '../store/useAppStore';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [splashActive, setSplashActive] = useState(true);
  const onboarded = useAppStore((s) => s.onboarded);
  const hasHydrated = useAppStore((s) => s.hasHydrated);

  if (splashActive || !hasHydrated) {
    return <SplashScreen onFinish={() => setSplashActive(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!onboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ presentation: 'modal' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
