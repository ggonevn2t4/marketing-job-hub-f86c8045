
import JobList from '@/components/jobs/JobList';
import JobsEmptyState from '@/components/jobs/JobsEmptyState';
import JobPagination from '@/components/jobs/JobPagination';
import { JobProps } from '@/components/jobs/JobCard';

interface JobsContentProps {
  jobs: JobProps[];
  loading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  itemsPerPage: number;
}

const JobsContent = ({ 
  jobs, 
  loading, 
  totalPages, 
  currentPage, 
  onPageChange, 
  onResetFilters, 
  itemsPerPage 
}: JobsContentProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (jobs.length === 0) {
    return <JobsEmptyState onResetFilters={onResetFilters} />;
  }
  
  return (
    <>
      <JobList jobs={jobs} showLoadMore={false} initialItems={itemsPerPage} />
      <JobPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={onPageChange} 
      />
    </>
  );
};

export default JobsContent;
