
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FilePlus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import JobForm from '@/components/jobs/JobForm';
import CompanyForm from '@/components/jobs/CompanyForm';
import JobPreview from '@/components/jobs/JobPreview';

// Define form validation schema
const jobFormSchema = z.object({
  title: z.string().min(3, { message: 'Vui lòng nhập chức danh công việc' }),
  category_id: z.string().min(1, { message: 'Vui lòng chọn ngành nghề' }),
  job_type: z.string().min(1, { message: 'Vui lòng chọn loại hình công việc' }),
  experience_level: z.string().min(1, { message: 'Vui lòng chọn kinh nghiệm yêu cầu' }),
  location: z.string().min(1, { message: 'Vui lòng nhập địa điểm làm việc' }),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  description: z.string().min(10, { message: 'Vui lòng nhập mô tả công việc chi tiết hơn' }),
  requirements: z.string().min(10, { message: 'Vui lòng nhập yêu cầu ứng viên chi tiết hơn' }),
  benefits: z.string().optional(),
  company: z.object({
    name: z.string().min(1, { message: 'Vui lòng nhập tên công ty' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    phone: z.string().optional(),
    website: z.string().optional(),
    description: z.string().optional(),
  }),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('job-form');
  
  const methods = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      category_id: '',
      job_type: '',
      experience_level: '',
      location: '',
      salary_min: '',
      salary_max: '',
      description: '',
      requirements: '',
      benefits: '',
      company: {
        name: '',
        email: '',
        phone: '',
        website: '',
        description: '',
      },
    },
  });

  // Handler for tab navigation
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // If not logged in, prompt to login
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Đăng nhập để tiếp tục</h1>
                <p className="text-muted-foreground">
                  Bạn cần đăng nhập để đăng tin tuyển dụng trên TopMarketingJobs
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <Button onClick={() => navigate('/auth')} size="lg">
                  Đăng nhập ngay
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} size="lg">
                  Quay lại trang chủ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center">
              <FilePlus className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-3">Đăng tin tuyển dụng</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Tiếp cận hàng ngàn ứng viên Marketing tiềm năng và quảng bá thương hiệu nhà tuyển dụng của bạn với TopMarketingJobs
              </p>
            </div>

            <FormProvider {...methods}>
              <form>
                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="job-form">Thông tin tuyển dụng</TabsTrigger>
                    <TabsTrigger value="company-details">Thông tin công ty</TabsTrigger>
                    <TabsTrigger value="preview">Xem trước & Thanh toán</TabsTrigger>
                  </TabsList>

                  <TabsContent value="job-form" className="space-y-4">
                    <Card>
                      <CardContent className="pt-6">
                        <JobForm onNext={() => handleTabChange('company-details')} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="company-details">
                    <Card>
                      <CardContent className="pt-6">
                        <CompanyForm 
                          onPrevious={() => handleTabChange('job-form')}
                          onNext={() => handleTabChange('preview')}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preview">
                    <Card>
                      <CardContent className="p-6">
                        <JobPreview onPrevious={() => handleTabChange('company-details')} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;
