import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { sendZapierEvent } from './zapierService';

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

export const signUpUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  role: UserRole
) => {
  try {
    console.log("Starting signup process for:", email, fullName, role);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("Signup auth error:", error);
      throw error;
    }

    if (data?.user) {
      console.log("User created successfully, now adding role:", {
        user_id: data.user.id,
        role: role
      });
      
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ user_id: data.user.id, role: role }]);

      if (roleError) {
        console.error("Error adding user role:", roleError);
        
        if (data.user) {
          try {
            await supabase.auth.signOut();
            throw roleError;
          } catch (deleteError) {
            console.error("Error during user cleanup:", deleteError);
            throw roleError;
          }
        }
        
        throw roleError;
      }
      
      if (role === 'candidate') {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id, 
            full_name: fullName,
          }]);
          
        if (profileError) {
          console.error("Error creating candidate profile:", profileError);
          await supabase.auth.signOut();
          throw profileError;
        }
      } else if (role === 'employer') {
        const { error: companyError } = await supabase
          .from('companies')
          .insert([{ 
            id: data.user.id, 
            name: fullName,
          }]);
          
        if (companyError) {
          console.error("Error creating company profile:", companyError);
          await supabase.auth.signOut();
          throw companyError;
        }
      }
      
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
      }
    }

    return data;
  } catch (error) {
    console.error("Sign up error:", error);
    await supabase.auth.signOut();
    throw error;
  }
};

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

export const handleAuthCallback = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Auth callback error:", error);
      throw error;
    }
    
    if (data.session?.user) {
      const userId = data.session.user.id;
      const userRole = await fetchUserRole(userId);
      
      if (!userRole) {
        console.log("New user via social login, creating default profile");
        
        const role: UserRole = 'candidate';
        
        const fullName = data.session.user.user_metadata.full_name || 
                         data.session.user.user_metadata.name || 
                         'User';
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role: role }]);

        if (roleError) {
          console.error("Error adding user role for social login:", roleError);
          await supabase.auth.signOut();
          throw roleError;
        }
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            full_name: fullName,
          }]);
          
        if (profileError) {
          console.error("Error creating profile for social login:", profileError);
          await supabase.auth.signOut();
          throw profileError;
        }
        
        try {
          await sendZapierEvent('user_registration', {
            user_id: userId,
            email: data.session.user.email,
            full_name: fullName,
            role: role,
            registration_date: new Date().toISOString(),
            provider: 'google',
          });
        } catch (zapierError) {
          console.error('Error sending registration event to Zapier:', zapierError);
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error("Handle auth callback error:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  console.log("Signing out user");
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Signout error:", error);
    throw error;
  }
  console.log("Signout successful");
};

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
