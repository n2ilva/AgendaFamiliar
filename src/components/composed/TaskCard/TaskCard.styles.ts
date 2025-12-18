/**
 * TaskCard Styles
 * 
 * Estilos para o componente TaskCard
 */

import { StyleSheet } from 'react-native';
import { Spacing, FontSize, FontWeight, BorderRadius } from '@src/styles';
import type { ThemeColors } from '@src/styles';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.md,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: BorderRadius.sm,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    checkboxOverdue: {
        borderColor: colors.danger,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold as any,
        color: colors.text,
        marginBottom: Spacing.xs,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: colors.textSecondary,
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginTop: Spacing.xs,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    detailText: {
        fontSize: FontSize.xs,
        color: colors.textTertiary,
    },
    categoryBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs / 2,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
    },
    categoryText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold as any,
        color: colors.white,
    },
    overdueIndicator: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 8,
        height: 8,
        borderRadius: BorderRadius.full,
        backgroundColor: colors.danger,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    skipButton: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.backgroundSecondary,
    },
    skipButtonText: {
        fontSize: FontSize.xs,
        color: colors.textSecondary,
        fontWeight: FontWeight.medium as any,
    },
});
