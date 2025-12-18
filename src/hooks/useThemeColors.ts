import { useColorScheme } from 'react-native';
import { getThemeColors } from '@src/styles';
import type { Theme } from '@src/styles';
import { useUserStore } from '@store/userStore';

/**
 * Hook para obter as cores do tema atual
 * 
 * Retorna as cores baseadas na preferência do usuário ou no tema do sistema
 * 
 * @returns Objeto com todas as cores do tema atual
 * 
 * @example
 * ```tsx
 * const colors = useThemeColors();
 * 
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.text }}>Hello</Text>
 * </View>
 * ```
 */
export function useThemeColors() {
    const systemScheme = useColorScheme() ?? 'light';
    const { preferences } = useUserStore();

    // Se a preferência é 'system' ou undefined, usa o tema do sistema
    // Caso contrário, usa a preferência explícita ('light' ou 'dark')
    const activeTheme: Theme = (!preferences?.theme || preferences.theme === 'system')
        ? (systemScheme as Theme)
        : (preferences.theme as Theme);

    return getThemeColors(activeTheme);
}
