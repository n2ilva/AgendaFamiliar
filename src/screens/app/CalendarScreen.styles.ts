import { StyleSheet } from 'react-native';
import { spacing, fontSize } from '@styles/spacing';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            paddingBottom: spacing.xl,
        },
        calendarContainer: {
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        tasksContainer: {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
        },
        tasksSection: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
        },
        tasksHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.lg,
            gap: spacing.md,
        },
        tasksTitle: {
            fontSize: fontSize.lg,
            fontWeight: '600',
            color: colors.text,
            textTransform: 'capitalize',
        },
        sectionTitle: {
            fontSize: fontSize.lg,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.md,
        },
        emptyContainer: {
            padding: spacing.xl,
            alignItems: 'center',
        },
        emptyTasks: {
            alignItems: 'center',
            paddingVertical: spacing.xl,
        },
        emptyText: {
            fontSize: fontSize.base,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: spacing.md,
        },
    });
