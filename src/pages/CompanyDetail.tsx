
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import JobList from '@/components/jobs/JobList';
import { JobProps } from '@/components/jobs/JobCard';
import { Building, MapPin, Globe, Users } from 'lucide-react';

interface CompanyDetail {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  industry: string;
  website: string;
  is_featured: boolean;
}

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCompanyAndJobs = async () => {
      try {
        setLoading(true);
        
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single();
          
        if (companyError) throw companyError;
        
        if (companyData) {
          setCompany(companyData);
          
          // Fetch jobs from this company
          const { data: jobsData, error: jobsError } = await supabase
            .from('jobs')
            .select(`
              id,
              title,
              location,
              salary,
              job_type,
              experience_level,
              is_featured,
              is_hot,
              is_urgent,
              created_at,
              category:category_id (id, name, slug)
            `)
            .eq('company_id', id)
            .order('created_at', { ascending: false });
            
          if (jobsError) throw jobsError;
          
          if (jobsData) {
            // Format jobs data
            const formattedJobs = jobsData.map(job => ({
              id: job.id,
              title: job.title,
              company: companyData.name,
              logo: companyData.logo || '/placeholder.svg',
              location: job.location,
              salary: job.salary,
              jobType: job.job_type,
              experienceLevel: job.experience_level,
              postedAt: formatTimeAgo(job.created_at),
              isFeatured: job.is_featured,
              isHot: job.is_hot,
              isUrgent: job.is_urgent
            }));
            
            setJobs(formattedJobs);
          }
        } else {
          setError('Không tìm thấy thông tin công ty');
          toast({
            title: 'Lỗi',
            description: 'Không tìm thấy thông tin công ty',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Có lỗi xảy ra khi tải thông tin công ty');
        toast({
          title: 'Lỗi',
          description: 'Có lỗi xảy ra khi tải thông tin công ty',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyAndJobs();
  }, [id]);
  
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hôm nay';
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} tuần trước`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng trước`;
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10">
          <Skeleton className="h-64 w-full mb-10" />
          <Skeleton className="h-12 w-1/2 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full mb-6" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !company) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy công ty</h1>
          <p className="text-muted-foreground mb-8">
            Công ty này có thể đã bị xóa hoặc đường dẫn không đúng
          </p>
          <Button onClick={() => navigate('/companies')}>
            Quay lại trang công ty
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="bg-card rounded-xl border overflow-hidden mb-10">
          <div className="relative h-48 bg-gradient-to-r from-primary/20 to-blue-500/20">
            {company.is_featured && (
              <Badge className="absolute top-4 right-4">
                Nhà tuyển dụng hàng đầu
              </Badge>
            )}
          </div>
          
          <div className="px-8 pb-8 -mt-16">
            <div className="bg-background rounded-xl border p-6 mb-6 flex flex-col md:flex-row gap-6">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-background shadow-sm bg-background">
                <img src={company.logo || '/placeholder.svg'} alt={company.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building size={16} />
                    <span>{company.industry}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{company.location}</span>
                  </div>
                  
                  {company.website && (
                    <div className="flex items-center gap-1">
                      <Globe size={16} />
                      <a 
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="font-normal flex items-center gap-1">
                    <Users size={12} />
                    {jobs.length} việc làm đang tuyển
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose max-w-none mb-10">
                  <h2 className="text-xl font-semibold mb-4">Giới thiệu công ty</h2>
                  {company.description ? (
                    <div dangerouslySetInnerHTML={{ __html: company.description }} />
                  ) : (
                    <p>Chưa có thông tin giới thiệu về công ty.</p>
                  )}
                </div>
                
                <div className="mb-10">
                  <h2 className="text-xl font-semibold mb-6">Việc làm đang tuyển ({jobs.length})</h2>
                  
                  {jobs.length > 0 ? (
                    <JobList 
                      jobs={jobs} 
                      showLoadMore={jobs.length > 6}
                      initialItems={6}
                    />
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">
                        Hiện tại công ty chưa có tin tuyển dụng
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="bg-card rounded-xl border p-6 sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className="text-muted-foreground" />
                      <span>{company.location || 'Việt Nam'}</span>
                    </div>
                    
                    {company.website && (
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-muted-foreground" />
                        <a 
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate('/jobs', { state: { companyId: company.id } })}
                    >
                      Xem tất cả việc làm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetail;
