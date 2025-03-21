
import { supabase } from '@/integrations/supabase/client';

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};
