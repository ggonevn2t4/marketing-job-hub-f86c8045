
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ApplicationStatus from '@/components/jobs/ApplicationStatus';
import { ArrowLeft, User, Mail, Phone, FileText, Calendar, Briefcase, Building } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ApplicationDetail {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  status: string;
  created_at: string;
  job: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
    };
  };
}

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchApplicationDetail();
  }, [id]);
  
  const fetchApplicationDetail = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:jobs(
            id, 
            title,
            company:company_id(
              id, 
              name
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setApplication(data);
    } catch (err: any) {
      console.error('Error fetching application details:', err);
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin đơn ứng tuyển',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateApplicationStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setApplication(prev => prev ? { ...prev, status: newStatus } : null);
      
      toast({
        title: 'Cập nhật thành công',
        description: 'Trạng thái đơn ứng tuyển đã được cập nhật',
      });
    } catch (err: any) {
      console.error('Error updating application status:', err);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang xử lý</Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang xem xét</Badge>;
      case 'shortlisted':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Lọt vào danh sách</Badge>;
      case 'interview':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Phỏng vấn</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Từ chối</Badge>;
      case 'hired':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Tuyển dụng</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: vi });
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !application) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn ứng tuyển</h1>
          <p className="text-muted-foreground mb-8">
            Đơn ứng tuyển này có thể đã bị xóa hoặc đường dẫn không đúng
          </p>
          <Button onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết đơn ứng tuyển</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Thông tin ứng viên</CardTitle>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" /> Họ tên
                    </div>
                    <div className="font-medium">{application.full_name}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </div>
                    <div className="font-medium">{application.email}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Số điện thoại
                    </div>
                    <div className="font-medium">{application.phone || 'Không cung cấp'}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Ngày ứng tuyển
                    </div>
                    <div className="font-medium">{formatDate(application.created_at)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> Vị trí ứng tuyển
                    </div>
                    <div className="font-medium">{application.job.title}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building className="h-4 w-4" /> Công ty
                    </div>
                    <div className="font-medium">{application.job.company.name}</div>
                  </div>
                </div>
                
                {application.resume_url && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" /> CV/Hồ sơ
                    </div>
                    <div>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.resume_url!, '_blank')}
                      >
                        Xem CV
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Thư xin việc</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="prose max-w-none">
                  {application.cover_letter ? (
                    <div className="whitespace-pre-wrap">{application.cover_letter}</div>
                  ) : (
                    <p className="text-muted-foreground">Ứng viên không cung cấp thư xin việc</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Cập nhật trạng thái</CardTitle>
                <CardDescription>
                  Thay đổi trạng thái của đơn ứng tuyển này
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button 
                  variant={application.status === 'pending' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => updateApplicationStatus('pending')}
                >
                  Đang xử lý
                </Button>
                
                <Button 
                  variant={application.status === 'reviewing' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => updateApplicationStatus('reviewing')}
                >
                  Đang xem xét
                </Button>
                
                <Button 
                  variant={application.status === 'shortlisted' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => updateApplicationStatus('shortlisted')}
                >
                  Lọt vào danh sách
                </Button>
                
                <Button 
                  variant={application.status === 'interview' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => updateApplicationStatus('interview')}
                >
                  Phỏng vấn
                </Button>
                
                <Button 
                  variant={application.status === 'rejected' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => updateApplicationStatus('rejected')}
                >
                  Từ chối
                </Button>
                
                <Button 
                  variant={application.status === 'hired' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => updateApplicationStatus('hired')}
                >
                  Tuyển dụng
                </Button>
              </CardContent>
            </Card>
            
            <ApplicationStatus applicationId={application.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationDetail;
