import { StyleSheet } from 'react-native';
import { spacing, fontSize, fontWeight } from '@styles/spacing';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        headerTitle: {
            fontSize: fontSize.xl,
            fontWeight: fontWeight.bold,
            color: colors.text,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
        },
        emptyText: {
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginTop: spacing.md,
        },
        memberItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: spacing.md,
            marginHorizontal: spacing.lg,
            marginBottom: spacing.md,
        },
        memberInfo: {
            flex: 1,
        },
        memberName: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: colors.text,
        },
        memberEmail: {
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            marginTop: spacing.xs,
        },
        roleButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            gap: spacing.xs,
        },
        roleText: {
            fontSize: fontSize.sm,
            fontWeight: fontWeight.semibold,
            color: '#FFF',
        },
    });
