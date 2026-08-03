/**
 * PenelopeScreen — Ítaca App
 *
 * Status para Penélope: feed social somente-leitura de "provas de vida"
 * automáticas, post fixado de Penélope e botão para enviar um sinal manual.
 * Textos e dados copiados 1:1 de `Itaca App.dc.html` (`POSTS`, `sendSignal`,
 * `addReaction`, `pinnedText`, `postsView`).
 */

import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnchorIcon, QuestionIcon, ShieldIcon } from '../components/icons';
import { useAppStore } from '../store/useAppStore';
import type { Post, ReactionType } from '../store/useAppStore';
import { radius, spacing, typography, type ThemeColors } from '../theme/tokens';
import { useThemeColors } from '../theme/useThemeColors';

const PINNED_TEXT =
  '"Ainda voltando" às 06h03 pelo 9º ano consecutivo. Vou tricotar até você decidir chegar. — Penélope';

interface ReactionButtonProps {
  Icon: typeof AnchorIcon;
  count: number;
  label: string;
  onPress: () => void;
}

function ReactionButton({ Icon, count, label, onPress }: ReactionButtonProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity
      style={styles.reactionButton}
      activeOpacity={0.7}
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${count}`}
    >
      <Icon color={colors.textTertiary} size={14} />
      <Text style={styles.reactionCount}>{count}</Text>
    </TouchableOpacity>
  );
}

interface PostCardProps {
  post: Post;
  onReact: (postId: string, type: ReactionType) => void;
}

function PostCard({ post, onReact }: PostCardProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.postCard, post.dim && styles.postCardDim]}>
      <View style={styles.postHeader}>
        <Text style={styles.postDay}>
          DIA {post.day} · {post.time}
        </Text>
        <View style={styles.autoBadge}>
          <Text style={styles.autoBadgeText}>AUTO</Text>
        </View>
      </View>
      <Text style={styles.postText}>{post.text}</Text>
      <View style={styles.reactionsRow}>
        <ReactionButton
          Icon={AnchorIcon}
          count={post.reactions.anchor}
          label="Reagir com âncora"
          onPress={() => onReact(post.id, 'anchor')}
        />
        <ReactionButton
          Icon={ShieldIcon}
          count={post.reactions.shield}
          label="Reagir com escudo"
          onPress={() => onReact(post.id, 'shield')}
        />
        <ReactionButton
          Icon={QuestionIcon}
          count={post.reactions.question}
          label="Reagir com interrogação"
          onPress={() => onReact(post.id, 'question')}
        />
        <Text style={styles.likesText}>{post.likes} sobreviventes viram</Text>
      </View>
    </View>
  );
}

export function PenelopeScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const posts = useAppStore((s) => s.posts);
  const sendSignal = useAppStore((s) => s.sendSignal);
  const addReaction = useAppStore((s) => s.addReaction);
  const insets = useSafeAreaInsets();

  const header = (
    <View>
      <Text style={styles.label}>TIMELINE COMPARTILHADA</Text>
      <Text style={styles.title}>Status para Penélope</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerIcon}>⚓</Text>
        <Text style={styles.bannerText}>
          Só posts automáticos permitidos — evita promessas que você não vai cumprir.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.signalButton}
        activeOpacity={0.85}
        onPress={sendSignal}
        accessibilityRole="button"
        accessibilityLabel="Enviar sinal de vida agora"
      >
        <Text style={styles.signalButtonText}>Enviar sinal de vida agora</Text>
      </TouchableOpacity>

      <View style={styles.pinnedCard}>
        <Text style={styles.pinnedLabel}>PENÉLOPE — FIXADO</Text>
        <Text style={styles.pinnedText}>{PINNED_TEXT}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PostCard post={item} onReact={addReaction} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing.sm + 2 }} />}
      ListHeaderComponent={header}
      ListHeaderComponentStyle={styles.headerSpacing}
      contentContainerStyle={[
        styles.content,
        { paddingTop: spacing.lg + insets.top, paddingBottom: spacing.screenBottom + insets.bottom },
      ]}
    />
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
  headerSpacing: {
    marginBottom: spacing.base - 2,
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
  banner: {
    marginTop: spacing.base - 2,
    backgroundColor: colors.cardBeige,
    borderRadius: radius.mdAlt,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bannerIcon: {
    fontSize: typography.fontSize.captionLarge,
    color: colors.textTertiary,
    opacity: 0.6,
  },
  bannerText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.captionLarge,
    color: colors.textTertiary,
  },
  signalButton: {
    marginTop: spacing.sm + 2,
    width: '100%',
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  signalButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.captionLarge,
    color: colors.cardWhite,
  },
  pinnedCard: {
    marginTop: spacing.base - 2,
    backgroundColor: colors.oliveLight,
    borderLeftWidth: 3,
    borderLeftColor: colors.oliveDark,
    borderRadius: radius.mdAlt,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base - 2,
  },
  pinnedLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.caption,
    color: colors.penelopeLabel,
  },
  pinnedText: {
    marginTop: spacing.xs,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    lineHeight: 19.5,
  },
  postCard: {
    backgroundColor: colors.cardWhite,
    borderRadius: radius.mdAlt,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  postCardDim: {
    opacity: 0.6,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  postDay: {
    fontFamily: 'Inter_700Bold',
    fontSize: typography.fontSize.caption,
    color: colors.secondary,
  },
  autoBadge: {
    backgroundColor: colors.cardBeige,
    borderRadius: radius.sm - 2,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  autoBadgeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.micro,
    color: colors.textTertiary,
  },
  postText: {
    marginTop: spacing.sm,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    lineHeight: 19.5,
  },
  reactionsRow: {
    marginTop: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reactionCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.caption,
    color: colors.textTertiary,
  },
  likesText: {
    marginLeft: 'auto',
    fontFamily: 'Inter_400Regular',
    fontSize: typography.fontSize.microLarge,
    color: colors.textTertiary,
  },
  });
}
