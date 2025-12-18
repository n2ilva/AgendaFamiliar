import { StyleSheet } from 'react-native';
import { spacing, fontSize, fontWeight } from '@styles/spacing';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: spacing.xl,
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
        registerButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: spacing.md,
            alignItems: 'center',
            marginTop: spacing.md,
        },
        registerButtonText: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: '#FFF',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: spacing.xl,
        },
        footerText: {
            fontSize: fontSize.base,
            color: colors.textSecondary,
        },
        footerLink: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: colors.primary,
            marginLeft: spacing.xs,
        },
    });
