
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  MoreHorizontal, 
  Eye, 
  Download, 
  Mail, 
  Phone, 
  UserCheck, 
  Clock,
  UserX 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CandidateWithStatus } from '@/hooks/useCandidateManagement';

interface CandidateManagementTableProps {
  candidates: CandidateWithStatus[];
  isLoading: boolean;
  onUpdateStatus?: (id: string, status: string) => Promise<void>;
  filterBy?: 'all' | 'saved' | 'applied'; // Filter by type of candidate
}

// Mapping for candidate statuses and their respective badges
const statusBadges: Record<string, JSX.Element> = {
  new: <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Mới</Badge>,
  contacted: <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Đã liên hệ</Badge>,
  interviewing: <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Đang phỏng vấn</Badge>,
  offer: <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Đã đề xuất</Badge>,
  hired: <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Đã tuyển</Badge>,
  rejected: <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Đã từ chối</Badge>,
};

const CandidateManagementTable = ({ 
  candidates, 
  isLoading,
  onUpdateStatus,
  filterBy = 'all'
}: CandidateManagementTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const handleSendEmail = (candidateId: string) => {
    toast({
      title: "Đang chuẩn bị email",
      description: "Chức năng gửi email đến ứng viên sẽ sớm được cập nhật."
    });
  };

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    if (onUpdateStatus) {
      try {
        await onUpdateStatus(candidateId, newStatus);
        toast({
          title: "Cập nhật thành công",
          description: "Trạng thái ứng viên đã được cập nhật."
        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật trạng thái ứng viên.",
          variant: "destructive"
        });
      }
    }
  };

  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: vi 
    });
  };

  const getLatestPosition = (candidate: CandidateWithStatus) => {
    if (!candidate.experience || candidate.experience.length === 0) {
      return 'Chưa có kinh nghiệm';
    }
    return candidate.experience[0].position || 'N/A';
  };

  const getSkillsList = (candidate: CandidateWithStatus) => {
    if (!candidate.skills || candidate.skills.length === 0) {
      return 'Chưa có kỹ năng';
    }
    return candidate.skills.map(skill => skill.name).join(', ');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đang tải dữ liệu ứng viên...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (candidates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chưa có ứng viên nào</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {filterBy === 'saved' 
                ? 'Bạn chưa lưu ứng viên nào.'
                : filterBy === 'applied'
                ? 'Chưa có ứng viên nào ứng tuyển vào vị trí của bạn.'
                : 'Không tìm thấy ứng viên nào.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Quản lý ứng viên{' '}
            <Badge variant="outline">{candidates.length}</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedCandidates.length === 0) {
                  toast({
                    title: "Chưa có ứng viên nào được chọn",
                    description: "Vui lòng chọn ít nhất một ứng viên để gửi email."
                  });
                  return;
                }
                toast({
                  title: "Gửi email hàng loạt",
                  description: `Chuẩn bị gửi email đến ${selectedCandidates.length} ứng viên.`
                });
              }}
              disabled={selectedCandidates.length === 0}
            >
              <Mail className="h-4 w-4 mr-1" /> Email đã chọn
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[5%]">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300"
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedCandidates(candidates.map(c => c.id));
                      } else {
                        setSelectedCandidates([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="w-[25%]">Thông tin ứng viên</TableHead>
                <TableHead className="w-[20%]">Vị trí & Kỹ năng</TableHead>
                <TableHead className="w-[15%]">Thời gian</TableHead>
                <TableHead className="w-[15%]">Trạng thái</TableHead>
                <TableHead className="w-[20%]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCandidates([...selectedCandidates, candidate.id]);
                        } else {
                          setSelectedCandidates(selectedCandidates.filter(id => id !== candidate.id));
                        }
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {candidate.avatar_url ? (
                          <img 
                            src={candidate.avatar_url} 
                            alt={candidate.full_name || ''} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-semibold">
                            {candidate.full_name?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{candidate.full_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {candidate.email || 'N/A'}
                        </div>
                        {candidate.phone && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {candidate.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">{getLatestPosition(candidate)}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {getSkillsList(candidate)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getFormattedDate(candidate.created_at)}
                  </TableCell>
                  
                  <TableCell>
                    <Select
                      defaultValue={candidate.status || 'new'}
                      onValueChange={(value) => handleStatusChange(candidate.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue>
                          {statusBadges[candidate.status || 'new'] || 'Trạng thái'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Mới</SelectItem>
                        <SelectItem value="contacted">Đã liên hệ</SelectItem>
                        <SelectItem value="interviewing">Đang phỏng vấn</SelectItem>
                        <SelectItem value="offer">Đã đề xuất</SelectItem>
                        <SelectItem value="hired">Đã tuyển</SelectItem>
                        <SelectItem value="rejected">Đã từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/candidate/${candidate.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Chi tiết
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleSendEmail(candidate.id)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Gửi email
                          </DropdownMenuItem>
                          {candidate.resume_url && (
                            <DropdownMenuItem onClick={() => window.open(candidate.resume_url!, '_blank')}>
                              <Download className="h-4 w-4 mr-2" />
                              Tải CV
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleStatusChange(candidate.id, 'hired')}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Đánh dấu đã tuyển
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(candidate.id, 'rejected')}>
                            <UserX className="h-4 w-4 mr-2" />
                            Đánh dấu từ chối
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default CandidateManagementTable;
