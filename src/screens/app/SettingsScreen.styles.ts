import { StyleSheet } from 'react-native';
import { spacing, fontSize, fontWeight } from '@styles/spacing';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        section: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        sectionTitle: {
            fontSize: fontSize.lg,
            fontWeight: fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.md,
        },
        profileBox: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: spacing.md,
        },
        avatarContainer: {
            marginRight: spacing.md,
        },
        avatarImage: {
            width: 48,
            height: 48,
            borderRadius: 24,
            marginRight: spacing.md,
        },
        profileInfo: {
            flex: 1,
        },
        profileName: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.xs,
        },
        profileEmail: {
            fontSize: fontSize.sm,
            color: colors.textSecondary,
        },
        linkButton: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
            padding: 8,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            alignSelf: 'flex-start',
            gap: 8,
        },
        linkText: {
            color: colors.primary,
            fontWeight: '600',
        },
        settingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: spacing.md,
            marginBottom: spacing.md,
        },
        settingLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: spacing.md,
        },
        settingTextContainer: {
            flex: 1,
        },
        settingLabel: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: colors.text,
        },
        settingValue: {
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            marginTop: spacing.xs,
        },
        logoutButton: {
            backgroundColor: colors.danger,
            borderRadius: 12,
            padding: spacing.md,
            alignItems: 'center',
        },
        logoutText: {
            color: '#FFF',
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
        },
    });
