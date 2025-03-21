
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CandidateProfile } from '@/types/profile';
import CandidateManagementTable from '@/components/candidates/CandidateManagementTable';
import { Users, Bookmark, Search, Filter, Building } from 'lucide-react';

const CandidateManagement = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  
  const [allCandidates, setAllCandidates] = useState<CandidateProfile[]>([]);
  const [savedCandidates, setSavedCandidates] = useState<CandidateProfile[]>([]);
  const [appliedCandidates, setAppliedCandidates] = useState<CandidateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If user is not employer, redirect to home
    if (userRole !== 'employer' && !isLoading) {
      navigate('/');
      return;
    }
    
    if (user) {
      fetchAllCandidates();
      fetchSavedCandidates();
      fetchAppliedCandidates();
    }
  }, [user, userRole]);
  
  const fetchAllCandidates = async () => {
    try {
      setIsLoading(true);
      
      // In a real application, this would be filtered by various criteria
      // Here we're just getting all profiles with type 'candidate'
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          skills(*),
          experience(*),
          education(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAllCandidates(data as unknown as CandidateProfile[]);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách ứng viên',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSavedCandidates = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('saved_candidates')
        .select(`
          *,
          candidate:candidate_id(
            *,
            skills(*),
            experience(*),
            education(*)
          )
        `)
        .eq('employer_id', user.id);
      
      if (error) throw error;
      
      const candidates = data.map(item => item.candidate) as unknown as CandidateProfile[];
      setSavedCandidates(candidates);
    } catch (error) {
      console.error('Error fetching saved candidates:', error);
    }
  };
  
  const fetchAppliedCandidates = async () => {
    if (!user) return;
    
    try {
      // First, find the companies associated with this employer
      const { data: companies } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id);
      
      if (!companies || companies.length === 0) return;
      
      const companyIds = companies.map(company => company.id);
      
      // Get jobs from this company
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .in('company_id', companyIds);
      
      if (!jobs || jobs.length === 0) return;
      
      const jobIds = jobs.map(job => job.id);
      
      // Get applications for these jobs
      const { data: applications, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          profile:profiles(
            *,
            skills(*),
            experience(*),
            education(*)
          )
        `)
        .in('job_id', jobIds);
      
      if (error) throw error;
      
      // Extract unique profiles from applications
      const uniqueProfiles = new Map();
      applications.forEach(app => {
        if (app.profile) {
          uniqueProfiles.set(app.profile.id, app.profile);
        }
      });
      
      setAppliedCandidates(Array.from(uniqueProfiles.values()) as unknown as CandidateProfile[]);
    } catch (error) {
      console.error('Error fetching applied candidates:', error);
    }
  };
  
  const updateCandidateStatus = async (candidateId: string, status: string) => {
    try {
      // Update the profile status
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', candidateId);
      
      if (error) throw error;
      
      // Update the local state
      setAllCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status } 
            : candidate
        )
      );
      
      setSavedCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status } 
            : candidate
        )
      );
      
      setAppliedCandidates(prev => 
        prev.map(candidate => 
          candidate.id === candidateId 
            ? { ...candidate, status } 
            : candidate
        )
      );
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating candidate status:', error);
      return Promise.reject(error);
    }
  };
  
  const filterCandidates = (candidates: CandidateProfile[]) => {
    return candidates.filter(candidate => {
      // Search term filtering
      const matchesSearch = !searchTerm || 
        (candidate.full_name && candidate.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.email && candidate.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (candidate.bio && candidate.bio.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Skills filtering
      const matchesSkill = !filterSkill || 
        (candidate.skills && candidate.skills.some(skill => 
          skill.name.toLowerCase().includes(filterSkill.toLowerCase())
        ));
      
      // Location filtering
      const matchesLocation = !filterLocation || 
        (candidate.address && candidate.address.toLowerCase().includes(filterLocation.toLowerCase()));
      
      // Experience filtering
      const matchesExperience = !filterExperience || 
        (candidate.experience && candidate.experience.length >= parseInt(filterExperience));
      
      return matchesSearch && matchesSkill && matchesLocation && matchesExperience;
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" /> Quản lý ứng viên
            </h1>
            <p className="text-muted-foreground">
              Tìm kiếm, theo dõi và quản lý ứng viên tiềm năng cho công ty của bạn
            </p>
          </div>
          <Button onClick={() => navigate('/find-candidates')}>
            <Search className="h-4 w-4 mr-2" /> Tìm kiếm ứng viên
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Tìm kiếm theo tên, email, thông tin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Địa điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả địa điểm</SelectItem>
                    <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                    <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
                    <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={filterExperience} onValueChange={setFilterExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kinh nghiệm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả kinh nghiệm</SelectItem>
                    <SelectItem value="0">Không có kinh nghiệm</SelectItem>
                    <SelectItem value="1">Ít nhất 1 năm</SelectItem>
                    <SelectItem value="2">Ít nhất 2 năm</SelectItem>
                    <SelectItem value="3">Ít nhất 3 năm</SelectItem>
                    <SelectItem value="5">Ít nhất 5 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4">
              <Input
                placeholder="Kỹ năng (ví dụ: Marketing, SEO, Content Writing...)"
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="gap-2">
              <Users className="h-4 w-4" /> Tất cả ứng viên ({filterCandidates(allCandidates).length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Bookmark className="h-4 w-4" /> Đã lưu ({filterCandidates(savedCandidates).length})
            </TabsTrigger>
            <TabsTrigger value="applied" className="gap-2">
              <Building className="h-4 w-4" /> Đã ứng tuyển ({filterCandidates(appliedCandidates).length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <CandidateManagementTable 
              candidates={filterCandidates(allCandidates)}
              isLoading={isLoading}
              onUpdateStatus={updateCandidateStatus}
              filterBy="all"
            />
          </TabsContent>
          
          <TabsContent value="saved">
            <CandidateManagementTable 
              candidates={filterCandidates(savedCandidates)}
              isLoading={isLoading}
              onUpdateStatus={updateCandidateStatus}
              filterBy="saved"
            />
          </TabsContent>
          
          <TabsContent value="applied">
            <CandidateManagementTable 
              candidates={filterCandidates(appliedCandidates)}
              isLoading={isLoading}
              onUpdateStatus={updateCandidateStatus}
              filterBy="applied"
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CandidateManagement;
