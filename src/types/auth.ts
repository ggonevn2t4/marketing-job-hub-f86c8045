
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'candidate' | 'employer';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithSocial: (provider: 'google') => Promise<void>;
  processAuthCallback: () => Promise<void>;
  signOut: (redirectPath?: string) => Promise<void>;
  logout: (redirectPath?: string) => Promise<void>;
}
