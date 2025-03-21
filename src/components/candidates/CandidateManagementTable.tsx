
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { CandidateWithStatus } from '@/hooks/useCandidateManagement';
import CandidateTableRow from './CandidateTableRow';
import CandidateLoadingState from './CandidateLoadingState';
import CandidateEmptyState from './CandidateEmptyState';

interface CandidateManagementTableProps {
  candidates: CandidateWithStatus[];
  isLoading: boolean;
  onUpdateStatus?: (id: string, status: string) => Promise<void>;
  filterBy?: 'all' | 'saved' | 'applied';
}

const CandidateManagementTable = ({ 
  candidates, 
  isLoading,
  onUpdateStatus = async () => {},
  filterBy = 'all'
}: CandidateManagementTableProps) => {
  const { toast } = useToast();
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const handleSendBulkEmail = () => {
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
  };

  const handleSelectCandidate = (candidateId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    } else {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedCandidates(candidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  if (isLoading) {
    return <CandidateLoadingState />;
  }

  if (candidates.length === 0) {
    return <CandidateEmptyState filterBy={filterBy} />;
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
              onClick={handleSendBulkEmail}
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
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedCandidates.length === candidates.length && candidates.length > 0}
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
                <CandidateTableRow
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidates.includes(candidate.id)}
                  onSelectChange={(isSelected) => handleSelectCandidate(candidate.id, isSelected)}
                  onUpdateStatus={onUpdateStatus}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateManagementTable;
