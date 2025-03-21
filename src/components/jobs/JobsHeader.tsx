
interface JobsHeaderProps {
  title: string;
  totalJobs: number;
  loading: boolean;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salary?: string;
}

const JobsHeader = ({ 
  title, 
  totalJobs, 
  loading, 
  location, 
  jobType, 
  experienceLevel, 
  salary 
}: JobsHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">
        {loading ? 'Đang tải...' : `Tìm thấy ${totalJobs} việc làm`}
        {location ? ` tại ${location}` : ''}
        {jobType ? `, loại công việc: ${jobType}` : ''}
        {experienceLevel ? `, yêu cầu kinh nghiệm: ${experienceLevel}` : ''}
        {salary ? `, mức lương: ${salary}` : ''}
      </p>
    </div>
  );
};

export default JobsHeader;
