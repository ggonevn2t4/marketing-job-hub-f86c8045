
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JobSortingProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  jobCount: number;
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

const JobSorting = ({ 
  sortBy, 
  onSortChange, 
  jobCount, 
  totalCount, 
  currentPage, 
  itemsPerPage 
}: JobSortingProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-sm text-muted-foreground">
        Hiển thị {jobCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalCount)} / {totalCount} kết quả
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm mr-2">Sắp xếp theo:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mới nhất</SelectItem>
            <SelectItem value="relevant">Phù hợp nhất</SelectItem>
            <SelectItem value="featured">Nổi bật</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default JobSorting;
