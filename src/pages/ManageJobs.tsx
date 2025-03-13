
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEmployerJobs, ManagedJob } from '@/services/managedJobsService';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import ManageJobsTable from '@/components/jobs/ManageJobsTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, BarChart } from 'lucide-react';

const ManageJobs = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState<ManagedJob[]>([]);
  const [activeJobs, setActiveJobs] = useState<ManagedJob[]>([]);
  const [expiredJobs, setExpiredJobs] = useState<ManagedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Check if user is logged in and is an employer
    if (!user && !loading) {
      navigate('/auth', { state: { returnUrl: '/manage-jobs' } });
      return;
    }
    
    if (userRole !== 'employer' && !loading) {
      navigate('/');
      return;
    }
    
    fetchCompanyId();
  }, [user, userRole, loading, navigate]);
  
  const fetchCompanyId = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Find the company associated with this employer
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .contains('metadata', { user_id: user.id })
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setCompanyId(data.id);
        fetchJobs(data.id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching company ID:', err);
      setLoading(false);
    }
  };
  
  const fetchJobs = async (id: string) => {
    try {
      const jobsList = await fetchEmployerJobs(id);
      setJobs(jobsList);
      
      // Separate active and expired jobs
      const today = new Date();
      const active: ManagedJob[] = [];
      const expired: ManagedJob[] = [];
      
      jobsList.forEach(job => {
        if (job.expires_at) {
          const expiryDate = new Date(job.expires_at.split('/').reverse().join('-'));
          if (expiryDate > today) {
            active.push(job);
          } else {
            expired.push(job);
          }
        } else {
          active.push(job);
        }
      });
      
      setActiveJobs(active);
      setExpiredJobs(expired);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefreshJobs = () => {
    if (companyId) {
      setLoading(true);
      fetchJobs(companyId);
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
          <div>
            <h1 className="text-2xl font-bold">Quản lý tin tuyển dụng</h1>
            <p className="text-muted-foreground">Quản lý và theo dõi các tin tuyển dụng của bạn</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => navigate('/post-job')} className="gap-1">
              <PlusCircle size={16} />
              Đăng tin mới
            </Button>
            <Button variant="outline" onClick={() => navigate('/manage-applications')} className="gap-1">
              <BarChart size={16} />
              Quản lý đơn
            </Button>
          </div>
        </div>
        
        {jobs.length === 0 ? (
          <div className="bg-card border rounded-xl p-10 text-center">
            <h2 className="text-xl font-semibold mb-4">Chưa có tin tuyển dụng nào</h2>
            <p className="text-muted-foreground mb-6">
              Bắt đầu đăng tin tuyển dụng để tiếp cận với hàng ngàn ứng viên tiềm năng
            </p>
            <Button onClick={() => navigate('/post-job')}>
              Đăng tin tuyển dụng
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="active">
                Đang hiển thị ({activeJobs.length})
              </TabsTrigger>
              <TabsTrigger value="expired">
                Hết hạn ({expiredJobs.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                Tất cả ({jobs.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <ManageJobsTable jobs={activeJobs} onJobUpdated={handleRefreshJobs} />
            </TabsContent>
            
            <TabsContent value="expired">
              <ManageJobsTable jobs={expiredJobs} onJobUpdated={handleRefreshJobs} />
            </TabsContent>
            
            <TabsContent value="all">
              <ManageJobsTable jobs={jobs} onJobUpdated={handleRefreshJobs} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default ManageJobs;
