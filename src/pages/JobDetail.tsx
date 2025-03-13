
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import JobApplicationForm from '@/components/jobs/JobApplicationForm';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building, MapPin, Calendar, Clock, Award, Briefcase, 
  DollarSign, Share2, Bookmark, ShieldCheck, Users,
  GraduationCap, Hourglass, Mail, Phone, ExternalLink, Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useBookmarkJob from '@/hooks/useBookmarkJob';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    description?: string; // Make description optional
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface RelatedJob {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
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
  const [relatedJobs, setRelatedJobs] = useState<RelatedJob[]>([]);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const shareUrlRef = useRef<HTMLInputElement>(null);
  const { toast: showToast } = useToast();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
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
          
          // Fetch related jobs from the same category
          const { data: relatedJobsData, error: relatedError } = await supabase
            .from('jobs')
            .select(`
              id,
              title,
              location,
              job_type,
              company:company_id(name)
            `)
            .eq('category_id', data.category_id)
            .neq('id', data.id)
            .limit(3);
            
          if (!relatedError && relatedJobsData) {
            setRelatedJobs(relatedJobsData.map(job => ({
              id: job.id,
              title: job.title,
              company_name: job.company?.name || 'Unknown',
              location: job.location,
              job_type: job.job_type
            })));
          }
        } else {
          setError('Không tìm thấy việc làm này');
          showToast({
            title: 'Lỗi',
            description: 'Không tìm thấy việc làm này',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Có lỗi xảy ra khi tải thông tin việc làm');
        showToast({
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
  }, [id, user, showToast, fetchSavedJobs]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };
  
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
    return `${Math.floor(diffInDays / 365)} năm trước`;
  };
  
  const handleApplyClick = () => {
    if (!user) {
      showToast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để ứng tuyển việc làm này",
        variant: "destructive"
      });
      navigate('/auth', { state: { returnUrl: `/jobs/${id}` } });
      return;
    }
    
    setShowApplicationForm(true);
    // Scroll to the form
    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleBookmarkClick = async () => {
    if (!user) {
      showToast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để lưu việc làm này",
        variant: "destructive"
      });
      navigate('/auth', { state: { returnUrl: `/jobs/${id}` } });
      return;
    }
    
    if (!job) return;
    
    if (isJobSaved(job.id)) {
      await unsaveJob(job.id);
      showToast({
        title: "Đã xóa khỏi danh sách đã lưu",
        description: "Việc làm này đã được xóa khỏi danh sách đã lưu của bạn",
      });
    } else {
      await saveJob(job.id);
      showToast({
        title: "Đã lưu việc làm",
        description: "Việc làm này đã được lưu vào danh sách của bạn",
      });
    }
  };
  
  const handleShare = () => {
    setShowShareDialog(true);
  };
  
  const copyShareUrl = () => {
    if (shareUrlRef.current) {
      shareUrlRef.current.select();
      document.execCommand('copy');
      showToast({
        title: "Đã sao chép",
        description: "Đường dẫn đã được sao chép vào clipboard",
      });
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
        {/* Application success message */}
        {applicationSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30">
            <Check className="h-5 w-5 text-green-600 dark:text-green-500" />
            <AlertDescription className="text-green-800 dark:text-green-500">
              Đơn ứng tuyển của bạn đã được gửi thành công! Nhà tuyển dụng sẽ liên hệ với bạn sau khi xem xét hồ sơ.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-card rounded-xl border overflow-hidden mb-10">
          <div className="relative h-48 bg-gradient-to-r from-primary/10 to-blue-500/10">
            {job.is_featured && (
              <Badge className="absolute top-4 right-4">Nổi bật</Badge>
            )}
            <div className="absolute top-4 left-4 flex space-x-2">
              {job.is_hot && (
                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                  Hot
                </Badge>
              )}
              {job.is_urgent && (
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  Gấp
                </Badge>
              )}
            </div>
          </div>
          
          <div className="px-8 py-10 -mt-16">
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
                    <span>Đăng {timeAgo(job.created_at)}</span>
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
                    onClick={handleShare}
                  >
                    <Share2 size={18} />
                  </Button>
                  
                  <Button 
                    variant={isJobSaved(job.id) ? "default" : "outline"}
                    size="icon"
                    className="rounded-full"
                    onClick={handleBookmarkClick}
                  >
                    <Bookmark size={18} className={isJobSaved(job.id) ? "fill-white" : ""} />
                  </Button>
                  
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
                    <TabsTrigger value="about">Về công ty</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-0">
                    <div className="prose max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: job.description || 'Không có thông tin mô tả' }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="requirements" className="mt-0">
                    <div className="prose max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: job.requirements || 'Không có thông tin yêu cầu' }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="benefits" className="mt-0">
                    <div className="prose max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: job.benefits || 'Không có thông tin quyền lợi' }} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="about" className="mt-0">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl overflow-hidden border flex-shrink-0">
                          <img src={job.company.logo || '/placeholder.svg'} alt={job.company.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{job.company.name}</h3>
                          <p className="text-muted-foreground">{job.company.industry}</p>
                        </div>
                      </div>
                      
                      <div className="prose max-w-none dark:prose-invert">
                        {job.company.description ? (
                          <div dangerouslySetInnerHTML={{ __html: job.company.description }} />
                        ) : (
                          <p>Không có thông tin mô tả về công ty.</p>
                        )}
                      </div>
                      
                      <div className="pt-4">
                        <Button variant="outline" onClick={() => navigate(`/companies/${job.company.id}`)}>
                          Xem trang công ty
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Apply button for desktop, visible at bottom of content */}
                <div className="mt-8 flex justify-center">
                  <Button size="lg" onClick={handleApplyClick} className="px-8">
                    Ứng tuyển ngay
                  </Button>
                </div>
                
                {/* Related jobs section */}
                {relatedJobs.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-4">Việc làm tương tự</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {relatedJobs.map((job) => (
                        <Link 
                          key={job.id} 
                          to={`/jobs/${job.id}`}
                          className="block bg-card border rounded-lg p-4 hover:border-primary/30 transition-colors"
                        >
                          <h4 className="font-medium mb-1 line-clamp-2">{job.title}</h4>
                          <div className="text-sm text-muted-foreground">{job.company_name}</div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span>{job.location}</span>
                            </div>
                            <Badge variant="outline" className="font-normal text-xs">
                              {job.job_type}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="bg-card rounded-xl border p-6 mb-6 sticky top-24">
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
                    
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-muted-foreground" />
                      <span>50-200 nhân viên</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-muted-foreground" />
                      <span>hr@{job.company.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/companies/${job.company.id}`)}>
                      Xem trang công ty
                    </Button>
                  </div>
                </div>
                
                <div className="bg-card rounded-xl border p-6 sticky top-96">
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
                        <GraduationCap size={16} />
                        <span>Bằng cấp</span>
                      </div>
                      <span className="font-medium">Đại học</span>
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
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Hourglass size={16} />
                        <span>Hạn nộp hồ sơ</span>
                      </div>
                      <span className="font-medium text-orange-500">Còn 14 ngày</span>
                    </div>
                  </div>
                  
                  {!showApplicationForm && (
                    <Button className="w-full mt-6" onClick={handleApplyClick}>
                      Ứng tuyển ngay
                    </Button>
                  )}
                  
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.print()}>
                      <ExternalLink size={16} className="mr-2" />
                      In tin tuyển dụng
                    </Button>
                  </div>
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
            
            <JobApplicationForm 
              jobId={job.id} 
              jobTitle={job.title}
              onSuccess={() => {
                showToast({
                  title: "Thành công!",
                  description: "Đơn ứng tuyển của bạn đã được gửi thành công",
                });
                setShowApplicationForm(false);
                setApplicationSuccess(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </div>
        )}

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Chia sẻ việc làm này</DialogTitle>
              <DialogDescription>
                Sao chép liên kết dưới đây để chia sẻ việc làm này với bạn bè
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <input
                  ref={shareUrlRef}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={window.location.href}
                  readOnly
                />
              </div>
              <Button type="button" size="sm" className="px-3" onClick={copyShareUrl}>
                <span className="sr-only">Copy</span>
                <Check className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-around mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Việc làm: ${job.title} tại ${job.company.name}`)}`, '_blank')}
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                LinkedIn
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default JobDetail;
