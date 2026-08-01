/**
 * DivineScreen — Ãtaca App
 *
 * Central de Ajuda Divina: lista de contatos divinos com status de
 * disponibilidade, botão para silenciar/reativar Poseidon e SOS aos deuses
 * (modal com resposta irônica aleatória + histórico de invocações). Textos
 * e dados copiados 1:1 de `Itaca App.dc.html` (`CONTACTS`, `STATUS_COLOR`,
 * `DEITY_REPLIES`, `togglePoseidon`, `openSOS`/`closeSOS`).
 */

import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { colors, radius, spacing, typography } from '../theme/tokens';

type ContactStatus = 'online' | 'away' | 'busy' | 'danger' | 'blocked' | 'waiting';

interface Contact {
  id: string;
  name: string;
  role: string;
  status: ContactStatus;
  statusText: string;
  mutable: boolean;
}

const CONTACTS: Contact[] = [
  { id: 'atena', name: 'Atena', role: 'Deusa da Sabedoria', status: 'online', statusText: 'Online · responde em segundos', mutable: false },
  { id: 'hermes', name: 'Hermes', role: 'Mensageiro', status: 'away', statusText: 'Em trânsito entre reinos', mutable: false },
  { id: 'zeus', name: 'Zeus', role: 'Rei dos Deuses', status: 'busy', statusText: 'Ocupado (arremessando raios)', mutable: false },
  { id: 'poseidon', name: 'Poseidon', role: 'Deus dos Mares', status: 'danger', statusText: 'Ativo · extremamente irritado', mutable: true },
  { id: 'circe', name: 'Circe', role: 'Feiticeira', status: 'blocked', statusText: 'Bloqueada por você', mutable: false },
  { id: 'calipso', name: 'Calipso', role: 'Ninfa', status: 'waiting', statusText: 'Aguardando resposta · 7 anos', mutable: false },
];

interface ContactRowProps {
  contact: Contact;
  poseidonMuted: boolean;
  onTogglePoseidon: () => void;
}

