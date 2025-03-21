
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { fetchCategories } from '@/utils/supabaseQueries';
import { JobProps } from '@/components/jobs/JobCard';

export const useJobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const keyword = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';
  const jobType = searchParams.get('jobType') || '';
  const experienceLevel = searchParams.get('experienceLevel') || '';
  const salary = searchParams.get('salary') || '';
  const salaryRangeParam = searchParams.get('salaryRange');
  const salaryRange = salaryRangeParam ? JSON.parse(salaryRangeParam) as [number, number] : undefined;
  const featuredOnly = searchParams.get('featuredOnly') === 'true';
  const pageParam = searchParams.get('page');
  const sortParam = searchParams.get('sort') || 'recent';
  
  useEffect(() => {
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    }
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [pageParam, sortParam]);
  
  const filters = {
    jobType: jobType || undefined,
    experienceLevel: experienceLevel || undefined,
    salary: salary || undefined,
    salaryRange: salaryRange,
    featuredOnly: featuredOnly || undefined
  };
  
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    
    getCategories();
  }, []);
  
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hôm nay';
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} tuần trước`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng trước`;
    }
  };
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('Starting job fetch process...');
        setLoading(true);
        
        let query = supabase
          .from('jobs')
          .select(`
            id,
            title,
            location,
            salary,
            job_type,
            experience_level,
            is_featured,
            is_hot,
            is_urgent,
            created_at,
            description,
            company:company_id (id, name, logo)
          `, { count: 'exact' });
        
        console.log('Building query with params:', { 
          keyword, location, category, jobType, 
          experienceLevel, featuredOnly, currentPage
        });
        
        if (keyword) {
          query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
        }
        
        if (location && location !== 'all') {
          query = query.eq('location', location);
        }
        
        if (category && category !== 'all') {
          query = query.eq('category_id', category);
        }
        
        if (jobType) {
          query = query.eq('job_type', jobType);
        }
        
        if (experienceLevel) {
          query = query.eq('experience_level', experienceLevel);
        }
        
        if (salaryRange) {
          const minSalary = `${salaryRange[0]} triệu`;
          const maxSalary = `${salaryRange[1]} triệu`;
          
          query = query.or(`salary.ilike.%${minSalary}%,salary.ilike.%${maxSalary}%`);
        } else if (salary) {
          query = query.ilike('salary', `%${salary}%`);
        }
        
        if (featuredOnly) {
          query = query.eq('is_featured', true);
        }
        
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        switch (sortBy) {
          case 'featured':
            query = query.order('is_featured', { ascending: false })
                         .order('created_at', { ascending: false });
            break;
          case 'relevant':
            if (keyword) {
              query = query.order('is_featured', { ascending: false });
            } else {
              query = query.order('is_featured', { ascending: false })
                          .order('created_at', { ascending: false });
            }
            break;
          case 'recent':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }
        
        query = query.range(from, to);
        
        console.log('Executing query...');
        const { data, count, error } = await query;
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        
        console.log('Jobs fetched successfully:', data?.length || 0, 'count:', count);
        
        if (data) {
          let formattedJobs = data.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company?.name || 'Unknown Company',
            logo: job.company?.logo || '/placeholder.svg',
            location: job.location,
            salary: job.salary,
            jobType: job.job_type,
            experienceLevel: job.experience_level,
            postedAt: formatTimeAgo(job.created_at),
            isFeatured: job.is_featured,
            isHot: job.is_hot,
            isUrgent: job.is_urgent
          }));
          
          if (keyword && sortBy === 'relevant') {
            formattedJobs = formattedJobs.sort((a, b) => {
              const aTitle = a.title.toLowerCase();
              const bTitle = b.title.toLowerCase();
              const keywordLower = keyword.toLowerCase();
              
              if (aTitle.includes(keywordLower) && !bTitle.includes(keywordLower)) return -1;
              if (!aTitle.includes(keywordLower) && bTitle.includes(keywordLower)) return 1;
              
              if (aTitle.startsWith(keywordLower) && !bTitle.startsWith(keywordLower)) return -1;
              if (!aTitle.startsWith(keywordLower) && bTitle.startsWith(keywordLower)) return 1;
              
              if (a.isFeatured && !b.isFeatured) return -1;
              if (!a.isFeatured && b.isFeatured) return 1;
              
              return 0;
            });
          }
          
          console.log('Setting jobs state with formatted data');
          setJobs(formattedJobs);
          setTotalJobs(count || 0);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        toast({
          title: 'Lỗi',
          description: 'Có lỗi xảy ra khi tải danh sách việc làm',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [keyword, location, category, jobType, experienceLevel, salary, salaryRange, featuredOnly, currentPage, sortBy]);

  const handleFilterChange = (newFilters: any) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        if (key === 'salaryRange') {
          updatedParams.set(key, JSON.stringify(value));
        } else {
          updatedParams.set(key, String(value));
        }
      } else {
        updatedParams.delete(key);
      }
    });
    
    updatedParams.set('page', '1');
    setCurrentPage(1);
    
    setSearchParams(updatedParams);
  };
  
  const resetFilters = () => {
    const basicParams = new URLSearchParams();
    if (keyword) basicParams.set('q', keyword);
    if (location && location !== 'all') basicParams.set('location', location);
    if (category && category !== 'all') basicParams.set('category', category);
    basicParams.set('page', '1');
    basicParams.set('sort', sortBy);
    
    setCurrentPage(1);
    setSearchParams(basicParams);
  };
  
  const handleSortChange = (newSortBy: string) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('sort', newSortBy);
    setSortBy(newSortBy);
    setSearchParams(updatedParams);
  };
  
  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(totalJobs / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('page', page.toString());
    setCurrentPage(page);
    setSearchParams(updatedParams);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  let title = 'Tất cả việc làm';
  if (category) {
    const categoryObj = categories.find(cat => cat.id === category);
    if (categoryObj) {
      title = `Việc làm ${categoryObj.name}`;
    }
  }
  if (keyword) {
    title = `Kết quả tìm kiếm cho "${keyword}"`;
  }
  
  const totalPages = Math.ceil(totalJobs / itemsPerPage);
  
  return {
    jobs,
    loading,
    totalJobs,
    filters,
    currentPage,
    totalPages,
    itemsPerPage,
    sortBy,
    title,
    handleFilterChange,
    resetFilters,
    handleSortChange,
    handlePageChange
  };
};

export default useJobSearch;
