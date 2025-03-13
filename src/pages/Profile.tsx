
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Layout from '@/components/layout/Layout';
import BasicInfoForm from '@/components/profile/BasicInfoForm';
import EducationForm from '@/components/profile/EducationForm';
import ExperienceForm from '@/components/profile/ExperienceForm';
import SkillsForm from '@/components/profile/SkillsForm';
import ResumeUpload from '@/components/profile/ResumeUpload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, GraduationCap, Briefcase, FileText, Settings } from 'lucide-react';

const Profile = () => {
  const { user, userRole, isLoading: authLoading } = useAuth();
  const { 
    profile, 
    isLoading, 
    updateBasicInfo,
    handleAddEducation,
    handleUpdateEducation,
    handleDeleteEducation,
    handleAddExperience,
    handleUpdateExperience,
    handleDeleteExperience,
    handleAddSkill,
    handleUpdateSkill,
    handleDeleteSkill,
    handleUploadResume,
    handleDeleteResume
  } = useProfile();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    // Kiểm tra nếu người dùng không đăng nhập, chuyển hướng đến trang đăng nhập
    if (!authLoading && !user) {
      navigate('/auth');
    }
    
    // Nếu là nhà tuyển dụng, chuyển hướng đến trang hồ sơ công ty
    if (!authLoading && userRole === 'employer') {
      navigate('/company-profile');
    }
  }, [user, userRole, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container py-10">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  if (userRole !== 'candidate') {
    return (
      <Layout>
        <div className="container py-10">
          <Alert>
            <AlertDescription>
              Trang này chỉ dành cho ứng viên. Nếu bạn là nhà tuyển dụng, vui lòng truy cập trang hồ sơ công ty.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout requireAuth>
      <div className="container py-10">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
        </div>
        
        <Separator className="mb-6" />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="basic" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Thông tin cơ bản</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden md:inline">Học vấn</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Kinh nghiệm</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Kỹ năng</span>
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Hồ sơ CV</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="pt-4">
            <BasicInfoForm 
              profile={profile} 
              isLoading={isLoading} 
              onSubmit={updateBasicInfo} 
            />
          </TabsContent>
          
          <TabsContent value="education" className="pt-4">
            <EducationForm 
              education={profile?.education || []} 
              isLoading={isLoading}
              onAdd={handleAddEducation}
              onUpdate={handleUpdateEducation}
              onDelete={handleDeleteEducation}
            />
          </TabsContent>
          
          <TabsContent value="experience" className="pt-4">
            <ExperienceForm 
              experience={profile?.experience || []} 
              isLoading={isLoading}
              onAdd={handleAddExperience}
              onUpdate={handleUpdateExperience}
              onDelete={handleDeleteExperience}
            />
          </TabsContent>
          
          <TabsContent value="skills" className="pt-4">
            <SkillsForm 
              skills={profile?.skills || []} 
              isLoading={isLoading}
              onAdd={handleAddSkill}
              onUpdate={handleUpdateSkill}
              onDelete={handleDeleteSkill}
            />
          </TabsContent>
          
          <TabsContent value="resume" className="pt-4">
            <ResumeUpload
              resumeUrl={profile?.resume_url}
              isLoading={isLoading}
              onUpload={(file) => handleUploadResume(file).then(() => {})}
              onDelete={handleDeleteResume}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
