/**
 * Sistema de Cores Global - Agenda Familiar
 * 
 * Define todas as cores usadas no aplicativo para fácil manutenção
 * e consistência visual. Suporta tema claro e escuro.
 */

export const Colors = {
    // Cores Primárias
    primary: '#007AFF',
    primaryDark: '#0051D5',
    primaryLight: '#4DA2FF',

    // Cores Secundárias
    secondary: '#5856D6',
    secondaryDark: '#3634A3',
    secondaryLight: '#7D7BE8',

    // Cores de Sucesso
    success: '#34C759',
    successDark: '#248A3D',
    successLight: '#5DD97C',

    // Cores de Aviso
    warning: '#FF9500',
    warningDark: '#C77700',
    warningLight: '#FFB340',

    // Cores de Erro/Perigo
    danger: '#FF3B30',
    error: '#FF3B30',
    errorDark: '#C4221A',
    errorLight: '#FF6259',

    // Cores de Informação
    info: '#5AC8FA',
    infoDark: '#32A5E7',
    infoLight: '#7DD6FB',

    // Cores Neutras - Tema Claro
    light: {
        background: '#FFFFFF',
        backgroundSecondary: '#F2F2F7',
        backgroundTertiary: '#E5E5EA',

        surface: '#FFFFFF',
        surfaceSecondary: '#F9F9F9',

        text: '#000000',
        textSecondary: '#666666',
        textTertiary: '#999999',
        textDisabled: '#C7C7CC',

        border: '#E0E0E0',
        borderLight: '#F0F0F0',
        borderDark: '#C7C7CC',

        shadow: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Cores Neutras - Tema Escuro
    dark: {
        background: '#000000',
        backgroundSecondary: '#1C1C1E',
        backgroundTertiary: '#2C2C2E',

        surface: '#1C1C1E',
        surfaceSecondary: '#2C2C2E',

        text: '#FFFFFF',
        textSecondary: '#AEAEB2',
        textTertiary: '#8E8E93',
        textDisabled: '#636366',

        border: '#38383A',
        borderLight: '#48484A',
        borderDark: '#2C2C2E',

        shadow: 'rgba(0, 0, 0, 0.3)',
        overlay: 'rgba(0, 0, 0, 0.7)',
    },

    // Cores de Categorias (para tarefas)
    categories: {
        work: '#FF9500',
        personal: '#5856D6',
        family: '#FF2D55',
        health: '#34C759',
        finance: '#FFD60A',
        education: '#007AFF',
        shopping: '#FF3B30',
        social: '#5AC8FA',
        other: '#8E8E93',
    },

    // Cores de Status
    status: {
        active: '#34C759',
        pending: '#FF9500',
        completed: '#5AC8FA',
        cancelled: '#8E8E93',
        overdue: '#FF3B30',
    },

    // Cores Transparentes
    transparent: 'transparent',
    white: '#FFFFFF',
    black: '#000000',

    // Cores com Opacidade
    opacity: {
        primary10: 'rgba(0, 122, 255, 0.1)',
        primary20: 'rgba(0, 122, 255, 0.2)',
        primary30: 'rgba(0, 122, 255, 0.3)',
        primary50: 'rgba(0, 122, 255, 0.5)',

        black10: 'rgba(0, 0, 0, 0.1)',
        black20: 'rgba(0, 0, 0, 0.2)',
        black30: 'rgba(0, 0, 0, 0.3)',
        black50: 'rgba(0, 0, 0, 0.5)',

        white10: 'rgba(255, 255, 255, 0.1)',
        white20: 'rgba(255, 255, 255, 0.2)',
        white30: 'rgba(255, 255, 255, 0.3)',
        white50: 'rgba(255, 255, 255, 0.5)',
    },
} as const;

/**
 * Tipo para tema (claro ou escuro)
 */
export type Theme = 'light' | 'dark';

/**
 * Função helper para obter cores baseadas no tema
 */
export const getThemeColors = (theme: Theme) => {
    return {
        // Cores principais
        primary: Colors.primary,
        primaryDark: Colors.primaryDark,
        primaryLight: Colors.primaryLight,

        secondary: Colors.secondary,
        success: Colors.success,
        warning: Colors.warning,
        danger: Colors.danger,
        error: Colors.error,
        info: Colors.info,

        // Cores neutras baseadas no tema
        background: Colors[theme].background,
        backgroundSecondary: Colors[theme].backgroundSecondary,
        backgroundTertiary: Colors[theme].backgroundTertiary,

        surface: Colors[theme].surface,
        surfaceSecondary: Colors[theme].surfaceSecondary,

        text: Colors[theme].text,
        textSecondary: Colors[theme].textSecondary,
        textTertiary: Colors[theme].textTertiary,
        textDisabled: Colors[theme].textDisabled,

        border: Colors[theme].border,
        borderLight: Colors[theme].borderLight,
        borderDark: Colors[theme].borderDark,

        shadow: Colors[theme].shadow,
        overlay: Colors[theme].overlay,

        // Cores de categorias e status
        categories: Colors.categories,
        status: Colors.status,

        // Utilitários
        transparent: Colors.transparent,
        white: Colors.white,
        black: Colors.black,
        opacity: Colors.opacity,
    };
};

/**
 * Tipo para as cores do tema
 */
export type ThemeColors = ReturnType<typeof getThemeColors>;

export default Colors;
