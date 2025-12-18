/**
 * Componentes Base Reutilizáveis
 * 
 * Todos os componentes seguem os princípios SOLID:
 * - Single Responsibility Principle (SRP)
 * - Open/Closed Principle (OCP)
 * - Liskov Substitution Principle (LSP)
 * - Interface Segregation Principle (ISP)
 * - Dependency Inversion Principle (DIP)
 */

// Button
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/Button.types';

// Card
export { Card } from './Card';
export type { CardProps, CardElevation } from './Card/Card.types';

// Header
export { Header } from './Header';
export type { HeaderProps, HeaderAlignment } from './Header/Header.types';

// FilterButton
export { FilterButton } from './FilterButton';
export type { FilterButtonProps } from './FilterButton/FilterButton.types';

// SettingsOption
export { SettingsOption } from './SettingsOption';
export type { SettingsOptionProps, SettingsOptionType } from './SettingsOption/SettingsOption.types';
