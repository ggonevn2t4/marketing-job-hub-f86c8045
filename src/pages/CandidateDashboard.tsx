
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, Briefcase, BookOpen, FileText, 
  MessageSquare, BookmarkCheck, AlertCircle
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

const CandidateDashboard = () => {
  const { user, userRole, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated or not a candidate
    if (!authLoading && (!user || userRole !== 'candidate')) {
      navigate('/auth');
    }
  }, [user, userRole, authLoading, navigate]);

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    let completed = 0;
    let total = 5; // Basic info, education, experience, skills, profile picture
    
    if (profile.full_name) completed++;
    if (profile.education && profile.education.length > 0) completed++;
    if (profile.experience && profile.experience.length > 0) completed++;
    if (profile.skills && profile.skills.length > 0) completed++;
    if (profile.avatar_url) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const profileCompletionPercentage = calculateProfileCompletion();

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Bảng điều khiển ứng viên</h1>
          <Button onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            Chỉnh sửa hồ sơ
          </Button>
        </div>

        {profileCompletionPercentage < 80 && (
          <Alert className="mb-6 border-amber-500 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription>
              Hồ sơ của bạn hoàn thành {profileCompletionPercentage}%. Hãy cập nhật đầy đủ thông tin để tăng cơ hội được nhà tuyển dụng chú ý.
              <Button variant="link" onClick={() => navigate('/profile')} className="p-0 ml-2 h-auto">
                Cập nhật ngay
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tin đã lưu</CardTitle>
              <CardDescription>Danh sách việc làm đã lưu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile?.saved_jobs?.length || 0}</div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/saved-jobs')}>
                <BookmarkCheck className="mr-2 h-4 w-4" />
                Xem tin đã lưu
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Đơn ứng tuyển</CardTitle>
              <CardDescription>Đơn ứng tuyển đã gửi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile?.applications?.length || 0}</div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/application-tracker')}>
                <FileText className="mr-2 h-4 w-4" />
                Xem đơn ứng tuyển
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tin nhắn</CardTitle>
              <CardDescription>Tin nhắn từ nhà tuyển dụng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/messages')}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Xem tin nhắn
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent-jobs" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="recent-jobs">Việc làm gần đây</TabsTrigger>
            <TabsTrigger value="profile">Hồ sơ của tôi</TabsTrigger>
            <TabsTrigger value="my-applications">Đơn ứng tuyển</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent-jobs">
            <Card>
              <CardHeader>
                <CardTitle>Việc làm phù hợp với bạn</CardTitle>
                <CardDescription>Dựa trên kỹ năng và kinh nghiệm của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-muted">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <AlertDescription>
                      Hãy cập nhật đầy đủ kỹ năng và kinh nghiệm để nhận được gợi ý việc làm phù hợp hơn.
                    </AlertDescription>
                  </Alert>
                  
                  <Button onClick={() => navigate('/jobs')} className="w-full">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Tìm kiếm việc làm
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin hồ sơ</CardTitle>
                <CardDescription>Thông tin cá nhân và chuyên môn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Thông tin cá nhân
                      </h3>
                      <div className="text-sm">
                        <p><span className="font-medium">Họ tên:</span> {profile?.full_name || 'Chưa cập nhật'}</p>
                        <p><span className="font-medium">Email:</span> {user?.email}</p>
                        <p><span className="font-medium">Số điện thoại:</span> {profile?.phone || 'Chưa cập nhật'}</p>
                        <p><span className="font-medium">Địa chỉ:</span> {profile?.address || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Kinh nghiệm
                      </h3>
                      {profile?.experience && profile.experience.length > 0 ? (
                        <ul className="text-sm">
                          {profile.experience.slice(0, 2).map((exp) => (
                            <li key={exp.id} className="mb-2">
                              <p className="font-medium">{exp.position} tại {exp.company}</p>
                              <p className="text-muted-foreground">
                                {exp.start_date} - {exp.is_current ? 'Hiện tại' : exp.end_date}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">Chưa cập nhật kinh nghiệm</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Học vấn
                      </h3>
                      {profile?.education && profile.education.length > 0 ? (
                        <ul className="text-sm">
                          {profile.education.slice(0, 2).map((edu) => (
                            <li key={edu.id} className="mb-2">
                              <p className="font-medium">{edu.school}</p>
                              <p>{edu.degree} - {edu.field_of_study}</p>
                              <p className="text-muted-foreground">
                                {edu.start_date} - {edu.end_date || 'Hiện tại'}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">Chưa cập nhật học vấn</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Kỹ năng</h3>
                      {profile?.skills && profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <span 
                              key={skill.id} 
                              className="px-2 py-1 bg-muted rounded-md text-xs"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Chưa cập nhật kỹ năng</p>
                      )}
                    </div>
                  </div>
                  
                  <Button onClick={() => navigate('/profile')} className="w-full mt-4">
                    <User className="mr-2 h-4 w-4" />
                    Chỉnh sửa hồ sơ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my-applications">
            <Card>
              <CardHeader>
                <CardTitle>Đơn ứng tuyển gần đây</CardTitle>
                <CardDescription>Tình trạng đơn ứng tuyển của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="bg-muted">
                    <FileText className="h-4 w-4 mr-2" />
                    <AlertDescription>
                      Chưa có đơn ứng tuyển nào. Hãy tìm kiếm và ứng tuyển việc làm phù hợp với bạn.
                    </AlertDescription>
                  </Alert>
                  
                  <Button onClick={() => navigate('/application-tracker')} className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Xem tất cả đơn ứng tuyển
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CandidateDashboard;
