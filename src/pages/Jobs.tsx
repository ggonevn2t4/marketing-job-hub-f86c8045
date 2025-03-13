
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/jobs/SearchBar';
import JobList from '@/components/jobs/JobList';
import AdvancedFilters from '@/components/jobs/AdvancedFilters';
import { JobProps } from '@/components/jobs/JobCard';
import { useAuth } from '@/contexts/AuthContext';
import useBookmarkJob from '@/hooks/useBookmarkJob';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

const Jobs = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { fetchSavedJobs } = useBookmarkJob();
  
  // Parse search parameters
  const keyword = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';
  const jobType = searchParams.get('jobType') || '';
  const experienceLevel = searchParams.get('experienceLevel') || '';
  const salary = searchParams.get('salary') || '';
  const salaryRangeParam = searchParams.get('salaryRange');
  const salaryRange = salaryRangeParam ? JSON.parse(salaryRangeParam) as [number, number] : undefined;
  const featuredOnly = searchParams.get('featuredOnly') === 'true';
  
  const filters = {
    jobType: jobType || undefined,
    experienceLevel: experienceLevel || undefined,
    salary: salary || undefined,
    salaryRange: salaryRange,
    featuredOnly: featuredOnly || undefined
  };
  
  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Start building the query
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
            company:company_id (id, name, logo)
          `, { count: 'exact' });
        
        // Add filters based on search parameters
        if (keyword) {
          query = query.ilike('title', `%${keyword}%`);
        }
        
        if (location && location !== 'all') {
          query = query.eq('location', location);
        }
        
        if (category && category !== 'all') {
          query = query.eq('category_id', category);
        }
        
        // Add advanced filters
        if (jobType) {
          query = query.eq('job_type', jobType);
        }
        
        if (experienceLevel) {
          query = query.eq('experience_level', experienceLevel);
        }
        
        // Xử lý filter theo mức lương 
        if (salaryRange) {
          const minSalary = `${salaryRange[0]} triệu`;
          const maxSalary = `${salaryRange[1]} triệu`;
          
          // Tìm các công việc có mức lương trong khoảng chỉ định
          // Đây là logic đơn giản, thực tế bạn cần xử lý phức tạp hơn để so sánh mức lương
          query = query.or(`salary.ilike.%${minSalary}%,salary.ilike.%${maxSalary}%`);
        } else if (salary) {
          query = query.ilike('salary', `%${salary}%`);
        }
        
        if (featuredOnly) {
          query = query.eq('is_featured', true);
        }
        
        // Order by created_at and is_featured
        query = query.order('is_featured', { ascending: false })
                     .order('created_at', { ascending: false });
        
        const { data, count, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          // Format data for JobList component
          const formattedJobs = data.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company.name,
            logo: job.company.logo || '/placeholder.svg',
            location: job.location,
            salary: job.salary,
            jobType: job.job_type,
            experienceLevel: job.experience_level,
            postedAt: formatTimeAgo(job.created_at),
            isFeatured: job.is_featured,
            isHot: job.is_hot,
            isUrgent: job.is_urgent
          }));
          
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
  }, [keyword, location, category, jobType, experienceLevel, salary, salaryRange, featuredOnly]);
  
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
  
  const handleFilterChange = (newFilters: any) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    // Cập nhật URL parameters với các filter mới
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        if (key === 'salaryRange') {
          // Lưu salaryRange dưới dạng chuỗi JSON trong URL
          updatedParams.set(key, JSON.stringify(value));
        } else {
          updatedParams.set(key, String(value));
        }
      } else {
        updatedParams.delete(key);
      }
    });
    
    setSearchParams(updatedParams);
  };
  
  const resetFilters = () => {
    const basicParams = new URLSearchParams();
    if (keyword) basicParams.set('q', keyword);
    if (location && location !== 'all') basicParams.set('location', location);
    if (category && category !== 'all') basicParams.set('category', category);
    
    setSearchParams(basicParams);
  };
  
  // Create title based on search parameters
  let title = 'Tất cả việc làm';
  if (category) {
    // Tìm tên danh mục từ ID
    const categoryObj = categories.find(cat => cat.id === category);
    if (categoryObj) {
      title = `Việc làm ${categoryObj.name}`;
    }
  }
  if (keyword) {
    title = `Kết quả tìm kiếm cho "${keyword}"`;
  }
  
  // Danh sách danh mục tạm thời (sẽ được thay thế bằng dữ liệu thực từ useEffect)
  const [categories, setCategories] = useState<any[]>([]);
  
  // Fetch categories để hiển thị tên danh mục
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
  
  return (
    <Layout>
      <div className="bg-muted/30 py-6">
        <div className="container mx-auto px-6">
          <SearchBar />
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal size={16} />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc nâng cao'}
            </Button>
          </div>
          
          {showFilters && (
            <div className="mt-4">
              <AdvancedFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onReset={resetFilters} 
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">
            {loading ? 'Đang tải...' : `Tìm thấy ${totalJobs} việc làm`}
            {location ? ` tại ${location}` : ''}
            {jobType ? `, loại công việc: ${jobType}` : ''}
            {experienceLevel ? `, yêu cầu kinh nghiệm: ${experienceLevel}` : ''}
            {salary ? `, mức lương: ${salary}` : ''}
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length > 0 ? (
          <JobList jobs={jobs} showLoadMore={true} initialItems={10} />
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Không tìm thấy việc làm phù hợp</h3>
            <p className="text-muted-foreground mb-6">
              Hãy thử thay đổi tiêu chí tìm kiếm của bạn hoặc quay lại sau
            </p>
            <Button onClick={resetFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jobs;
