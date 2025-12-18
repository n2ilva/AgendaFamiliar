import { ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';

/**
 * Variantes de botão disponíveis
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Tamanhos de botão disponíveis
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Props do componente Button
 * Segue o Interface Segregation Principle (ISP) - apenas props necessárias
 */
export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /**
   * Texto do botão
   */
  title?: string;

  /**
   * Variante visual do botão
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Tamanho do botão
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Ícone à esquerda do texto
   */
  leftIcon?: React.ReactNode;

  /**
   * Ícone à direita do texto
   */
  rightIcon?: React.ReactNode;

  /**
   * Se true, mostra loading spinner
   */
  loading?: boolean;

  /**
   * Se true, botão ocupa toda a largura disponível
   */
  fullWidth?: boolean;

  /**
   * Estilo customizado do container
   */
  containerStyle?: ViewStyle;

  /**
   * Estilo customizado do texto
   */
  textStyle?: TextStyle;

  /**
   * Cor customizada (sobrescreve a variante)
   */
  customColor?: string;

  /**
   * Callback ao pressionar
   */
  onPress?: () => void;
}
