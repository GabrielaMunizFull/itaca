/**
 * OnboardingScreen — Ãtaca App
 *
 * MVP cobre apenas o passo 1 do protótipo (`Itaca App.dc.html`): escolha de
 * arquétipo e nomes de herói/navio. Sem passo 2 (permissões) nem rótulo
 * "PASSO 1 DE 2" — o botão final usa o texto/estilo do botão de conclusão
 * do protótipo ("COMEÇAR JORNADA").
 */

import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore, type Archetype } from '../store/useAppStore';
import { radius, spacing, typography, type ThemeColors } from '../theme/tokens';
import { useThemeColors } from '../theme/useThemeColors';

const ARCHETYPES: Array<{ id: Archetype; name: string; initial: string }> = [
  { id: 'guerreiro', name: 'Guerreiro', initial: 'G' },
  { id: 'arqueiro', name: 'Arqueiro', initial: 'A' },
  { id: 'timoneiro', name: 'Timoneiro', initial: 'T' },
  { id: 'oraculo', name: 'Oráculo', initial: 'O' },
];

export function OnboardingScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [archetype, setArchetype] = useState<Archetype>('guerreiro');
  const [name, setName] = useState('');
  const [ship, setShip] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: 28 + insets.top, paddingBottom: spacing.xl + insets.bottom }]}>
      <Text style={styles.title}>Quem parte nessa jornada?</Text>

      <Text style={styles.label}>Escolha seu arquétipo</Text>
      <View style={styles.grid}>
        {ARCHETYPES.map((a) => {
          const selected = a.id === archetype;
          return (
            <TouchableOpacity
              key={a.id}
              onPress={() => setArchetype(a.id)}
              activeOpacity={0.85}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[
                styles.archetypeCard,
                {
                  backgroundColor: selected ? colors.secondary : colors.cardBeige,
                  borderColor: selected ? colors.secondary : colors.tabBarBorder,
                },
              ]}
            >
              <View style={styles.archetypeAvatar}>
                <Text style={[styles.archetypeInitial, { color: selected ? colors.cardWhite : colors.textSecondary }]}>
                  {a.initial}
                </Text>
              </View>
              <Text style={[styles.archetypeName, { color: selected ? colors.cardWhite : colors.textSecondary }]}>
                {a.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.fieldLabel}>Nome do herói</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Odisseu"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        maxLength={26}
      />

      <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Nome do navio</Text>
      <TextInput
        value={ship}
        onChangeText={setShip}
        placeholder="Argo II"
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        maxLength={30}
      />

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={() => completeOnboarding(name, ship, archetype)}
      >
        <Text style={styles.buttonText}>COMEÇAR JORNADA</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lgAlt,
  },
  title: {
    fontFamily: 'Cinzel_900Black',
    fontSize: typography.fontSize.titleMedium,
    color: colors.textPrimary,
    letterSpacing: 1,
    marginTop: 4,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gapMd,
  },
  archetypeCard: {
    width: '48%',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  archetypeAvatar: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archetypeInitial: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.creatureName - 2,
  },
  archetypeName: {
    marginTop: spacing.sm,
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.caption,
  },
  fieldLabel: {
    marginTop: spacing.lg,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiaryAccessible,
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
  button: {
    marginTop: spacing.xl,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.mdAlt,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.bodyLarge,
    color: colors.cardWhite,
    letterSpacing: 1,
  },
  });
}
