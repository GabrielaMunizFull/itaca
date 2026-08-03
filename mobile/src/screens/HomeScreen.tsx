/**
 * HomeScreen — Ãtaca App
 *
 * Visão geral da jornada: ETA duplo, clima, rota atual e próximos desvios.
 * Textos e valores copiados 1:1 de `Itaca App.dc.html`. Dropdown de
 * notificações é estado local (não vai pro `useAppStore`).
 */

import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BellIcon, GearIcon, SunIcon } from '../components/icons';
import { RouteMapSvg } from '../components/RouteMapSvg';
import type { MainTabsParamList, RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/useAppStore';
import { radius, shadows, spacing, typography, type ThemeColors } from '../theme/tokens';
import { useThemeColors } from '../theme/useThemeColors';

// Copiadas 1:1 do array `NOTIFICATIONS` em `Itaca App.dc.html`.
const NOTIFICATIONS = [
  'Nova zona de perigo detectada a 40m da rota.',
  'Penélope reagiu ao seu último sinal de vida.',
  'Zeus mencionou seu nome em vão (de novo).',
];

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const DEVIATIONS = [
  {
    title: 'Ilha dos Lotófagos',
    description: 'risco de esquecimento voluntário da missão',
  },
  {
    title: 'Território dos Ciclopes',
    description: 'reivindicado por 1 (um) monstro territorial',
  },
  {
    title: 'Eólia',
    description: 'ventos inclusos; uso indevido pela tripulação não coberto pela garantia',
  },
];

export function HomeScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const heroName = useAppStore((s) => s.heroName);
  const insets = useSafeAreaInsets();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);

  const toggleNotif = () => {
    setNotifOpen((open) => !open);
    setNotifSeen(true);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: spacing.lg + insets.top, paddingBottom: spacing.screenBottom + insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>BEM-VINDO DE VOLTA,</Text>
          <Text style={styles.heroName}>{heroName}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleNotif}
            accessibilityRole="button"
            accessibilityLabel={
              notifSeen ? 'Notificações' : `Notificações, ${NOTIFICATIONS.length} novas`
            }
            accessibilityState={{ expanded: notifOpen }}
            hitSlop={8}
          >
            <BellIcon color={colors.textSecondary} />
            {!notifSeen && (
              <View style={styles.notifBadge} importantForAccessibility="no-hide-descendants">
                <Text style={styles.notifBadgeText}>{NOTIFICATIONS.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
            accessibilityRole="button"
            accessibilityLabel="Abrir configurações"
            hitSlop={8}
          >
            <GearIcon color={colors.textSecondary} />
          </TouchableOpacity>

          {notifOpen && (
            <View style={styles.notifDropdown}>
              {NOTIFICATIONS.map((text) => (
                <Text key={text} style={styles.notifItem}>
                  {text}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.etaRow}>
        <View style={[styles.card, styles.etaCard]}>
          <Text style={styles.etaLabel}>TEMPO ESTIMADO</Text>
          <Text style={[styles.etaValue, { color: colors.secondary }]}>3 dias</Text>
          <Text style={styles.etaCaption}>segundo o oráculo</Text>
        </View>
        <View style={[styles.card, styles.etaCardWarning]}>
          <Text style={[styles.etaLabel, { color: colors.primaryDark }]}>TEMPO REAL (HISTÓRICO)</Text>
          <Text style={[styles.etaValue, { color: colors.primaryDark }]}>9 anos, 11 meses</Text>
          <Text style={styles.etaCaption}>baseado em 1 jornada anterior (a sua)</Text>
        </View>
      </View>

      <View style={styles.weatherCard}>
        <SunIcon color={colors.secondary} />
        <View>
          <Text style={styles.weatherTitle}>Aparentemente calmo</Text>
          <Text style={styles.weatherSubtitle}>Poseidon está fingindo não ver você</Text>
        </View>
      </View>

      <View style={styles.routeCard}>
        <View style={styles.routeHeader}>
          <Text style={styles.routeTitle}>ROTA ATUAL</Text>
          <View style={styles.routeLegend}>
            <Text style={[styles.legendText, { color: colors.gold }]}>— rota original</Text>
            <Text style={[styles.legendText, { color: colors.primary }]}>— desvios (94%)</Text>
          </View>
        </View>
        <RouteMapSvg />
      </View>

      <Text style={styles.sectionTitle}>PRÓXIMOS DESVIOS</Text>
      <View style={styles.deviationList}>
        {DEVIATIONS.map((d) => (
          <View key={d.title} style={styles.deviationCard}>
            <Text style={styles.deviationTitle}>{d.title}</Text>
            <Text style={styles.deviationDescription}>{d.description}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.85}
        onPress={() =>
          Alert.alert(
            'Rota ainda não existe',
            'Essa jornada começa quando o resto do app for construído. Volte em uns 9 anos.'
          )
        }
      >
        <Text style={styles.primaryButtonText}>INICIAR NAVEGAÇÃO</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        activeOpacity={0.85}
        onPress={() =>
          Alert.alert('Histórico indisponível', 'Os 14 desvios existem, só não em lugar nenhum ainda.')
        }
      >
        <Text style={styles.secondaryButtonText}>Ver histórico de desvios (14)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.screenBottom,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcome: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  heroName: {
    fontFamily: 'Cinzel_900Black',
    fontSize: typography.fontSize.heroName,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: spacing.sm,
    position: 'relative',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.cardBeige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.danger,
    borderRadius: radius.md - 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  notifBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.micro,
    color: colors.cardWhite,
    lineHeight: 12,
  },
  notifDropdown: {
    position: 'absolute',
    top: 42,
    right: 0,
    width: 230,
    backgroundColor: colors.cardWhite,
    borderRadius: radius.md,
    padding: spacing.sm,
    zIndex: 30,
    ...shadows.modal,
  },
  notifItem: {
    paddingVertical: 9,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textPrimary,
    lineHeight: 15,
  },
  etaRow: {
    flexDirection: 'row',
    gap: spacing.gapMd,
    marginTop: spacing.base,
  },
  card: {
    flex: 1,
    borderRadius: radius.mdAlt,
    padding: spacing.md,
    borderWidth: 1,
  },
  etaCard: {
    backgroundColor: colors.cardBeige,
    borderColor: colors.borderSubtle,
  },
  etaCardWarning: {
    backgroundColor: colors.warningCream,
    borderColor: colors.warningBorderStrong,
  },
  etaLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.microLarge,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  etaValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.title,
    marginTop: 4,
  },
  etaCaption: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.microLarge,
    color: colors.textTertiaryAccessible,
    marginTop: 2,
  },
  weatherCard: {
    marginTop: spacing.md,
    backgroundColor: colors.cardBeige,
    borderRadius: radius.mdAlt,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  weatherTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.captionLarge,
    color: colors.textPrimary,
  },
  weatherSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.microLarge,
    color: colors.textTertiaryAccessible,
    marginTop: 2,
  },
  routeCard: {
    marginTop: spacing.lgAlt,
    backgroundColor: colors.cardWhite,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  routeTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  routeLegend: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  legendText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.micro,
  },
  sectionTitle: {
    marginTop: spacing.lgAlt,
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  deviationList: {
    flexDirection: 'column',
    gap: spacing.gapSm,
    marginTop: spacing.sm,
  },
  deviationCard: {
    backgroundColor: colors.cardBeige,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base - 2,
  },
  deviationTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.captionLarge,
    color: colors.textPrimary,
  },
  deviationDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiaryAccessible,
    marginTop: 2,
  },
  primaryButton: {
    marginTop: spacing.lgAlt,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.mdAlt,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.bodyLarge,
    color: colors.cardWhite,
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: spacing.sm,
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.secondaryBorderSubtle,
    borderRadius: radius.mdAlt,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.fontSize.captionLarge,
    color: colors.secondary,
  },
  });
}
