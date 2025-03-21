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

  // We need to check if portfolio_url and video_intro_url fields exist in the database
  // If not, we need to add the columns to the profiles table
  return {
    ...profile,
    education: education || [],
    experience: experience || [],
    skills: skills || [],
    portfolio_url: profile?.portfolio_url || null,
    video_intro_url: profile?.video_intro_url || null
  } as CandidateProfile;
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

// Tải lên CV
export const uploadResume = async (userId: string, file: File): Promise<string> => {
  // Tạo tên file duy nhất
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `resumes/${fileName}`;
  
  // Tạo bucket nếu chưa tồn tại
  const { data: bucketExists } = await supabase.storage.getBucket('resumes');
  if (!bucketExists) {
    await supabase.storage.createBucket('resumes', {
      public: true
    });
  }
  
  // Tải file lên storage
  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, file);
    
  if (uploadError) throw uploadError;
  
  // Lấy URL public
  const { data } = supabase.storage
    .from('resumes')
    .getPublicUrl(filePath);
    
  const resumeUrl = data.publicUrl;
  
  // Cập nhật URL vào profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ resume_url: resumeUrl })
    .eq('id', userId);
    
  if (updateError) throw updateError;
  
  return resumeUrl;
};

// Xóa CV
export const deleteResume = async (userId: string) => {
  // Lấy thông tin profile hiện tại
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('resume_url')
    .eq('id', userId)
    .single();
    
  if (fetchError) throw fetchError;
  
  // Nếu có file, xóa từ storage
  if (profile?.resume_url) {
    // Lấy tên file từ URL
    const url = new URL(profile.resume_url);
    const path = url.pathname;
    const filePath = path.split('/').slice(2).join('/'); // Bỏ qua /storage/v1/
    
    // Xóa file
    const { error: deleteError } = await supabase.storage
      .from('resumes')
      .remove([filePath]);
      
    if (deleteError) {
      console.error('Error deleting file:', deleteError);
      // Tiếp tục xử lý ngay cả khi xóa file bị lỗi
    }
  }
  
  // Cập nhật profile để xóa URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ resume_url: null })
    .eq('id', userId);
    
  if (updateError) throw updateError;
  
  return true;
};
