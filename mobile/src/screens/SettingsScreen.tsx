/**
 * SettingsScreen — Ãtaca App
 *
 * Editar nome do herói/navio. Modo noturno e "recomeçar jornada" ficam
 * fora do escopo MVP (`Itaca App.dc.html` seção 7).
 */

import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/useAppStore';
import { colors, radius, spacing, typography } from '../theme/tokens';

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Settings'>>();
  const heroName = useAppStore((s) => s.heroName);
  const shipName = useAppStore((s) => s.shipName);
  const saveSettings = useAppStore((s) => s.saveSettings);
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(heroName);
  const [ship, setShip] = useState(shipName);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: spacing.xl + insets.top, paddingBottom: spacing.screenBottom + insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>CONFIGURAÇÕES</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          hitSlop={8}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.fieldLabel}>Nome do herói</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} maxLength={26} />

      <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Nome do navio</Text>
      <TextInput value={ship} onChangeText={setShip} style={styles.input} maxLength={30} />

      <TouchableOpacity
        style={styles.saveButton}
        activeOpacity={0.85}
        onPress={() => saveSettings(name, ship)}
      >
        <Text style={styles.saveButtonText}>Salvar alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lgAlt,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Cinzel_900Black',
    fontSize: typography.fontSize.title,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.cardBeige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
  },
  fieldLabel: {
    marginTop: spacing.lg,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
  },
  input: {
    marginTop: spacing.sm,
    backgroundColor: colors.cardWhite,
    borderWidth: 1,
    borderColor: colors.borderSubtleStrong,
    borderRadius: radius.sm,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: spacing.md,
    width: '100%',
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.captionLarge,
    color: colors.cardWhite,
  },
});
