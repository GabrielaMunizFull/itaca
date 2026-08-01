/**
 * CyclopsScreen — Ãtaca App
 *
 * Scanner de Ciclope: viewfinder simulado, seletor de criatura-alvo, botão
 * de scan (com resultado irônico e histórico) e modal de compartilhamento.
 * Textos e dados copiados 1:1 de `Itaca App.dc.html` (`CREATURES`,
 * `runScan`, `pickCreature`, `openShare`/`closeShare`).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CyclopsViewfinderSvg } from '../components/CyclopsViewfinderSvg';
import { useAppStore } from '../store/useAppStore';
import { colors, radius, spacing, typography } from '../theme/tokens';
import { formatTime } from '../utils/format';

interface Creature {
  id: string;
  name: string;
  type: string;
  threat: string;
  conf: number;
  note: string;
}

const CREATURES: Creature[] = [
  {
    id: 'polifemo',
    name: 'Polifemo',
    type: 'Ciclope',
    threat: 'ALTA',
    conf: 98,
    note: 'Recomenda-se apresentar-se como "Ninguém". Funciona surpreendentemente bem.',
  },
  {
    id: 'cila',
    name: 'Cila',
    type: 'Fera Hexacéfala',
    threat: 'CRÍTICA',
    conf: 87,
    note: 'Perder 6 tripulantes é o preço de tabela. Não negocie.',
  },
  {
    id: 'caribdis',
    name: 'Caríbdis',
    type: 'Redemoinho Vivo',
    threat: 'CRÍTICA',
    conf: 91,
    note: 'Mantenha distância de 1 légua marítima. Não tente nadar "só um pouco mais perto".',
  },
  {
    id: 'lestrigoes',
    name: 'Lestrigões',
    type: 'Gigante Canibal',
    threat: 'ALTA',
    conf: 76,
    note: 'Eles atiram rochedos em navios. Considere um porto de entrada menos... convidativo.',
  },
  {
    id: 'circe',
    name: 'Circe',
    type: 'Feiticeira',
    threat: 'MÉDIA',
    conf: 64,
    note: 'Risco de transformação suína. Traga moly (vende-se separadamente).',
  },
];

const SCAN_DURATION_MS = 1300;

export function CyclopsScreen() {
  const selectedCreature = useAppStore((s) => s.selectedCreature);
  const pickCreature = useAppStore((s) => s.pickCreature);
  const scanHistory = useAppStore((s) => s.scanHistory);
  const addScanToHistory = useAppStore((s) => s.addScanToHistory);
  const insets = useSafeAreaInsets();

  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (scanTimerRef.current) {
        clearTimeout(scanTimerRef.current);
      }
    },
    []
  );

  const creature = CREATURES.find((c) => c.id === selectedCreature) ?? CREATURES[0];

  const handlePickCreature = (id: string) => {
    if (scanning) {
      return;
    }
    pickCreature(id);
    setScanDone(false);
  };

  const handleScan = () => {
    setScanning(true);
    setScanDone(false);
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
    }
    scanTimerRef.current = setTimeout(() => {
      setScanning(false);
      setScanDone(true);
      addScanToHistory({ name: creature.name, threat: creature.threat, time: formatTime(new Date()) });
      scanTimerRef.current = null;
    }, SCAN_DURATION_MS);
  };

  const handlePretendToBeNobody = () => {
    Alert.alert('Ninguém', 'Você agora se chama "Ninguém". Funciona surpreendentemente bem.');
  };

  const scanBtnLabel = scanning ? 'Escaneando…' : scanDone ? 'Escanear novamente' : 'Escanear criatura';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: spacing.lg + insets.top, paddingBottom: spacing.screenBottom + insets.bottom },
      ]}
    >
      <Text style={styles.label}>VISÃO AUMENTADA</Text>
      <Text style={styles.title}>Scanner de Ciclope</Text>

      <View style={styles.viewfinderCard}>
        <CyclopsViewfinderSvg scanning={scanning} focused={scanning || scanDone} />
        <View style={styles.recordingBadge}>
          <Text style={styles.recordingBadgeText}>● GRAVANDO</Text>
        </View>
        <View style={styles.confBadge}>
          <Text style={styles.confBadgeText}>{creature.conf}% confiança</Text>
        </View>
      </View>

      <Text style={styles.chipsLabel}>ALVO SIMULADO (DEMO)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        {CREATURES.map((c) => {
          const selected = c.id === selectedCreature;
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => handlePickCreature(c.id)}
              disabled={scanning}
              activeOpacity={0.85}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: scanning }}
              accessibilityLabel={c.name}
              style={[
                styles.chip,
                { backgroundColor: selected ? colors.secondary : colors.cardBeige },
                scanning && styles.chipDisabled,
              ]}
            >
              <Text style={[styles.chipText, { color: selected ? colors.cardWhite : colors.textSecondary }]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.scanButton}
        activeOpacity={0.85}
        onPress={handleScan}
        accessibilityRole="button"
        accessibilityLabel={scanBtnLabel}
      >
        <Text style={styles.scanButtonText}>{scanBtnLabel}</Text>
      </TouchableOpacity>

      {scanDone && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.resultHeaderText}>
              <Text style={styles.resultName}>{creature.name}</Text>
              <Text style={styles.resultType}>{creature.type}</Text>
            </View>
            <View style={styles.threatBadge}>
              <Text style={styles.threatBadgeText}>AMEAÇA {creature.threat}</Text>
            </View>
          </View>
          <Text style={styles.resultNote}>{creature.note}</Text>
          <TouchableOpacity
            style={styles.nobodyButton}
            activeOpacity={0.85}
            onPress={handlePretendToBeNobody}
            accessibilityRole="button"
            accessibilityLabel='Fingir ser "Ninguém"'
          >
            <Text style={styles.nobodyButtonText}>Fingir ser &quot;Ninguém&quot;</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            activeOpacity={0.85}
            onPress={() => setShareOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Compartilhar alerta"
          >
            <Text style={styles.shareButtonText}>Compartilhar alerta</Text>
          </TouchableOpacity>
        </View>
      )}

      {scanHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyLabel}>HISTÓRICO DE SCANS</Text>
          <View style={styles.historyList}>
            {scanHistory.map((h) => (
              <View key={h.id} style={styles.historyRow}>
                <Text style={styles.historyRowText}>
                  {h.name} · ameaça {h.threat}
                </Text>
                <Text style={styles.historyRowTime}>{h.time}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Modal visible={shareOpen} transparent animationType="fade" onRequestClose={() => setShareOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setShareOpen(false)}>
          <View style={styles.shareOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.shareModalCard}>
                <View style={styles.sharePreview}>
                  <Text style={styles.sharePreviewTitle}>Encontrei um(a) {creature.name}</Text>
                  <Text style={styles.sharePreviewSubtitle}>
                    Ameaça {creature.threat} · #AindaVivo #ÃtacaApp
                  </Text>
                </View>
                <Text style={styles.shareHint}>toque fora para fechar</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  title: {
    fontFamily: 'Cinzel_900Black',
    fontSize: typography.fontSize.titleLarge,
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  viewfinderCard: {
    marginTop: spacing.base - 2,
    backgroundColor: colors.viewfinderBg,
    borderRadius: radius.lgAlt,
    padding: spacing.md,
    aspectRatio: 1 / 1.05,
    overflow: 'hidden',
    position: 'relative',
  },
  recordingBadge: {
    position: 'absolute',
    top: spacing.md - 2,
    left: spacing.md - 2,
    backgroundColor: 'rgba(0,0,0,.5)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  recordingBadgeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.micro,
    color: colors.gold,
    letterSpacing: 0.5,
  },
  confBadge: {
    position: 'absolute',
    bottom: spacing.md - 2,
    right: spacing.md - 2,
    backgroundColor: 'rgba(0,0,0,.5)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  confBadgeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.micro,
    color: colors.cardWhite,
  },
  chipsLabel: {
    marginTop: spacing.base - 2,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
  chipsRow: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md + 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.fontSize.captionLarge,
  },
  scanButton: {
    marginTop: spacing.base - 2,
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  scanButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.body,
    color: colors.cardWhite,
    letterSpacing: 1,
  },
  resultCard: {
    marginTop: spacing.base - 2,
    backgroundColor: colors.cardBeige,
    borderRadius: radius.mdAlt,
    padding: spacing.base,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultHeaderText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  resultName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.creatureName,
    color: colors.textPrimary,
  },
  resultType: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  threatBadge: {
    backgroundColor: colors.danger,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md - 2,
    paddingVertical: 4,
  },
  threatBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.microLarge,
    color: colors.cardWhite,
  },
  resultNote: {
    marginTop: spacing.sm + 2,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.captionLarge,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  nobodyButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  nobodyButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.captionLarge,
    color: colors.cardWhite,
  },
  shareButton: {
    marginTop: spacing.sm,
    backgroundColor: 'transparent',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(23,69,79,.3)',
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  shareButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.fontSize.captionLarge,
    color: colors.secondary,
  },
  historySection: {
    marginTop: spacing.base - 2,
  },
  historyLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  historyList: {
    flexDirection: 'column',
    gap: 6,
  },
  historyRow: {
    backgroundColor: colors.cardWhite,
    borderRadius: radius.sm,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  historyRowText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
  },
  historyRowTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiaryAccessible,
  },
  shareOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23,20,14,.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl - 2,
  },
  shareModalCard: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: colors.background,
    borderRadius: radius.lgAlt,
    padding: spacing.lg,
  },
  sharePreview: {
    backgroundColor: colors.cardWhite,
    borderRadius: radius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  sharePreviewTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.bodyLarge,
    color: colors.textPrimary,
  },
  sharePreviewSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  shareHint: {
    marginTop: spacing.md,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
  },
});
