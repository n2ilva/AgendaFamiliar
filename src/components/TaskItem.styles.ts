import { StyleSheet } from 'react-native';
import { spacing, fontSize, fontWeight } from '@styles/spacing';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: spacing.md,
            marginHorizontal: spacing.lg,
            marginBottom: spacing.md,
            borderLeftWidth: 4,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: spacing.sm,
        },
        titleContainer: {
            flex: 1,
            marginRight: spacing.md,
        },
        title: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: colors.text,
        },
        titleCompleted: {
            textDecorationLine: 'line-through',
            color: colors.textSecondary,
        },
        description: {
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            marginTop: spacing.xs,
        },
        metadata: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: spacing.md,
            marginTop: spacing.sm,
        },
        metadataItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
        },
        metadataText: {
            fontSize: fontSize.sm,
            color: colors.textSecondary,
        },
        categoryBadge: {
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: 12,
        },
        categoryText: {
            fontSize: fontSize.xs,
            fontWeight: fontWeight.semibold,
            color: '#FFF',
        },
        checkbox: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        checkboxChecked: {
            backgroundColor: colors.success,
            borderColor: colors.success,
        },
        subtasksContainer: {
            marginTop: spacing.md,
            paddingTop: spacing.md,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        subtaskItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        subtaskText: {
            flex: 1,
            fontSize: fontSize.sm,
            color: colors.text,
            marginLeft: spacing.sm,
        },
        subtaskTextCompleted: {
            textDecorationLine: 'line-through',
            color: colors.textSecondary,
        },
    });
