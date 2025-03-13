import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import JobApplicationForm from '@/components/jobs/JobApplicationForm';
import { 
  Building, MapPin, Calendar, Clock, Award, Briefcase, 
  DollarSign, Share2, Bookmark, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useBookmarkJob from '@/hooks/useBookmarkJob';

interface JobDetail {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  location: string;
  salary: string;
  job_type: string;
  experience_level: string;
  created_at: string;
  is_featured: boolean;
  is_hot: boolean;
  is_urgent: boolean;
  company: {
    id: string;
    name: string;
    logo: string;
    location: string;
    industry: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchSavedJobs, saveJob, unsaveJob, isJobSaved } = useBookmarkJob();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            company:company_id(*),
            category:category_id(*)
          `)
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setJob(data);
        } else {
          setError('Không tìm thấy việc làm này');
          toast({
            title: 'Lỗi',
            description: 'Không tìm thấy việc làm này',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Có lỗi xảy ra khi tải thông tin việc làm');
        toast({
          title: 'Lỗi',
          description: 'Có lỗi xảy ra khi tải thông tin việc làm',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetail();
    if (user) {
      fetchSavedJobs();
    }
  }, [id, user]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };
  
  const handleApplyClick = () => {
    setShowApplicationForm(true);
    // Scroll to the form
    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleBookmarkClick = async () => {
    if (!job) return;
    
    if (isJobSaved(job.id)) {
      await unsaveJob(job.id);
    } else {
      await saveJob(job.id);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-10">
          <Skeleton className="h-12 w-2/3 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !job) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy việc làm</h1>
          <p className="text-muted-foreground mb-8">
            Việc làm này có thể đã bị xóa hoặc đường dẫn không đúng
          </p>
          <Button onClick={() => navigate('/jobs')}>
            Quay lại trang tìm việc
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="bg-card rounded-xl border overflow-hidden mb-10">
          <div className="relative h-48 bg-gradient-to-r from-primary/10 to-blue-500/10">
            {job.is_featured && (
              <Badge className="absolute top-4 right-4">Nổi bật</Badge>
            )}
            {job.is_hot && (
              <Badge variant="outline" className="absolute top-4 left-4 bg-orange-500/10 text-orange-500 border-orange-500/20">
                Hot
              </Badge>
            )}
            {job.is_urgent && (
              <Badge variant="outline" className="absolute top-4 left-24 bg-red-500/10 text-red-500 border-red-500/20">
                Gấp
              </Badge>
            )}
          </div>
          
          <div className="px-8 pb-8 -mt-16">
            <div className="bg-background rounded-xl border p-6 mb-6 flex flex-col md:flex-row gap-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-background shadow-sm bg-background">
                <img src={job.company.logo || '/placeholder.svg'} alt={job.company.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building size={16} />
                    <span>{job.company.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Đăng ngày {formatDate(job.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary" className="font-normal">
                    {job.job_type}
                  </Badge>
                  <Badge variant="outline" className="font-normal flex items-center gap-1">
                    <Briefcase size={12} />
                    {job.experience_level}
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    {job.category.name}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 md:items-end">
                <div className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <DollarSign size={18} className="text-primary" />
                  {job.salary}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="rounded-full"
                  >
                    <Share2 size={18} />
                  </Button>
                  {user && (
                    <Button 
                      variant={isJobSaved(job.id) ? "default" : "outline"}
                      size="icon"
                      className="rounded-full"
                      onClick={handleBookmarkClick}
                    >
                      <Bookmark size={18} className={isJobSaved(job.id) ? "fill-white" : ""} />
                    </Button>
                  )}
                  <Button onClick={handleApplyClick}>
                    Ứng tuyển ngay
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="description">Mô tả công việc</TabsTrigger>
                    <TabsTrigger value="requirements">Yêu cầu</TabsTrigger>
                    <TabsTrigger value="benefits">Quyền lợi</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-0">
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: job.description || 'Không có thông tin mô tả' }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="requirements" className="mt-0">
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: job.requirements || 'Không có thông tin yêu cầu' }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="benefits" className="mt-0">
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: job.benefits || 'Không có thông tin quyền lợi' }} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div>
                <div className="bg-card rounded-xl border p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Thông tin công ty</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border flex-shrink-0">
                      <img src={job.company.logo || '/placeholder.svg'} alt={job.company.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium">{job.company.name}</h4>
                      <p className="text-sm text-muted-foreground">{job.company.industry}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>{job.company.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/companies/${job.company.id}`)}>
                      Xem trang công ty
                    </Button>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl border p-6">
                  <h3 className="text-lg font-semibold mb-4">Tổng quan</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award size={16} />
                        <span>Kinh nghiệm</span>
                      </div>
                      <span className="font-medium">{job.experience_level}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase size={16} />
                        <span>Loại công việc</span>
                      </div>
                      <span className="font-medium">{job.job_type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign size={16} />
                        <span>Mức lương</span>
                      </div>
                      <span className="font-medium">{job.salary}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>Địa điểm</span>
                      </div>
                      <span className="font-medium">{job.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={16} />
                        <span>Đăng tuyển</span>
                      </div>
                      <span className="font-medium">{formatDate(job.created_at)}</span>
                    </div>
                  </div>
                  
                  {!showApplicationForm && (
                    <Button className="w-full mt-6" onClick={handleApplyClick}>
                      Ứng tuyển ngay
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {showApplicationForm && (
          <div id="application-form" className="bg-card rounded-xl border overflow-hidden mb-10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={24} className="text-primary" />
              <h2 className="text-xl font-semibold">Ứng tuyển: {job.title}</h2>
            </div>
            
            <JobApplicationForm jobId={job.id} onSuccess={() => {
              toast({
                title: "Thành công!",
                description: "Đơn ứng tuyển của bạn đã được gửi thành công",
              });
              setShowApplicationForm(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JobDetail;