function ContactRow({ contact, poseidonMuted, onTogglePoseidon }: ContactRowProps) {
  const isMutedPoseidon = contact.id === 'poseidon' && poseidonMuted;
  const dotColor = isMutedPoseidon ? colors.status.blocked : colors.status[contact.status];
  const statusText = isMutedPoseidon ? 'Silenciado · tempestades por sua conta e risco' : contact.statusText;
  const rowOpacity = contact.status === 'blocked' ? 0.55 : 1;

  return (
    <View
      style={[styles.contactRow, { opacity: rowOpacity }]}
      accessibilityLabel={`${contact.name}, ${statusText}`}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarInitial}>{contact.name[0]}</Text>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactRole}>{contact.role}</Text>
        <Text style={[styles.contactStatusText, { color: dotColor }]}>{statusText}</Text>
      </View>
      {contact.mutable && (
        <TouchableOpacity
          style={[styles.poseidonButton, { backgroundColor: poseidonMuted ? colors.cardBeige : colors.danger }]}
          activeOpacity={0.8}
          onPress={onTogglePoseidon}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={poseidonMuted ? 'Reativar Poseidon' : 'Silenciar Poseidon'}
        >
          <Text style={[styles.poseidonButtonText, { color: poseidonMuted ? colors.textSecondary : colors.cardWhite }]}>
            {poseidonMuted ? 'Reativar' : 'Silenciar'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function DivineScreen() {
  const poseidonMuted = useAppStore((s) => s.poseidonMuted);
  const togglePoseidon = useAppStore((s) => s.togglePoseidon);
  const sosLog = useAppStore((s) => s.sosLog);
  const openSOS = useAppStore((s) => s.openSOS);
  const insets = useSafeAreaInsets();

  const [sosOpen, setSosOpen] = useState(false);
  const [sosReply, setSosReply] = useState('');

  const handleOpenSOS = () => {
    const reply = openSOS();
    setSosReply(reply);
    setSosOpen(true);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: spacing.lg + insets.top, paddingBottom: spacing.screenBottom + insets.bottom },
      ]}
    >
      <Text style={styles.label}>SUPORTE OLÍMPICO</Text>
      <Text style={styles.title}>Central de Ajuda Divina</Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchText}>🔍 Buscar divindade, ninfa ou monstro amistoso…</Text>
      </View>

      <View style={styles.contactsList}>
        {CONTACTS.map((contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            poseidonMuted={poseidonMuted}
            onTogglePoseidon={togglePoseidon}
          />
        ))}
      </View>

      <View style={styles.warningBanner}>
        <Text style={styles.warningBannerText}>
          Aviso: silenciar Poseidon pode causar tempestades, atrasos de safra e comentários passivo-agressivos sobre
          seu cavalo de madeira.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.sosButton}
        activeOpacity={0.85}
        onPress={handleOpenSOS}
        accessibilityRole="button"
        accessibilityLabel="SOS aos deuses"
      >
        <Text style={styles.sosButtonText}>SOS AOS DEUSES</Text>
      </TouchableOpacity>

      {sosLog.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyLabel}>HISTÓRICO DE INVOCAÇÕES</Text>
          <View style={styles.historyList}>
            {sosLog.map((entry) => (
              <View key={entry.id} style={styles.historyRow}>
                <Text style={styles.historyRowTime}>{entry.time}</Text>
                <Text style={styles.historyRowReply}>{entry.reply}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Modal visible={sosOpen} transparent animationType="fade" onRequestClose={() => setSosOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setSosOpen(false)}>
          <View style={styles.sosOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sosModalCard}>
                <Text style={styles.sosModalTitle}>RESPOSTA DIVINA</Text>
                <Text style={styles.sosModalReply}>{sosReply}</Text>
                <Text style={styles.sosModalHint}>toque para fechar</Text>
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
  searchBox: {
    marginTop: spacing.base - 2,
    backgroundColor: colors.cardBeige,
    borderRadius: radius.mdAlt,
    paddingVertical: 11,
    paddingHorizontal: spacing.md + 2,
  },
  searchText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.captionLarge,
    color: colors.textTertiary,
  },
  contactsList: {
    marginTop: spacing.base - 2,
    flexDirection: 'column',
    gap: spacing.sm,
  },
  contactRow: {
    backgroundColor: colors.cardWhite,
    borderRadius: radius.mdAlt,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base - 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.cardBeige,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
  },
  avatarInitial: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 15, // valor exato do `.dc.html` (avatar de contato) — não faz parte da escala documentada
    color: colors.textSecondary,
  },
  dot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.cardWhite,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
  },
  contactRole: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.microLarge,
    color: colors.textTertiary,
  },
  contactStatusText: {
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
  },
  poseidonButton: {
    flexShrink: 0,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md - 1,
    paddingVertical: 7,
  },
  poseidonButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.microLarge,
  },
  warningBanner: {
    marginTop: spacing.base - 2,
    backgroundColor: colors.warningCream,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base - 2,
  },
  warningBannerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    lineHeight: 16.5,
  },
  sosButton: {
    marginTop: spacing.base - 2,
    width: '100%',
    backgroundColor: colors.danger,
    borderRadius: radius.mdAlt,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  sosButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.body,
    color: colors.cardWhite,
    letterSpacing: 1,
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
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  historyRowTime: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.caption,
    color: colors.textPrimary,
  },
  historyRowReply: {
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiaryAccessible,
  },
  sosOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23,20,14,.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl - 2,
  },
  sosModalCard: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: colors.background,
    borderRadius: radius.lgAlt,
    padding: spacing.xl - 2,
    alignItems: 'center',
  },
  sosModalTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: typography.fontSize.bodyLarge,
    color: colors.textPrimary,
    letterSpacing: 1,
    textAlign: 'center',
  },
  sosModalReply: {
    marginTop: spacing.sm + 2,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
    lineHeight: 20.8,
    textAlign: 'center',
  },
  sosModalHint: {
    marginTop: spacing.md,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
