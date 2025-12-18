import { StyleSheet } from 'react-native';
import { spacing, fontSize, fontWeight } from '@styles/spacing';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        container: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: spacing.xl,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        title: {
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            color: colors.text,
        },
        closeButton: {
            padding: spacing.sm,
        },
        optionsList: {
            maxHeight: 400,
        },
        option: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        optionSelected: {
            backgroundColor: colors.surface,
        },
        optionText: {
            fontSize: fontSize.base,
            color: colors.text,
            marginLeft: spacing.md,
        },
        optionTextSelected: {
            fontWeight: fontWeight.semibold,
            color: colors.primary,
        },
    });
