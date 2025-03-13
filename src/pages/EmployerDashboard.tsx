
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Briefcase, Users, Building, MessageSquare, 
  PlusCircle, FileText, BarChart, AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const EmployerDashboard = () => {
  const { user, userRole, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Fetch company profile
  const { data: companyProfile, isLoading: companyLoading } = useQuery({
    queryKey: ['companyProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && userRole === 'employer'
  });

  // Fetch job statistics
  const { data: jobStats, isLoading: statsLoading } = useQuery({
    queryKey: ['jobStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return { activeJobs: 0, applications: 0, viewed: 0 };
      
      // Get active jobs count
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('company_id', user.id);
      
      if (jobsError) throw jobsError;
      
      // Get all job IDs
      const jobIds = jobs?.map(job => job.id) || [];
      
      // Get applications count if there are jobs
      let applications = 0;
      if (jobIds.length > 0) {
        const { count, error: appsError } = await supabase
          .from('job_applications')
          .select('id', { count: 'exact' })
          .in('job_id', jobIds);
        
        if (appsError) throw appsError;
        applications = count || 0;
      }
      
      return {
        activeJobs: jobs?.length || 0,
        applications,
        viewed: 0 // This would require additional tracking
      };
    },
    enabled: !!user?.id && userRole === 'employer'
  });

  useEffect(() => {
    // Redirect if not authenticated or not an employer
    if (!authLoading && (!user || userRole !== 'employer')) {
      navigate('/auth');
    }
  }, [user, userRole, authLoading, navigate]);

  const isLoading = authLoading || companyLoading || statsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!companyProfile) return 0;
    
    let completed = 0;
    let total = 5; // Name, logo, industry, description, location
    
    if (companyProfile.name) completed++;
    if (companyProfile.logo) completed++;
    if (companyProfile.industry) completed++;
    if (companyProfile.description) completed++;
    if (companyProfile.location) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const profileCompletionPercentage = calculateProfileCompletion();

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Bảng điều khiển nhà tuyển dụng</h1>
          <Button onClick={() => navigate('/company-profile')}>
            <Building className="mr-2 h-4 w-4" />
            Chỉnh sửa thông tin công ty
          </Button>
        </div>

        {profileCompletionPercentage < 80 && (
          <Alert className="mb-6 border-amber-500 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              Hồ sơ công ty của bạn hoàn thành {profileCompletionPercentage}%. Hãy cập nhật đầy đủ thông tin để thu hút ứng viên chất lượng.
              <Button variant="link" onClick={() => navigate('/company-profile')} className="p-0 ml-2 h-auto">
                Cập nhật ngay
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tin tuyển dụng</CardTitle>
              <CardDescription>Số lượng tin đang hiển thị</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{jobStats?.activeJobs || 0}</div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/manage-jobs')}>
                <Briefcase className="mr-2 h-4 w-4" />
                Quản lý tin tuyển dụng
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Đơn ứng tuyển</CardTitle>
              <CardDescription>Tổng số đơn đã nhận</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{jobStats?.applications || 0}</div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/manage-applications')}>
                <FileText className="mr-2 h-4 w-4" />
                Xem đơn ứng tuyển
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tin nhắn</CardTitle>
              <CardDescription>Tin nhắn với ứng viên</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/messages')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Xem tin nhắn
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="jobs">Tin tuyển dụng</TabsTrigger>
            <TabsTrigger value="applications">Đơn ứng tuyển</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Báo cáo hoạt động của công ty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Thống kê ứng viên</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Đơn ứng tuyển mới:</span>
                            <span className="font-semibold">0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Đã xem hồ sơ:</span>
                            <span className="font-semibold">{jobStats?.viewed || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Đã liên hệ:</span>
                            <span className="font-semibold">0</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Hoạt động tuyển dụng</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Tin đang hoạt động:</span>
                            <span className="font-semibold">{jobStats?.activeJobs || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tin sắp hết hạn:</span>
                            <span className="font-semibold">0</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lượt xem tin:</span>
                            <span className="font-semibold">0</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Button onClick={() => navigate('/post-job')} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Đăng tin tuyển dụng mới
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Danh sách tin tuyển dụng</CardTitle>
                <CardDescription>Các tin đang đăng tuyển</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobStats?.activeJobs ? (
                    <Button onClick={() => navigate('/manage-jobs')} className="w-full">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Xem tất cả tin tuyển dụng
                    </Button>
                  ) : (
                    <>
                      <Alert className="bg-muted">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <AlertDescription>
                          Bạn chưa có tin tuyển dụng nào. Hãy đăng tin để tìm kiếm ứng viên phù hợp.
                        </AlertDescription>
                      </Alert>
                      
                      <Button onClick={() => navigate('/post-job')} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Đăng tin tuyển dụng
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Đơn ứng tuyển gần đây</CardTitle>
                <CardDescription>Danh sách đơn ứng tuyển mới nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobStats?.applications ? (
                    <Button onClick={() => navigate('/manage-applications')} className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Xem tất cả đơn ứng tuyển
                    </Button>
                  ) : (
                    <Alert className="bg-muted">
                      <Users className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        Chưa có đơn ứng tuyển nào. Khi ứng viên nộp đơn, thông tin sẽ hiển thị tại đây.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EmployerDashboard;
