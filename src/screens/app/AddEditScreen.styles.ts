import { StyleSheet } from 'react-native';
import { spacing, fontSize, fontWeight } from '@styles/spacing';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            paddingBottom: spacing.xl,
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
        section: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
        },
        sectionTitle: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: colors.textSecondary,
            marginBottom: spacing.md,
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
        textArea: {
            height: 100,
            textAlignVertical: 'top',
        },
        dateTimeRow: {
            flexDirection: 'row',
            gap: spacing.md,
        },
        dateTimeButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: spacing.md,
        },
        dateTimeText: {
            fontSize: fontSize.base,
            color: colors.text,
        },
        pickerButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: spacing.md,
        },
        pickerText: {
            fontSize: fontSize.base,
            color: colors.text,
        },
        subtasksContainer: {
            marginTop: spacing.md,
        },
        subtaskItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: spacing.md,
            marginBottom: spacing.sm,
        },
        subtaskText: {
            flex: 1,
            fontSize: fontSize.base,
            color: colors.text,
            marginLeft: spacing.md,
        },
        addSubtaskButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            padding: spacing.md,
            marginTop: spacing.sm,
        },
        addSubtaskText: {
            fontSize: fontSize.base,
            color: colors.primary,
            marginLeft: spacing.sm,
        },
        saveButton: {
            backgroundColor: colors.primary,
            borderRadius: 8,
            padding: spacing.md,
            alignItems: 'center',
            marginHorizontal: spacing.lg,
            marginVertical: spacing.md,
        },
        saveButtonText: {
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            color: '#FFF',
        },
    });
