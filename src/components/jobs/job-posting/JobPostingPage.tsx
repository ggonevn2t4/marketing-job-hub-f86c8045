
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { JobForm } from './JobForm';
import { CompanyForm } from './CompanyForm';
import { JobPreview } from './JobPreview';
import { AuthenticationRequired } from './AuthenticationRequired';
import { JobFormSchema, type JobFormValues } from './JobPostingTypes';

const JobPostingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('job-form');
  
  const methods = useForm<JobFormValues>({
    resolver: zodResolver(JobFormSchema),
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // If not logged in, show authentication required component
  if (!user) {
    return <AuthenticationRequired />;
  }

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <JobPostingHeader />

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

const JobPostingHeader = () => (
  <div className="mb-10 text-center">
    <FilePlus className="w-16 h-16 text-primary mx-auto mb-4" />
    <h1 className="text-3xl font-bold mb-3">Đăng tin tuyển dụng</h1>
    <p className="text-muted-foreground max-w-xl mx-auto">
      Tiếp cận hàng ngàn ứng viên Marketing tiềm năng và quảng bá thương hiệu nhà tuyển dụng của bạn với TopMarketingJobs
    </p>
  </div>
);

import { FilePlus } from 'lucide-react';

export default JobPostingPage;
