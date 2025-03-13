
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  // Use raw query to get user role
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
  
  return data?.role as UserRole;
};

export const signUpUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  role: UserRole
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;

  if (data?.user) {
    // Add role to user_roles table using raw query
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([{ user_id: data.user.id, role: role }]);

    if (roleError) throw roleError;
  }

  return data;
};

export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  
  return data;
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
