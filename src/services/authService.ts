
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { sendZapierEvent } from './zapierService';

export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  // Use raw query to get user role
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

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
  try {
    // First create the user in auth
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
      console.log("User created successfully, now adding role:", {
        user_id: data.user.id,
        role: role
      });
      
      // Add role to user_roles table using raw query
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ user_id: data.user.id, role: role }]);

      if (roleError) {
        console.error("Error adding user role:", roleError);
        throw roleError;
      }
      
      // Send event to Zapier if configured
      try {
        await sendZapierEvent('user_registration', {
          user_id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
          registration_date: new Date().toISOString(),
        });
      } catch (zapierError) {
        console.error('Error sending registration event to Zapier:', zapierError);
        // Non-critical error, don't throw
      }
    }

    return data;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
