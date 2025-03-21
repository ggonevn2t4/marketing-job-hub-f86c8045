
import { Button } from '@/components/ui/button';

interface JobsEmptyStateProps {
  onResetFilters: () => void;
}

const JobsEmptyState = ({ onResetFilters }: JobsEmptyStateProps) => {
  return (
    <div className="text-center py-16 bg-muted/30 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Không tìm thấy việc làm phù hợp</h3>
      <p className="text-muted-foreground mb-6">
        Hãy thử thay đổi tiêu chí tìm kiếm của bạn hoặc quay lại sau
      </p>
      <Button onClick={onResetFilters}>
        Xóa bộ lọc
      </Button>
    </div>
  );
};

export default JobsEmptyState;
