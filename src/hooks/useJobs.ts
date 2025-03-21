
import { useState, useEffect } from 'react';
import { fetchJobs } from '@/utils/supabaseQueries';
import { toast } from '@/components/ui/use-toast';

type JobFilters = {
  searchTerm?: string;
  location?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export const useJobs = (initialFilters: JobFilters = {}) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateFilters = (newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const loadMore = () => {
    if (jobs.length < totalCount) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  };

  const resetFilters = () => {
    setFilters({ page: 1, limit: initialFilters.limit || 10 });
    setJobs([]);
  };

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        console.log('Fetching jobs with filters:', filters);
        const { jobs: fetchedJobs, count } = await fetchJobs(filters);
        console.log('Fetched jobs:', fetchedJobs, 'count:', count);
        
        if (filters.page && filters.page > 1) {
          setJobs(prev => [...prev, ...fetchedJobs]);
        } else {
          setJobs(fetchedJobs);
        }
        
        setTotalCount(count || 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách việc làm. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    getJobs();
  }, [filters]);

  return {
    jobs,
    totalCount,
    loading,
    error,
    loadMore,
    updateFilters,
    resetFilters,
    hasMore: jobs.length < totalCount
  };
};

export default useJobs;
