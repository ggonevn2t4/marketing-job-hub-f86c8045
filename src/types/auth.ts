
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'candidate' | 'employer';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: (redirectPath?: string) => Promise<void>;
  // Keep backward compatibility with 'logout'
  logout: (redirectPath?: string) => Promise<void>;
}
