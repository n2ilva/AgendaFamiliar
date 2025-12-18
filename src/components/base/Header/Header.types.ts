import { ViewStyle, TextStyle } from 'react-native';

/**
 * Alinhamento do título
 */
export type HeaderAlignment = 'left' | 'center' | 'right';

/**
 * Props do componente Header
 */
export interface HeaderProps {
    /**
     * Título do header
     */
    title: string;

    /**
     * Subtítulo opcional
     */
    subtitle?: string;

    /**
     * Alinhamento do título
     * @default 'left'
     */
    alignment?: HeaderAlignment;

    /**
     * Ícone/botão à esquerda
     */
    leftAction?: React.ReactNode;

    /**
     * Ícone/botão à direita
     */
    rightAction?: React.ReactNode;

    /**
     * Cor de fundo do header
     */
    backgroundColor?: string;

    /**
     * Cor do título
     */
    titleColor?: string;

    /**
     * Cor do subtítulo
     */
    subtitleColor?: string;

    /**
     * Se true, adiciona borda inferior
     */
    bordered?: boolean;

    /**
     * Cor da borda
     */
    borderColor?: string;

    /**
     * Estilo customizado do container
     */
    containerStyle?: ViewStyle;

    /**
     * Estilo customizado do título
     */
    titleStyle?: TextStyle;

    /**
     * Estilo customizado do subtítulo
     */
    subtitleStyle?: TextStyle;
}
