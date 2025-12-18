import { ViewStyle, TouchableOpacityProps } from 'react-native';

/**
 * Variantes de elevação do card
 */
export type CardElevation = 'none' | 'low' | 'medium' | 'high';

/**
 * Props do componente Card
 */
export interface CardProps extends Omit<TouchableOpacityProps, 'style'> {
    /**
     * Conteúdo do card
     */
    children: React.ReactNode;

    /**
     * Elevação/sombra do card
     * @default 'low'
     */
    elevation?: CardElevation;

    /**
     * Cor de fundo do card
     */
    backgroundColor?: string;

    /**
     * Padding interno do card
     * @default 16
     */
    padding?: number;

    /**
     * Border radius do card
     * @default 12
     */
    borderRadius?: number;

    /**
     * Se true, card é clicável
     */
    pressable?: boolean;

    /**
     * Callback ao pressionar (apenas se pressable=true)
     */
    onPress?: () => void;

    /**
     * Estilo customizado do container
     */
    containerStyle?: ViewStyle;

    /**
     * Se true, adiciona borda
     */
    bordered?: boolean;

    /**
     * Cor da borda (apenas se bordered=true)
     */
    borderColor?: string;
}
