
import { supabase } from '@/integrations/supabase/client';

export const createCandidateProfile = async (userId: string, fullName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({ 
        id: userId, 
        full_name: fullName,
      });
      
    if (error) {
      console.error("Error creating candidate profile:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error creating candidate profile:", error);
    return false;
  }
};

export const createCompanyProfile = async (userId: string, companyName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('companies')
      .insert({ 
        id: userId, 
        name: companyName,
      });
      
    if (error) {
      console.error("Error creating company profile:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error creating company profile:", error);
    return false;
  }
};
