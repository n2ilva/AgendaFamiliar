import { ViewStyle, TextStyle } from 'react-native';

/**
 * Props do componente FilterButton
 */
export interface FilterButtonProps {
    /**
     * Label do filtro
     */
    label: string;

    /**
     * Se true, o filtro está ativo/selecionado
     */
    active?: boolean;

    /**
     * Ícone opcional
     */
    icon?: React.ReactNode;

    /**
     * Contador/badge opcional
     */
    count?: number;

    /**
     * Cor quando ativo
     */
    activeColor?: string;

    /**
     * Cor quando inativo
     */
    inactiveColor?: string;

    /**
     * Cor do texto quando ativo
     */
    activeTextColor?: string;

    /**
     * Cor do texto quando inativo
     */
    inactiveTextColor?: string;

    /**
     * Callback ao pressionar
     */
    onPress: () => void;

    /**
     * Estilo customizado do container
     */
    containerStyle?: ViewStyle;

    /**
     * Estilo customizado do texto
     */
    textStyle?: TextStyle;

    /**
     * Se true, mostra borda
     */
    bordered?: boolean;
}
