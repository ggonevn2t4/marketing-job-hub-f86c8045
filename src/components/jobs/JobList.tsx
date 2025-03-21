
import { useState } from 'react';
import JobCard, { JobProps } from './JobCard';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

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
          {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {itemsToShow.map(job => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
      
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
    </div>
  );
};

export default JobList;
