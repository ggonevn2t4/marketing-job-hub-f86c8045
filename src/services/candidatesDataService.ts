
import { supabase } from '@/integrations/supabase/client';
import type { CandidateProfile } from '@/types/profile';

// Định nghĩa interface cho bộ lọc tìm kiếm ứng viên
export interface CandidateFilters {
  searchTerm?: string;
  position?: string;
  location?: string;
  experience?: string;
  skills?: string[];
}

// Hàm lấy danh sách ứng viên theo bộ lọc
export const fetchCandidatesList = async (filters: CandidateFilters = {}) => {
  try {
    // Truy vấn cơ bản
    let query = supabase
      .from('profiles')
      .select(`
        *,
        skills (*),
        experience (*),
        education (*)
      `);
    
    // Tìm kiếm theo từ khóa
    if (filters.searchTerm) {
      query = query.or(`full_name.ilike.%${filters.searchTerm}%,skills.name.ilike.%${filters.searchTerm}%,experience.position.ilike.%${filters.searchTerm}%`);
    }
    
    // Lọc theo vị trí
    if (filters.position) {
      query = query.or(`experience.position.ilike.%${filters.position}%`);
    }
    
    // Lọc theo địa điểm
    if (filters.location) {
      query = query.ilike('address', `%${filters.location}%`);
    }
    
    // Lấy kết quả
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
    
    return data as unknown as CandidateProfile[];
  } catch (error) {
    console.error('Error in fetchCandidatesList:', error);
    return [];
  }
};

// Hàm lấy danh sách ứng viên đã lưu
export const fetchSavedCandidatesList = async () => {
  try {
    // Lấy id của người dùng hiện tại
    const userId = supabase.auth.getUser();
    
    if (!userId) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }
    
    // Truy vấn các ứng viên đã lưu
    const { data, error } = await supabase
      .from('saved_candidates')
      .select(`
        candidate_id,
        profiles!candidate_id (
          *,
          skills (*),
          experience (*),
          education (*)
        )
      `)
      .eq('employer_id', (await userId).data.user?.id);
    
    if (error) {
      console.error('Error fetching saved candidates:', error);
      throw error;
    }
    
    // Chuyển đổi kết quả về định dạng CandidateProfile[]
    return data.map(item => item.profiles) as unknown as CandidateProfile[];
  } catch (error) {
    console.error('Error in fetchSavedCandidatesList:', error);
    return [];
  }
};
