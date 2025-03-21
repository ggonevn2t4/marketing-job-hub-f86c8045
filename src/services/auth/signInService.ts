
import { supabase } from '@/integrations/supabase/client';

export const signInUser = async (email: string, password: string) => {
  try {
    console.log("Attempting signin for:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Signin error:", error);
      throw error;
    }
    
    console.log("Signin successful:", data.user?.id);
    return data;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log("Starting Google sign in");
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
    
    console.log("Google sign in initiated:", data);
    return data;
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};
