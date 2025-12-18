import { StyleSheet } from 'react-native';
import { spacing, fontSize, fontWeight } from '@styles/spacing';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: spacing.xl,
            justifyContent: 'center',
        },
        header: {
            alignItems: 'center',
            marginBottom: spacing.xl,
        },
        title: {
            fontSize: fontSize.xxl,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.sm,
        },
        subtitle: {
            fontSize: fontSize.base,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        modeSelector: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: spacing.xs,
            marginBottom: spacing.xl,
        },
        modeButton: {
            flex: 1,
            paddingVertical: spacing.md,
            alignItems: 'center',
            borderRadius: 6,
        },
        modeButtonActive: {
            backgroundColor: colors.primary,
        },
        modeButtonText: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: colors.textSecondary,
        },
        modeButtonTextActive: {
            color: '#FFF',
        },
        inputGroup: {
            marginBottom: spacing.md,
        },
        label: {
            fontSize: fontSize.sm,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.xs,
        },
        input: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: spacing.md,
            fontSize: fontSize.base,
            color: colors.text,
        },
        submitButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: spacing.md,
            alignItems: 'center',
            marginTop: spacing.md,
        },
        submitButtonText: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: '#FFF',
        },
    });
