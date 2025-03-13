
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserSearch, AlertCircle } from 'lucide-react';
import CandidateCard from '@/components/candidates/CandidateCard';
import { fetchCandidatesList, fetchSavedCandidatesList, CandidateFilters } from '@/services/candidatesDataService';
import { useSavedCandidates } from '@/hooks/useSavedCandidates';
import type { CandidateProfile } from '@/types/profile';
import { AuthenticationRequired } from '@/components/jobs/job-posting/AuthenticationRequired';

const FindCandidates = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [savedCandidates, setSavedCandidates] = useState<CandidateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { saveCandidate, unsaveCandidate, refreshSavedCandidates } = useSavedCandidates();
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => {
    if (user && userRole === 'employer') {
      loadCandidates();
      loadSavedCandidates();
    }
  }, [user, userRole]);

  const loadCandidates = async (filters: CandidateFilters = {}) => {
    setIsLoading(true);
    try {
      const data = await fetchCandidatesList(filters);
      setCandidates(data);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedCandidates = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSavedCandidatesList();
      setSavedCandidates(data);
    } catch (error) {
      console.error('Error loading saved candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const filters: CandidateFilters = {
      searchTerm,
      position,
      location,
      experience,
      skills: skills.split(',').map(s => s.trim()).filter(s => s),
    };
    loadCandidates(filters);
  };

  const sortCandidates = (candidatesList: CandidateProfile[]) => {
    if (sortOrder === 'latest') {
      // Sắp xếp theo thời gian tạo tài khoản mới nhất (ví dụ đơn giản)
      return [...candidatesList].sort((a, b) => {
        // Sử dụng created_at thay vì updated_at vì CandidateProfile có created_at
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
    } else if (sortOrder === 'relevant') {
      // Sắp xếp theo mức độ phù hợp (logic phức tạp hơn trong thực tế)
      return candidatesList;
    } else if (sortOrder === 'experience') {
      // Sắp xếp theo kinh nghiệm (ví dụ đơn giản)
      return [...candidatesList].sort((a, b) => {
        const expA = a.experience?.length || 0;
        const expB = b.experience?.length || 0;
        return expB - expA;
      });
    }
    return candidatesList;
  };

  // Nếu không phải nhà tuyển dụng, hiển thị thông báo
  if (!user || userRole !== 'employer') {
    return <AuthenticationRequired />;
  }

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <UserSearch className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-3">Tìm kiếm ứng viên</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Tiếp cận ứng viên Marketing tiềm năng phù hợp với nhu cầu tuyển dụng của doanh nghiệp
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      placeholder="Tìm kiếm theo kỹ năng, vị trí..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Button className="w-full" onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <select 
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option value="">Vị trí</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="content-marketing">Content Marketing</option>
                    <option value="seo-specialist">SEO Specialist</option>
                    <option value="sem-specialist">SEM Specialist</option>
                    <option value="social-media">Social Media</option>
                  </select>

                  <select 
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Địa điểm</option>
                    <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
                    <option value="ha-noi">Hà Nội</option>
                    <option value="da-nang">Đà Nẵng</option>
                    <option value="other">Khác</option>
                  </select>

                  <select 
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="">Kinh nghiệm</option>
                    <option value="fresher">Fresher (0-1 năm)</option>
                    <option value="junior">Junior (1-2 năm)</option>
                    <option value="middle">Middle (2-5 năm)</option>
                    <option value="senior">Senior (5+ năm)</option>
                  </select>

                  <Input
                    placeholder="Kỹ năng (phân cách bằng dấu phẩy)"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all" onClick={() => loadCandidates()}>Tất cả</TabsTrigger>
                <TabsTrigger value="new" onClick={() => loadCandidates({ searchTerm: 'new' })}>Mới nhất</TabsTrigger>
                <TabsTrigger value="saved" onClick={() => loadSavedCandidates()}>Đã lưu</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">
                    {isLoading 
                      ? 'Đang tải ứng viên...' 
                      : `Hiển thị ${candidates.length} ứng viên`}
                  </p>
                  <select 
                    className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="latest">Mới nhất</option>
                    <option value="relevant">Phù hợp nhất</option>
                    <option value="experience">Kinh nghiệm</option>
                  </select>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {sortCandidates(candidates).map((candidate) => (
                      <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                    
                    {candidates.length === 0 && (
                      <div className="text-center py-10">
                        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Không tìm thấy ứng viên</h3>
                        <p className="text-muted-foreground">
                          Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh các bộ lọc
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {candidates.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <Button variant="outline" onClick={() => loadCandidates()}>
                      Xem thêm ứng viên
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">
                    {isLoading 
                      ? 'Đang tải ứng viên...' 
                      : `Hiển thị ${candidates.length} ứng viên mới nhất`}
                  </p>
                  <select 
                    className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="latest">Mới nhất</option>
                    <option value="relevant">Phù hợp nhất</option>
                    <option value="experience">Kinh nghiệm</option>
                  </select>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {sortCandidates(candidates).slice(0, 5).map((candidate) => (
                      <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                    
                    {candidates.length === 0 && (
                      <div className="text-center py-10">
                        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Không tìm thấy ứng viên mới</h3>
                        <p className="text-muted-foreground">
                          Hiện tại không có ứng viên mới nào
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">
                    {isLoading 
                      ? 'Đang tải ứng viên...' 
                      : `Hiển thị ${savedCandidates.length} ứng viên đã lưu`}
                  </p>
                  <select 
                    className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="latest">Mới nhất</option>
                    <option value="relevant">Phù hợp nhất</option>
                    <option value="experience">Kinh nghiệm</option>
                  </select>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {sortCandidates(savedCandidates).map((candidate) => (
                      <CandidateCard 
                        key={candidate.id} 
                        candidate={candidate} 
                        showSaveButton={false} 
                      />
                    ))}
                    
                    {savedCandidates.length === 0 && (
                      <div className="text-center py-10">
                        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Chưa có ứng viên đã lưu</h3>
                        <p className="text-muted-foreground">
                          Hãy lưu các ứng viên tiềm năng để xem lại sau
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindCandidates;
