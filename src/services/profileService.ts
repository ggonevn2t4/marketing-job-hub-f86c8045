
import { supabase } from '@/integrations/supabase/client';
import type { CandidateProfile, Education, Experience, Skill, CompanyProfile } from '@/types/profile';

// Hàm lấy thông tin profile ứng viên
export const fetchCandidateProfile = async (userId: string): Promise<CandidateProfile | null> => {
  // Lấy thông tin cơ bản từ profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  // Lấy thông tin học vấn
  const { data: education, error: educationError } = await supabase
    .from('education')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (educationError) {
    console.error('Error fetching education:', educationError);
  }

  // Lấy thông tin kinh nghiệm
  const { data: experience, error: experienceError } = await supabase
    .from('experience')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (experienceError) {
    console.error('Error fetching experience:', experienceError);
  }

  // Lấy thông tin kỹ năng
  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId);

  if (skillsError) {
    console.error('Error fetching skills:', skillsError);
  }

  return {
    ...profile,
    education: education || [],
    experience: experience || [],
    skills: skills || []
  };
};

// Cập nhật thông tin cơ bản
export const updateCandidateBasicInfo = async (userId: string, data: Partial<CandidateProfile>) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      phone: data.phone,
      bio: data.bio,
      address: data.address,
      date_of_birth: data.date_of_birth
    })
    .eq('id', userId);

  if (error) throw error;
  return true;
};

// Thêm học vấn mới
export const addEducation = async (education: Education) => {
  const { data, error } = await supabase
    .from('education')
    .insert([education])
    .select();

  if (error) throw error;
  return data[0];
};

// Cập nhật học vấn
export const updateEducation = async (id: string, education: Partial<Education>) => {
  const { error } = await supabase
    .from('education')
    .update(education)
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Xóa học vấn
export const deleteEducation = async (id: string) => {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Thêm kinh nghiệm mới
export const addExperience = async (experience: Experience) => {
  const { data, error } = await supabase
    .from('experience')
    .insert([experience])
    .select();

  if (error) throw error;
  return data[0];
};

// Cập nhật kinh nghiệm
export const updateExperience = async (id: string, experience: Partial<Experience>) => {
  const { error } = await supabase
    .from('experience')
    .update(experience)
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Xóa kinh nghiệm
export const deleteExperience = async (id: string) => {
  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Thêm kỹ năng mới
export const addSkill = async (skill: Skill) => {
  const { data, error } = await supabase
    .from('skills')
    .insert([skill])
    .select();

  if (error) throw error;
  return data[0];
};

// Cập nhật kỹ năng
export const updateSkill = async (id: string, skill: Partial<Skill>) => {
  const { error } = await supabase
    .from('skills')
    .update(skill)
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Xóa kỹ năng
export const deleteSkill = async (id: string) => {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// Lấy thông tin công ty
export const fetchCompanyProfile = async (companyId: string): Promise<CompanyProfile | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();

  if (error) {
    console.error('Error fetching company profile:', error);
    return null;
  }

  return data;
};

// Cập nhật thông tin công ty
export const updateCompanyProfile = async (companyId: string, data: Partial<CompanyProfile>) => {
  const { error } = await supabase
    .from('companies')
    .update(data)
    .eq('id', companyId);

  if (error) throw error;
  return true;
};
