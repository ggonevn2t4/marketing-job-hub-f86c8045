
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { fetchUserRole } from './roleService';
import { createUserRole } from './roleService';
import { createCandidateProfile } from './profileService';
import { sendZapierEvent } from '../zapierService';

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
        
        const roleSuccess = await createUserRole(userId, role);

        if (!roleSuccess) {
          console.error("Error adding user role for social login");
          await supabase.auth.signOut();
          throw new Error("Failed to create user role for social login");
        }
        
        const profileSuccess = await createCandidateProfile(userId, fullName);
          
        if (!profileSuccess) {
          console.error("Error creating profile for social login");
          await supabase.auth.signOut();
          throw new Error("Failed to create profile for social login");
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
