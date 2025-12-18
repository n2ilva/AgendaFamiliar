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
        emptySubText: {
            fontSize: fontSize.base,
            color: colors.textSecondary,
            marginTop: spacing.sm,
            textAlign: 'center',
        },
        requestItem: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: spacing.md,
            marginHorizontal: spacing.lg,
            marginBottom: spacing.md,
        },
        requestHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        requestTitle: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            flex: 1,
        },
        requestInfo: {
            marginBottom: spacing.sm,
        },
        requestLabel: {
            fontSize: fontSize.sm,
            color: colors.textSecondary,
        },
        requestValue: {
            fontSize: fontSize.base,
            color: colors.text,
            marginTop: spacing.xs,
        },
        buttonRow: {
            flexDirection: 'row',
            gap: spacing.md,
            marginTop: spacing.md,
        },
        approveButton: {
            flex: 1,
            backgroundColor: colors.success,
            borderRadius: 8,
            padding: spacing.md,
            alignItems: 'center',
        },
        rejectButton: {
            flex: 1,
            backgroundColor: colors.danger,
            borderRadius: 8,
            padding: spacing.md,
            alignItems: 'center',
        },
        buttonText: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: '#FFF',
        },
    });
