
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Layout from '@/components/layout/Layout';
import BasicInfoForm from '@/components/profile/BasicInfoForm';
import EducationForm from '@/components/profile/EducationForm';
import ExperienceForm from '@/components/profile/ExperienceForm';
import SkillsForm from '@/components/profile/SkillsForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';

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
    handleDeleteSkill
  } = useProfile();
  const navigate = useNavigate();

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
    <Layout>
      <div className="container py-10">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="space-y-8">
          <BasicInfoForm 
            profile={profile} 
            isLoading={isLoading} 
            onSubmit={updateBasicInfo} 
          />
          
          <EducationForm 
            education={profile?.education || []} 
            isLoading={isLoading}
            onAdd={handleAddEducation}
            onUpdate={handleUpdateEducation}
            onDelete={handleDeleteEducation}
          />
          
          <ExperienceForm 
            experience={profile?.experience || []} 
            isLoading={isLoading}
            onAdd={handleAddExperience}
            onUpdate={handleUpdateExperience}
            onDelete={handleDeleteExperience}
          />
          
          <SkillsForm 
            skills={profile?.skills || []} 
            isLoading={isLoading}
            onAdd={handleAddSkill}
            onUpdate={handleUpdateSkill}
            onDelete={handleDeleteSkill}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
