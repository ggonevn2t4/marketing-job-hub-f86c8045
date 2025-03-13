
import { supabase } from '@/integrations/supabase/client';
import type { CandidateProfile } from '@/types/profile';

// Hàm lấy danh sách ứng viên với bộ lọc
export const fetchCandidates = async (filters: any = {}) => {
  let query = supabase
    .from('profiles')
    .select(`
      *,
      skills(*),
      experience(*),
      education(*)
    `)
    .eq('id', supabase.auth.auth.currentSession?.user?.id ?? '')
    .is('is_public', true);

  // Áp dụng các bộ lọc
  if (filters.position) {
    query = query.or(`experience.position.ilike.%${filters.position}%`);
  }

  if (filters.location) {
    query = query.ilike('address', `%${filters.location}%`);
  }

  if (filters.experience) {
    // Lọc theo số năm kinh nghiệm - cần logic phức tạp hơn trong thực tế
    // Đây chỉ là mẫu đơn giản
  }

  if (filters.skills && filters.skills.length > 0) {
    query = query.containedBy('skills.name', filters.skills);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }

  return data as CandidateProfile[];
};

// Hàm lưu ứng viên (save candidate) cho nhà tuyển dụng
export const saveCandidate = async (candidateId: string, notes?: string) => {
  const { data, error } = await supabase
    .from('saved_candidates')
    .insert({
      employer_id: supabase.auth.auth.currentSession?.user?.id,
      candidate_id: candidateId,
      notes
    })
    .select();

  if (error) {
    console.error('Error saving candidate:', error);
    throw error;
  }

  return data[0];
};

// Hàm bỏ lưu ứng viên
export const unsaveCandidate = async (candidateId: string) => {
  const { error } = await supabase
    .from('saved_candidates')
    .delete()
    .eq('employer_id', supabase.auth.auth.currentSession?.user?.id)
    .eq('candidate_id', candidateId);

  if (error) {
    console.error('Error unsaving candidate:', error);
    throw error;
  }

  return true;
};

// Hàm kiểm tra xem ứng viên đã được lưu chưa
export const isCandidateSaved = async (candidateId: string) => {
  const { data, error } = await supabase
    .from('saved_candidates')
    .select('id')
    .eq('employer_id', supabase.auth.auth.currentSession?.user?.id)
    .eq('candidate_id', candidateId)
    .maybeSingle();

  if (error) {
    console.error('Error checking saved candidate:', error);
    throw error;
  }

  return !!data;
};

// Hàm lấy danh sách ứng viên đã lưu
export const fetchSavedCandidates = async () => {
  const { data, error } = await supabase
    .from('saved_candidates')
    .select(`
      *,
      candidate:candidate_id(
        *,
        skills(*),
        experience(*),
        education(*)
      )
    `)
    .eq('employer_id', supabase.auth.auth.currentSession?.user?.id);

  if (error) {
    console.error('Error fetching saved candidates:', error);
    throw error;
  }

  return data;
};
