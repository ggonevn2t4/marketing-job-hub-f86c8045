
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import JobApplicationsList from '@/components/jobs/JobApplicationsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Job {
  id: string;
  title: string;
  applications_count: number;
}

const ManageApplications = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  
  useEffect(() => {
    // Kiểm tra user đã đăng nhập và là nhà tuyển dụng
    if (user === null && !loading) {
      navigate('/auth', { state: { returnUrl: '/manage-applications' } });
      return;
    }
    
    if (userRole !== 'employer' && !loading) {
      navigate('/');
      return;
    }
    
    fetchJobs();
  }, [user, userRole, loading]);
  
  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // First, find the companies associated with this employer
      const { data: companies } = await supabase
        .from('companies')
        .select('id')
        .contains('metadata', { user_id: user.id });
      
      if (!companies || companies.length === 0) return;
      
      const companyId = companies[0].id;
      
      // Now get jobs from this company along with application counts
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          applications_count:job_applications(count)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setJobs(data.map(job => ({
        ...job,
        applications_count: job.applications_count[0].count
      })));
      
      if (data.length > 0) {
        setSelectedJob('all');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Quản lý đơn ứng tuyển</h1>
          <Button onClick={() => navigate('/company-profile')}>
            Quản lý công ty
          </Button>
        </div>
        
        {jobs.length === 0 ? (
          <div className="bg-card border rounded-xl p-10 text-center">
            <h2 className="text-xl font-semibold mb-4">Chưa có công việc nào được đăng tuyển</h2>
            <p className="text-muted-foreground mb-6">
              Bạn cần đăng tuyển công việc trước khi có thể quản lý đơn ứng tuyển
            </p>
            <Button onClick={() => navigate('/post-job')}>
              Đăng tuyển việc làm
            </Button>
          </div>
        ) : (
          <div>
            <Tabs value={selectedJob || 'all'} onValueChange={setSelectedJob} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  Tất cả đơn ứng tuyển
                </TabsTrigger>
                
                {jobs.map(job => (
                  <TabsTrigger key={job.id} value={job.id} disabled={job.applications_count === 0}>
                    {job.title} ({job.applications_count})
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all">
                <JobApplicationsList />
              </TabsContent>
              
              {jobs.map(job => (
                <TabsContent key={job.id} value={job.id}>
                  <JobApplicationsList jobId={job.id} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageApplications;
