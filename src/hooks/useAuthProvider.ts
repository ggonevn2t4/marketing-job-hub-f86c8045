
import { useAuthState } from './auth/useAuthState';
import { useSignUp } from './auth/useSignUp';
import { useSignIn } from './auth/useSignIn';
import { useAuthCallback } from './auth/useAuthCallback';
import { useSignOut } from './auth/useSignOut';

export const useAuthProvider = () => {
  const authState = useAuthState();
  const { signUp } = useSignUp();
  const { signIn, signInWithSocial } = useSignIn();
  const { processAuthCallback } = useAuthCallback();
  const { signOut } = useSignOut();

  // For backward compatibility
  const logout = signOut;

  return {
    ...authState,
    signUp,
    signIn,
    signInWithSocial,
    processAuthCallback,
    signOut,
    logout,
  };
};
