
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import JobList from '@/components/jobs/JobList';
import { useAuth } from '@/contexts/AuthContext';
import useBookmarkJob from '@/hooks/useBookmarkJob';
import { JobProps } from '@/components/jobs/JobCard';
import { toast } from '@/components/ui/use-toast';
import { BookmarkIcon } from 'lucide-react';

const SavedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchSavedJobs } = useBookmarkJob();
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const getSavedJobs = async () => {
      try {
        setLoading(true);
        
        // Lấy danh sách id việc làm đã lưu
        const savedJobIds = await fetchSavedJobs();
        
        if (savedJobIds.length === 0) {
          setJobs([]);
          setLoading(false);
          return;
        }
        
        // Lấy thông tin chi tiết của các việc làm đã lưu
        const { data, error } = await supabase
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
          `)
          .in('id', savedJobIds);
          
        if (error) throw error;
        
        if (data) {
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
        }
      } catch (err: any) {
        console.error('Error fetching saved jobs:', err);
        toast({
          title: 'Lỗi',
          description: 'Có lỗi xảy ra khi tải danh sách việc làm đã lưu',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    getSavedJobs();
  }, [user, navigate]);
  
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
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Việc làm đã lưu</h1>
          <p className="text-muted-foreground">
            {loading ? 'Đang tải...' : jobs.length > 0 ? `${jobs.length} việc làm đã lưu` : 'Bạn chưa lưu việc làm nào'}
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length > 0 ? (
          <JobList jobs={jobs} />
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <BookmarkIcon size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Chưa có việc làm nào được lưu</h3>
            <p className="text-muted-foreground mb-6">
              Khi bạn lưu việc làm yêu thích, chúng sẽ xuất hiện ở đây
            </p>
            <Button onClick={() => navigate('/jobs')}>
              Tìm việc làm ngay
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SavedJobs;
