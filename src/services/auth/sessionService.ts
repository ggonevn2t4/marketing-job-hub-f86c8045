
import { supabase } from '@/integrations/supabase/client';

export const signOutUser = async () => {
  console.log("Signing out user");
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Signout error:", error);
    throw error;
  }
  console.log("Signout successful");
};
