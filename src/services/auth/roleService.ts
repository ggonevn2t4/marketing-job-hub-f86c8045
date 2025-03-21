
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    console.log("Fetching role for user:", userId);
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    console.log("User role data:", data);
    return data?.role as UserRole;
  } catch (error) {
    console.error('Unexpected error in fetchUserRole:', error);
    return null;
  }
};

export const createUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: role });

    if (error) {
      console.error("Error adding user role:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error creating user role:", error);
    return false;
  }
};
