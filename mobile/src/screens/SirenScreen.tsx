/**
 * SirenScreen — Ãtaca App
 *
 * Alerta de canto de sereia: mapa de perigo, banner de aviso, toggles de
 * mitigação e contador de sereias evitadas. Textos copiados 1:1 de
 * `Itaca App.dc.html`.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DangerMapSvg } from '../components/DangerMapSvg';
import { Toggle } from '../components/Toggle';
import { useAppStore } from '../store/useAppStore';
import { colors, radius, spacing, typography } from '../theme/tokens';

export function SirenScreen() {
  const mastTied = useAppStore((s) => s.mastTied);
  const toggleMast = useAppStore((s) => s.toggleMast);
  const earplugs = useAppStore((s) => s.earplugs);
  const toggleEarplugs = useAppStore((s) => s.toggleEarplugs);
  const sirenCount = useAppStore((s) => s.sirenCount);
  const sirenLog = useAppStore((s) => s.sirenLog);
  const registerSiren = useAppStore((s) => s.registerSiren);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: spacing.lg + insets.top, paddingBottom: spacing.screenBottom + insets.bottom },
      ]}
    >
      <Text style={styles.alertLabel}>ALERTA ATIVO</Text>
      <Text style={styles.title}>Canto de Sereia</Text>

      <View style={styles.mapCard}>
        <DangerMapSvg />
        <View style={styles.radiusBadge}>
          <Text style={styles.radiusBadgeText}>RAIO: 2.4 LÉGUAS</Text>
        </View>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Você está a <Text style={styles.bannerBold}>340m</Text> de uma zona de canto irresistível. Recomendamos
          ações drásticas e reversíveis.
        </Text>
      </View>

      <View style={styles.toggleCard}>
        <View style={styles.toggleContent}>
          <Text style={styles.toggleTitle}>Amarrar-me ao mastro</Text>
          <Text style={styles.toggleSubtitle}>recomendado pela Circe, testado em 1 herói</Text>
        </View>
        <Toggle value={mastTied} onValueChange={toggleMast} />
      </View>

      <View style={[styles.toggleCard, { marginTop: spacing.sm }]}>
        <View style={styles.toggleContent}>
          <Text style={styles.toggleTitle}>Cera nos ouvidos dos remadores</Text>
          <Text style={styles.toggleSubtitle}>seus remadores não te agradecerão, mas sobreviverão</Text>
        </View>
        <Toggle value={earplugs} onValueChange={toggleEarplugs} />
      </View>

      <View style={styles.counterCard}>
        <View>
          <Text style={styles.counterLabel}>SEREIAS EVITADAS</Text>
          <Text style={styles.counterValue}>{sirenCount}</Text>
        </View>
        <TouchableOpacity style={styles.registerButton} activeOpacity={0.85} onPress={registerSiren}>
          <Text style={styles.registerButtonText}>Registrar sereia evitada</Text>
        </TouchableOpacity>
      </View>

      {sirenLog.length > 0 && (
        <View style={styles.logSection}>
          <Text style={styles.logLabel}>ZONAS ENFRENTADAS</Text>
          <View style={styles.logList}>
            {sirenLog.map((z) => (
              <View key={z.id} style={styles.logRow}>
                <Text style={styles.logRowText}>Zona de sereia evitada</Text>
                <Text style={styles.logRowTime}>{z.time}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.legal}>
        Aviso: o app não se responsabiliza por decisões tomadas sob efeito de canto sobrenatural.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.screenBottom,
  },
  alertLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.danger,
    letterSpacing: 1,
  },
  title: {
    fontFamily: 'Cinzel_900Black',
    fontSize: typography.fontSize.titleLarge,
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  mapCard: {
    marginTop: spacing.base - 2,
    backgroundColor: colors.dangerMapBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  radiusBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.danger,
    borderRadius: radius.xl,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  radiusBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.microLarge,
    color: colors.cardWhite,
    letterSpacing: 0.5,
  },
  banner: {
    marginTop: spacing.base,
    backgroundColor: colors.warningCream,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base - 2,
  },
  bannerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.captionLarge,
    color: colors.textSecondary,
  },
  bannerBold: {
    fontFamily: 'Inter_700Bold',
  },
  toggleCard: {
    marginTop: spacing.base,
    backgroundColor: colors.cardBeige,
    borderRadius: radius.mdAlt,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleContent: {
    flex: 1,
    paddingRight: spacing.md,
  },
  toggleTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
  },
  toggleSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  counterCard: {
    marginTop: spacing.md,
    backgroundColor: colors.cardBeige,
    borderRadius: radius.mdAlt,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  counterValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.title,
    color: colors.secondary,
    marginTop: 2,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.base - 2,
    paddingVertical: 9,
  },
  registerButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.caption,
    color: colors.cardWhite,
  },
  logSection: {
    marginTop: spacing.base - 2,
  },
  logLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  logList: {
    flexDirection: 'column',
    gap: 6,
  },
  logRow: {
    backgroundColor: colors.cardWhite,
    borderRadius: radius.sm,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(46,36,24,.06)',
  },
  logRowText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
  },
  logRowTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiaryAccessible,
  },
  legal: {
    marginTop: spacing.base,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
