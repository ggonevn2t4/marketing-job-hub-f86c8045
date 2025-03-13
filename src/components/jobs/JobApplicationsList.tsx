
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MailIcon, Download, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface JobApplication {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'hired';
  created_at: string;
  job: {
    title: string;
  };
}

interface JobApplicationsListProps {
  jobId?: string;
}

const JobApplicationsList = ({ jobId }: JobApplicationsListProps) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('job_applications')
        .select(`
          *,
          job:jobs(title)
        `)
        .order('created_at', { ascending: false });
      
      if (jobId) {
        query = query.eq('job_id', jobId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setApplications(data as JobApplication[]);
    } catch (err: any) {
      console.error('Error fetching job applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      // Cập nhật trạng thái trong state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus as any } : app
      ));
      
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
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: vi 
    });
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lỗi</CardTitle>
          <CardDescription>
            Không thể tải danh sách đơn ứng tuyển: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đơn ứng tuyển</CardTitle>
          <CardDescription>
            Chưa có đơn ứng tuyển nào{jobId ? ' cho việc làm này' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p>Chưa có ứng viên nào ứng tuyển{jobId ? ' vào vị trí này' : ''}.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn ứng tuyển{jobId ? '' : ' - Tất cả vị trí'}</CardTitle>
        <CardDescription>
          Quản lý đơn ứng tuyển và cập nhật trạng thái
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                {!jobId && <TableHead>Vị trí</TableHead>}
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    <div>
                      {application.full_name}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MailIcon className="h-3 w-3" /> {application.email}
                    </div>
                  </TableCell>
                  
                  {!jobId && (
                    <TableCell>{application.job?.title || 'Không xác định'}</TableCell>
                  )}
                  
                  <TableCell>
                    {formatDate(application.created_at)}
                  </TableCell>
                  
                  <TableCell>
                    <Select
                      defaultValue={application.status}
                      onValueChange={(value) => updateApplicationStatus(application.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue>{getStatusBadge(application.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Đang xử lý</SelectItem>
                        <SelectItem value="reviewing">Đang xem xét</SelectItem>
                        <SelectItem value="shortlisted">Lọt vào danh sách</SelectItem>
                        <SelectItem value="interview">Phỏng vấn</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                        <SelectItem value="hired">Tuyển dụng</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(`/application-detail/${application.id}`, '_blank')}>
                        <Eye className="h-4 w-4 mr-1" />
                        Chi tiết
                      </Button>
                      
                      {application.resume_url && (
                        <Button variant="outline" size="sm" onClick={() => window.open(application.resume_url!, '_blank')}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobApplicationsList;
