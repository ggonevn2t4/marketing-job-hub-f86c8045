
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { createJobPosting } from '@/services/jobService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EXPERIENCE_LEVELS, JOB_TYPES } from '@/types/job';
import { Loader2 } from 'lucide-react';
import { JobFormValues } from './JobPostingTypes';

interface JobPreviewProps {
  onPrevious: () => void;
}

export const JobPreview = ({ onPrevious }: JobPreviewProps) => {
  const { user } = useAuth();
  const form = useFormContext<JobFormValues>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  
  const formValues = form.getValues();
  
  // Find labels for selected values
  const jobTypeLabel = JOB_TYPES.find(t => t.value === formValues.job_type)?.label || formValues.job_type;
  const experienceLevelLabel = EXPERIENCE_LEVELS.find(e => e.value === formValues.experience_level)?.label || formValues.experience_level;
  
  // Format salary
  const salaryText = formValues.salary_min && formValues.salary_max
    ? `${formValues.salary_min} - ${formValues.salary_max} VNĐ`
    : formValues.salary_min 
      ? `Từ ${formValues.salary_min} VNĐ`
      : formValues.salary_max
        ? `Đến ${formValues.salary_max} VNĐ`
        : 'Thương lượng';

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: 'Lỗi xác thực',
        description: 'Bạn cần đăng nhập để đăng tin tuyển dụng',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare job data
      const jobData = {
        title: formValues.title,
        company_id: user.id,
        category_id: formValues.category_id,
        job_type: formValues.job_type,
        experience_level: formValues.experience_level,
        location: formValues.location,
        salary: salaryText !== 'Thương lượng' ? salaryText : null,
        description: formValues.description,
        requirements: formValues.requirements,
        benefits: formValues.benefits,
        is_featured: selectedPackage === 'premium',
      };
      
      // Send job posting to the server
      await createJobPosting(jobData);
      
      toast({
        title: 'Đăng tin thành công',
        description: 'Tin tuyển dụng của bạn đã được đăng thành công',
      });
      
      // Redirect to job management page
      navigate('/manage-jobs');
    } catch (error: any) {
      toast({
        title: 'Đăng tin thất bại',
        description: error.message || 'Có lỗi xảy ra khi đăng tin',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle className="text-lg font-semibold">Xem trước tin tuyển dụng</AlertTitle>
        <AlertDescription>
          Vui lòng kiểm tra lại nội dung trước khi đăng tuyển
        </AlertDescription>
      </Alert>
      
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 w-16 h-16 rounded flex items-center justify-center">
              <span className="text-xl font-bold text-gray-400">Logo</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{formValues.title}</h3>
              <p className="text-muted-foreground">{formValues.company.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Vị trí:</span>
              <span>{formValues.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Loại hình:</span>
              <span>{jobTypeLabel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Kinh nghiệm:</span>
              <span>{experienceLevelLabel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Địa điểm:</span>
              <span>{formValues.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Mức lương:</span>
              <span>{salaryText}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chọn gói dịch vụ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className={`border hover:border-primary cursor-pointer transition-all ${selectedPackage === 'basic' ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''}`}
            onClick={() => setSelectedPackage('basic')}
          >
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold">Cơ bản</h4>
                <p className="text-2xl font-bold mt-2">1,000,000 VNĐ</p>
                <p className="text-sm text-muted-foreground">30 ngày</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-50">✓</Badge>
                  Hiển thị 30 ngày
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-50">✓</Badge>
                  Tiếp cận không giới hạn ứng viên
                </li>
                <li className="flex items-center text-muted-foreground">
                  <Badge variant="outline" className="mr-2">✕</Badge>
                  Đẩy tin tuyển dụng
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card 
            className={`border relative hover:border-primary cursor-pointer transition-all ${selectedPackage === 'standard' ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''}`}
            onClick={() => setSelectedPackage('standard')}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded">
              Phổ biến nhất
            </div>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold">Nâng cao</h4>
                <p className="text-2xl font-bold mt-2">2,500,000 VNĐ</p>
                <p className="text-sm text-muted-foreground">30 ngày</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-50">✓</Badge>
                  Hiển thị 30 ngày
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-50">✓</Badge>
                  Tiếp cận không giới hạn ứng viên
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-50">✓</Badge>
                  Đẩy tin tuyển dụng (7 ngày)
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card 
            className={`border hover:border-primary cursor-pointer transition-all ${selectedPackage === 'premium' ? 'border-primary ring-2 ring-primary ring-opacity-50' : ''}`}
            onClick={() => setSelectedPackage('premium')}
          >
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold">Premium</h4>
                <p className="text-2xl font-bold mt-2">5,000,000 VNĐ</p>
                <p className="text-sm text-muted-foreground">30 ngày</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-50">✓</Badge>
                  Hiển thị 30 ngày
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-50">✓</Badge>
                  Tiếp cận không giới hạn ứng viên
                </li>
                <li className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-50">✓</Badge>
                  Đẩy tin tuyển dụng (15 ngày)
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onPrevious} type="button" disabled={isSubmitting}>Quay lại</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý
              </>
            ) : (
              'Thanh toán & Đăng tuyển'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
