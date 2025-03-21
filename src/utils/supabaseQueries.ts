import { supabase } from '@/integrations/supabase/client';

export const fetchJobs = async (filters: {
  searchTerm?: string,
  location?: string,
  category?: string,
  limit?: number,
  page?: number
}) => {
  const {
    searchTerm,
    location,
    category,
    limit = 10,
    page = 1
  } = filters;
  
  try {
    console.log('Building query with filters:', filters);
    
    let query = supabase
      .from('jobs')
      .select(`
        *,
        companies:company_id(id, name, logo, location, industry),
        categories:category_id(id, name, slug)
      `, { count: 'exact' })
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    // Apply filters
    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }
    
    if (location && location !== 'all') {
      query = query.eq('location', location);
    }
    
    if (category && category !== 'all') {
      query = query.eq('category_id', category);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    
    console.log('Executing Supabase query');
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Query successful, data:', data?.length || 0, 'items, count:', count);
    
    return { 
      jobs: data || [], 
      count 
    };
  } catch (error) {
    console.error('Error in fetchJobs:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchCompanies = async (featured: boolean = false, limit: number = 6) => {
  let query = supabase
    .from('companies')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('name');
  
  if (featured) {
    query = query.eq('is_featured', true);
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
  
  return data || [];
};

export const getJobCount = async (categoryId: string) => {
  const { count, error } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId);
    
  if (error) {
    console.error('Error counting jobs:', error);
    return 0;
  }
  
  return count || 0;
};
