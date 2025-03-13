
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ApplicationStatus from '@/components/jobs/ApplicationStatus';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MailOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const ApplicationTracker = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('id') || '';
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('job_applications')
          .select(`
            *,
            jobs:job_id (
              *,
              companies:company_id (*),
              categories:category_id (*)
            )
          `)
          .eq('id', applicationId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setApplication(data);
          setJob(data.jobs);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin đơn ứng tuyển',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplication();
  }, [applicationId, toast]);
  
  if (!applicationId) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MailOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Không tìm thấy đơn ứng tuyển</h2>
                <p className="text-muted-foreground mb-6">
                  Vui lòng kiểm tra lại đường dẫn hoặc mã đơn ứng tuyển của bạn
                </p>
                <Button asChild>
                  <Link to="/jobs">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Xem việc làm
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <Link to="/jobs" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại tìm kiếm việc làm
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Đơn ứng tuyển của bạn</CardTitle>
                    <CardDescription>
                      Cảm ơn bạn đã nộp đơn ứng tuyển. Dưới đây là thông tin chi tiết.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium">Thông tin vị trí</h3>
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Vị trí</p>
                              <p className="font-medium">{job?.title}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Công ty</p>
                              <p className="font-medium">{job?.companies?.name}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Ngày nộp đơn</p>
                              <p className="font-medium">
                                {new Date(application?.created_at).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Mã đơn</p>
                              <p className="font-medium text-xs text-muted-foreground">
                                {application?.id}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Thông tin cá nhân</h3>
                        <div className="mt-4 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Họ và tên</p>
                              <p className="font-medium">{application?.full_name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium">{application?.email}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Số điện thoại</p>
                            <p className="font-medium">{application?.phone || '-'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Thư xin việc</h3>
                        <div className="mt-4 p-4 bg-muted rounded-md whitespace-pre-wrap">
                          {application?.cover_letter}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="space-y-6">
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ApplicationStatus applicationId={applicationId} />
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lưu ý</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Hãy lưu lại đường dẫn này để theo dõi trạng thái đơn ứng tuyển của bạn.
                  Nhà tuyển dụng sẽ liên hệ với bạn nếu hồ sơ phù hợp.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationTracker;
