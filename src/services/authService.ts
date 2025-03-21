
// This is now a barrel file that re-exports all authentication services
import { fetchUserRole } from './auth/roleService';
import { signUpUser } from './auth/signUpService';
import { signInUser, signInWithGoogle } from './auth/signInService';
import { handleAuthCallback } from './auth/authCallbackService';
import { signOutUser } from './auth/sessionService';
import { resetPassword } from './auth/passwordService';

export {
  fetchUserRole,
  signUpUser,
  signInUser,
  signInWithGoogle,
  handleAuthCallback,
  signOutUser,
  resetPassword
};
