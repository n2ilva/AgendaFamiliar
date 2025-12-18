/**
 * SplashScreen - Tela de carregamento inicial
 * 
 * Exibida enquanto verifica autenticação do usuário
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@hooks/useThemeColors';
import { Spacing, FontSize } from '@src/styles';

export const SplashScreen: React.FC = () => {
    const colors = useThemeColors();
    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Logo ou nome do app */}
                <Text style={styles.title}>Agenda Familiar</Text>

                {/* Loading indicator */}
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                    style={styles.loader}
                />

                <Text style={styles.subtitle}>Carregando...</Text>
            </View>
        </View>
    );
};

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        gap: Spacing.lg,
    },
    title: {
        fontSize: FontSize.xxxl,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: Spacing.md,
    },
    loader: {
        marginVertical: Spacing.md,
    },
    subtitle: {
        fontSize: FontSize.base,
        color: colors.textSecondary,
    },
});

export default SplashScreen;
