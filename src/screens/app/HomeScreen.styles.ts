import { fontSize, spacing } from "@styles/spacing";
import { Platform, StyleSheet } from "react-native";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    statsContainer: {
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      paddingVertical: 4,
      gap: spacing.sm,
    },
    filterContainer: {
      marginTop: spacing.lg,
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.lg,
      ...(Platform.OS === "web"
        ? {
            maxWidth: "100%",
            overflow: "hidden" as const,
          }
        : {}),
    },
    filterContent: {
      gap: spacing.sm,
      flexDirection: "row",
    },
    filterChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      borderWidth: 1,
      marginRight: spacing.sm,
    },
    filterText: {
      fontSize: fontSize.sm,
      fontWeight: "500",
    },
    dateFilterContainer: {
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      justifyContent: "space-around",
      borderBottomWidth: 0,
      borderBottomColor: colors.border,
    },
    dateFilterTab: {
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    dateFilterText: {
      fontSize: fontSize.base,
      fontWeight: "500",
    },
    activeIndicator: {
      height: 3,
      width: "100%",
      marginTop: spacing.xs,
      borderRadius: 2,
    },
    statBox: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      alignItems: "center",
    },
    statNumber: {
      fontSize: fontSize.lg,
      fontWeight: "700",
      marginBottom: 2,
    },
    statLabel: {
      fontSize: fontSize.xs,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
    },
    emptyText: {
      fontSize: fontSize.lg,
      fontWeight: "600",
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
      position: "absolute",
      bottom: spacing.xl,
      right: spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
