/**
 * Authentication Module Exports
 * 
 * This file exports all the authentication-related components and services
 * for the Cardano Kids platform.
 */

// Export types
export * from './types';

// Export services
export { authService } from './authService';
export { walletConnector } from './walletConnector';

// Export context
export { AuthProvider, useAuth } from './AuthContext';

// Export components
export { default as AdultLoginForm } from './components/AdultLoginForm';
export { default as ChildLoginForm } from './components/ChildLoginForm';
export { default as CreateChildAccount } from './components/CreateChildAccount';
export { default as ParentalConsentForm } from './components/ParentalConsentForm';
export { default as PicturePasswordInput } from './components/PicturePasswordInput';
export { default as WalletConnector } from './components/WalletConnector';