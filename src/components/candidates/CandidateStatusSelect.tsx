
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CandidateStatusBadge from "./CandidateStatusBadge";

interface CandidateStatusSelectProps {
  status: string;
  onStatusChange: (value: string) => void;
}

const CandidateStatusSelect = ({ 
  status, 
  onStatusChange 
}: CandidateStatusSelectProps) => {
  return (
    <Select
      defaultValue={status || 'new'}
      onValueChange={onStatusChange}
    >
      <SelectTrigger className="w-32 h-8">
        <SelectValue>
          <CandidateStatusBadge status={status || 'new'} />
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
  );
};

export default CandidateStatusSelect;
