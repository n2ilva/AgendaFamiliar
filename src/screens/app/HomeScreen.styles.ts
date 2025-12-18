import { StyleSheet } from 'react-native';
import { spacing, fontSize } from '@styles/spacing';

export const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        statsContainer: {
            flexDirection: 'row',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.xs,
            gap: spacing.md,
        },
        filterContainer: {
            paddingBottom: spacing.sm,
        },
        filterContent: {
            paddingHorizontal: spacing.lg,
            gap: spacing.sm,
        },
        filterChip: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: 20,
            borderWidth: 1,
            marginRight: spacing.sm,
        },
        filterText: {
            fontSize: fontSize.sm,
            fontWeight: '500',
        },
        dateFilterContainer: {
            flexDirection: 'row',
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
            justifyContent: 'space-around',
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        dateFilterTab: {
            alignItems: 'center',
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.lg,
        },
        dateFilterText: {
            fontSize: fontSize.base,
            fontWeight: '500',
        },
        activeIndicator: {
            height: 3,
            width: '100%',
            marginTop: spacing.xs,
            borderRadius: 2,
        },
        statBox: {
            flex: 1,
            borderRadius: 12,
            padding: spacing.md,
            alignItems: 'center',
        },
        statNumber: {
            fontSize: fontSize.xl,
            fontWeight: '700',
            marginBottom: spacing.xs,
        },
        statLabel: {
            fontSize: fontSize.sm,
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
        },
        emptyText: {
            fontSize: fontSize.lg,
            fontWeight: '600',
            marginTop: spacing.md,
        },
        emptySubText: {
            fontSize: fontSize.base,
            marginTop: spacing.sm,
        },
        listContent: {
            paddingVertical: spacing.md,
            paddingBottom: 80,
        },
        fab: {
            position: 'absolute',
            bottom: spacing.xl,
            right: spacing.lg,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
    });
