/**
 * Translates Firebase authentication error codes to user-friendly Portuguese messages
 */
export const translateAuthError = (error: any): string => {
  const errorCode = error?.code || '';
  const errorMessage = error?.message || '';

  // Firebase Auth Error Codes
  const errorMessages: Record<string, string> = {
    // Login errors
    'auth/invalid-email': 'Email inválido. Verifique o formato do email.',
    'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o suporte.',
    'auth/user-not-found': 'Email ou senha incorretos.',
    'auth/wrong-password': 'Email ou senha incorretos.',
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente mais tarde.',
    
    // Registration errors
    'auth/email-already-in-use': 'Este email já está cadastrado. Faça login ou use outro email.',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/operation-not-allowed': 'Operação não permitida. Entre em contato com o suporte.',
    
    // Network errors
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet e tente novamente.',
    'auth/timeout': 'A operação demorou muito. Tente novamente.',
    
    // General errors
    'auth/requires-recent-login': 'Por segurança, faça login novamente para continuar.',
    'auth/user-token-expired': 'Sua sessão expirou. Faça login novamente.',
    'auth/invalid-api-key': 'Erro de configuração. Entre em contato com o suporte.',
    'auth/app-not-authorized': 'Aplicativo não autorizado. Entre em contato com o suporte.',
    
    // Google Sign-In errors
    'auth/popup-closed-by-user': 'Login cancelado. Tente novamente.',
    'auth/cancelled-popup-request': 'Login cancelado.',
    'auth/popup-blocked': 'Pop-up bloqueado. Permita pop-ups para fazer login.',
    'auth/account-exists-with-different-credential': 'Já existe uma conta com este email usando outro método de login.',
  };

  // Return translated message or a generic one
  return errorMessages[errorCode] || 'Erro ao processar sua solicitação. Tente novamente.';
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Gets password strength message
 */
export const getPasswordStrengthMessage = (password: string): string => {
  if (password.length === 0) return '';
  if (password.length < 6) return 'Senha muito curta (mínimo 6 caracteres)';
  if (password.length < 8) return 'Senha fraca';
  if (password.length < 12) return 'Senha média';
  return 'Senha forte';
};
