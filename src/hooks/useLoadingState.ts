import { useState } from 'react';

/**
 * Custom hook to manage loading and refreshing states
 * Reduces duplication across multiple screens
 */
export const useLoadingState = (initialLoading = false) => {
    const [loading, setLoading] = useState(initialLoading);
    const [refreshing, setRefreshing] = useState(false);

    return {
        loading,
        setLoading,
        refreshing,
        setRefreshing,
    };
};
