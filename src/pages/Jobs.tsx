
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import useBookmarkJob from '@/hooks/useBookmarkJob';
import useJobSearch from '@/hooks/useJobSearch';
import JobFilters from '@/components/jobs/JobFilters';
import JobsHeader from '@/components/jobs/JobsHeader';
import JobSorting from '@/components/jobs/JobSorting';
import JobsContent from '@/components/jobs/JobsContent';
import { useEffect } from 'react';

const Jobs = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { fetchSavedJobs } = useBookmarkJob();
  
  const keyword = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const jobType = searchParams.get('jobType') || '';
  const experienceLevel = searchParams.get('experienceLevel') || '';
  const salary = searchParams.get('salary') || '';
  
  const {
    jobs,
    loading,
    totalJobs,
    filters,
    currentPage,
    totalPages,
    itemsPerPage,
    sortBy,
    title,
    handleFilterChange,
    resetFilters,
    handleSortChange,
    handlePageChange
  } = useJobSearch();
  
  useEffect(() => {
    if (user) {
      fetchSavedJobs();
    }
  }, [user, fetchSavedJobs]);
  
  return (
    <Layout>
      <JobFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={resetFilters} 
      />
      
      <div className="container mx-auto px-6 py-10">
        <JobsHeader 
          title={title} 
          totalJobs={totalJobs} 
          loading={loading}
          location={location}
          jobType={jobType}
          experienceLevel={experienceLevel}
          salary={salary}
        />
        
        <JobSorting 
          sortBy={sortBy} 
          onSortChange={handleSortChange}
          jobCount={jobs.length}
          totalCount={totalJobs}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
        
        <JobsContent 
          jobs={jobs}
          loading={loading}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onResetFilters={resetFilters}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </Layout>
  );
};

export default Jobs;
