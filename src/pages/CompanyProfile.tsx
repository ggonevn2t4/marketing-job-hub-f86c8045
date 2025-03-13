
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import CompanyProfileForm from '@/components/profile/CompanyProfileForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Building2 } from 'lucide-react';

const CompanyProfile = () => {
  const { user, userRole, isLoading: authLoading } = useAuth();
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [loadingCompanyId, setLoadingCompanyId] = useState(true);
  const { 
    profile, 
    isLoading, 
    updateProfile
  } = useCompanyProfile(companyId);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu người dùng không đăng nhập, chuyển hướng đến trang đăng nhập
    if (!authLoading && !user) {
      navigate('/auth');
    }
    
    // Nếu là ứng viên, chuyển hướng đến trang hồ sơ cá nhân
    if (!authLoading && userRole === 'candidate') {
      navigate('/profile');
    }
  }, [user, userRole, authLoading, navigate]);

  // Lấy hoặc tạo mới companyId
  useEffect(() => {
    const getOrCreateCompany = async () => {
      if (!user) return;

      try {
        // Tìm kiếm công ty liên kết với user_id hiện tại
        const { data, error } = await supabase
          .from('companies')
          .select('id')
          .contains('metadata', { user_id: user.id })
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          // Đã có công ty
          setCompanyId(data.id);
        } else {
          // Chưa có công ty, tạo mới
          const { data: newCompany, error: createError } = await supabase
            .from('companies')
            .insert({
              name: 'Công ty mới',
              metadata: { user_id: user.id }
            })
            .select('id')
            .single();
            
          if (createError) throw createError;
          
          setCompanyId(newCompany.id);
        }
      } catch (error) {
        console.error('Error getting or creating company:', error);
      } finally {
        setLoadingCompanyId(false);
      }
    };

    getOrCreateCompany();
  }, [user]);

  if (authLoading || loadingCompanyId || isLoading) {
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

  if (userRole !== 'employer') {
    return (
      <Layout>
        <div className="container py-10">
          <Alert>
            <AlertDescription>
              Trang này chỉ dành cho nhà tuyển dụng. Nếu bạn là ứng viên, vui lòng truy cập trang hồ sơ cá nhân.
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
          <Building2 className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Hồ sơ công ty</h1>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="space-y-8">
          <CompanyProfileForm 
            profile={profile} 
            isLoading={isLoading} 
            onSubmit={updateProfile} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default CompanyProfile;
