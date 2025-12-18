/**
 * Estilos Globais - Agenda Familiar
 * 
 * Exporta cores, espaçamentos, fontes e outros tokens de design
 * para uso consistente em todo o aplicativo
 */

export { Colors, getThemeColors } from './colors';
export type { Theme, ThemeColors } from './colors';

/**
 * Espaçamentos padronizados
 */
export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
} as const;

/**
 * Tamanhos de fonte padronizados
 */
export const FontSize = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
} as const;

/**
 * Pesos de fonte
 */
export const FontWeight = {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
} as const;

/**
 * Border radius padronizados
 */
export const BorderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
} as const;

/**
 * Elevações/Sombras
 */
export const Elevation = {
    none: 0,
    low: 2,
    medium: 4,
    high: 8,
    highest: 16,
} as const;

/**
 * Durações de animação (em ms)
 */
export const AnimationDuration = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const;

/**
 * Z-index layers
 */
export const ZIndex = {
    background: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
} as const;

/**
 * Breakpoints para responsividade
 */
export const Breakpoints = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
} as const;

/**
 * Ícones de tamanho padrão
 */
export const IconSize = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
} as const;

// Exportação default com todos os tokens
export default {
    Spacing,
    FontSize,
    FontWeight,
    BorderRadius,
    Elevation,
    AnimationDuration,
    ZIndex,
    Breakpoints,
    IconSize,
};
