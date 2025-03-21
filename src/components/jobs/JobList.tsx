
import { useState } from 'react';
import JobCard, { JobProps } from './JobCard';
import { Button } from '@/components/ui/button';
import { ChevronDown, Info } from 'lucide-react';

interface JobListProps {
  jobs: JobProps[];
  title?: string;
  description?: string;
  initialItems?: number;
  showLoadMore?: boolean;
}

const JobList = ({
  jobs,
  title,
  description,
  initialItems = 6,
  showLoadMore = true,
}: JobListProps) => {
  const [visibleItems, setVisibleItems] = useState(initialItems);
  
  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + 6, jobs.length));
  };
  
  const hasMore = visibleItems < jobs.length;
  
  // If not using load more (pagination is handled outside), show all items
  const itemsToShow = showLoadMore ? jobs.slice(0, visibleItems) : jobs;
  
  return (
    <div className="space-y-8">
      {(title || description) && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          {title && (
            <div className="flex items-center justify-center gap-2 mb-3">
              <h2 className="text-3xl font-bold">{title}</h2>
              {jobs.length > 0 && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {jobs.length} việc làm
                </span>
              )}
            </div>
          )}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      {jobs.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-card">
          <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Không tìm thấy việc làm</h3>
          <p className="text-muted-foreground">
            Không có việc làm nào phù hợp với tiêu chí tìm kiếm của bạn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {itemsToShow.map(job => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      )}
      
      {showLoadMore && hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={loadMore}
            className="gap-2"
          >
            Xem thêm
            <ChevronDown size={16} />
          </Button>
        </div>
      )}
      
      {jobs.length > 0 && !hasMore && showLoadMore && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Đã hiển thị tất cả {jobs.length} việc làm
        </p>
      )}
    </div>
  );
};

export default JobList;
