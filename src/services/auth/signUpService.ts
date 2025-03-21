
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { sendZapierEvent } from '../zapierService';
import { createUserRole } from './roleService';
import { createCandidateProfile, createCompanyProfile } from './profileService';

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
      
      const roleSuccess = await createUserRole(data.user.id, role);
      
      if (!roleSuccess) {
        if (data.user) {
          try {
            await supabase.auth.signOut();
            throw new Error("Failed to create user role");
          } catch (deleteError) {
            console.error("Error during user cleanup:", deleteError);
            throw new Error("Failed to create user role");
          }
        }
      }
      
      let profileSuccess = false;
      
      if (role === 'candidate') {
        profileSuccess = await createCandidateProfile(data.user.id, fullName);
      } else if (role === 'employer') {
        profileSuccess = await createCompanyProfile(data.user.id, fullName);
      }
      
      if (!profileSuccess) {
        console.error("Error creating profile");
        await supabase.auth.signOut();
        throw new Error("Failed to create user profile");
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
