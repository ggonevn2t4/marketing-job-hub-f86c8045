
import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { ManagedJob, deleteJobPosting, renewJobPosting } from '@/services/managedJobsService';
import { MoreVertical, Edit, Trash2, RefreshCw, Users, ArrowUpRight } from 'lucide-react';

interface ManageJobsTableProps {
  jobs: ManagedJob[];
  onJobUpdated: () => void;
}

const ManageJobsTable = ({ jobs, onJobUpdated }: ManageJobsTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  
  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };
  
  const handleEditJob = (jobId: string) => {
    // In a real implementation, this would navigate to an edit form
    toast({
      title: "Chức năng đang phát triển",
      description: "Tính năng chỉnh sửa đang được phát triển.",
    });
  };
  
  const handleDeleteDialog = (jobId: string) => {
    setJobToDelete(jobId);
  };
  
  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    
    try {
      await deleteJobPosting(jobToDelete);
      toast({
        title: "Xóa thành công",
        description: "Tin tuyển dụng đã được xóa"
      });
      onJobUpdated();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa tin tuyển dụng. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setJobToDelete(null);
    }
  };
  
  const handleRenewJob = async (jobId: string) => {
    try {
      await renewJobPosting(jobId);
      toast({
        title: "Gia hạn thành công",
        description: "Tin tuyển dụng đã được gia hạn thêm 30 ngày"
      });
      onJobUpdated();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gia hạn tin tuyển dụng. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };
  
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate.split('/').reverse().join('-'));
    const daysLeft = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return <Badge variant="destructive">Hết hạn</Badge>;
    } else if (daysLeft <= 7) {
      return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Sắp hết hạn ({daysLeft} ngày)</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Còn hạn ({daysLeft} ngày)</Badge>;
    }
  };
  
  return (
    <Card className="overflow-hidden border rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tin tuyển dụng</TableHead>
              <TableHead>Đơn ứng tuyển</TableHead>
              <TableHead>Ngày đăng</TableHead>
              <TableHead>Hạn đăng tin</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-xs">
                      <div className="font-semibold truncate" title={job.title}>
                        {job.title}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {job.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(`/application-tracker?jobId=${job.id}`)}
                    >
                      <Users size={14} />
                      <span>{job.applications_count}</span>
                    </Button>
                  </TableCell>
                  <TableCell>{job.created_at}</TableCell>
                  <TableCell>{job.expires_at}</TableCell>
                  <TableCell>{job.expires_at ? getExpiryStatus(job.expires_at) : '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewJob(job.id)}>
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          Xem tin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditJob(job.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRenewJob(job.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Gia hạn
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteDialog(job.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa tin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Chưa có tin tuyển dụng nào được đăng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn tin tuyển dụng này
              và tất cả dữ liệu liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ManageJobsTable;
