import { ViewStyle, TextStyle } from 'react-native';

/**
 * Tipo de opção de configuração
 */
export type SettingsOptionType = 'navigation' | 'toggle' | 'action';

/**
 * Props do componente SettingsOption
 */
export interface SettingsOptionProps {
    /**
     * Título da opção
     */
    title: string;

    /**
     * Descrição/subtítulo opcional
     */
    description?: string;

    /**
     * Ícone à esquerda
     */
    icon?: React.ReactNode;

    /**
     * Tipo de opção
     * @default 'navigation'
     */
    type?: SettingsOptionType;

    /**
     * Valor do toggle (apenas para type='toggle')
     */
    toggleValue?: boolean;

    /**
     * Callback para mudança do toggle
     */
    onToggleChange?: (value: boolean) => void;

    /**
     * Callback ao pressionar (para type='navigation' ou 'action')
     */
    onPress?: () => void;

    /**
     * Cor do ícone
     */
    iconColor?: string;

    /**
     * Cor de fundo do container do ícone
     */
    iconBackgroundColor?: string;

    /**
     * Se true, mostra indicador de carregamento
     */
    loading?: boolean;

    /**
     * Se true, desabilita a opção
     */
    disabled?: boolean;

    /**
     * Se true, mostra borda inferior
     */
    bordered?: boolean;

    /**
     * Estilo customizado do container
     */
    containerStyle?: ViewStyle;

    /**
     * Estilo customizado do título
     */
    titleStyle?: TextStyle;

    /**
     * Estilo customizado da descrição
     */
    descriptionStyle?: TextStyle;
}
