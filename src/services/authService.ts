import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { sendZapierEvent } from './zapierService';

export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    console.log("Fetching role for user:", userId);
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

    if (error) {
      console.error("Signup auth error:", error);
      throw error;
    }

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
        
        // Xóa người dùng đã tạo vì không thể thêm vai trò
        if (data.user) {
          try {
            // Admin function to delete the user - but this won't work with client API
            // Thay vào đó, đăng xuất và ném lỗi
            await supabase.auth.signOut();
            throw roleError;
          } catch (deleteError) {
            console.error("Error during user cleanup:", deleteError);
            throw roleError;
          }
        }
        
        throw roleError;
      }
      
      // Initialize profile or company record based on role
      if (role === 'candidate') {
        // Create candidate profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: data.user.id, 
            full_name: fullName,
          }]);
          
        if (profileError) {
          console.error("Error creating candidate profile:", profileError);
          // Đăng xuất và ném lỗi khi không thể tạo profile
          await supabase.auth.signOut();
          throw profileError;
        }
      } else if (role === 'employer') {
        // Create company profile
        const { error: companyError } = await supabase
          .from('companies')
          .insert([{ 
            id: data.user.id, 
            name: fullName,
          }]);
          
        if (companyError) {
          console.error("Error creating company profile:", companyError);
          // Đăng xuất và ném lỗi khi không thể tạo profile
          await supabase.auth.signOut();
          throw companyError;
        }
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
    // Đảm bảo người dùng được đăng xuất nếu có lỗi
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
