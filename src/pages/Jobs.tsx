
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import SearchBar from '@/components/jobs/SearchBar';
import JobList from '@/components/jobs/JobList';
import { JobProps } from '@/components/jobs/JobCard';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  
  // Parse search parameters
  const keyword = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';
  
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
            company:company_id (id, name, logo),
            category:category_id (id, name, slug)
          `, { count: 'exact' });
        
        // Add filters based on search parameters
        if (keyword) {
          query = query.ilike('title', `%${keyword}%`);
        }
        
        if (location) {
          query = query.eq('location', location);
        }
        
        if (category) {
          query = query.eq('category.slug', category);
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
  }, [keyword, location, category]);
  
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
  
  // Create title based on search parameters
  let title = 'Tất cả việc làm';
  if (category) {
    title = `Việc làm ${category.replace('-', ' ')}`;
  }
  if (keyword) {
    title = `Kết quả tìm kiếm cho "${keyword}"`;
  }
  
  return (
    <Layout>
      <div className="bg-muted/30 py-6">
        <div className="container mx-auto px-6">
          <SearchBar />
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">
            {loading ? 'Đang tải...' : `Tìm thấy ${totalJobs} việc làm`}
            {location ? ` tại ${location}` : ''}
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
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jobs;
