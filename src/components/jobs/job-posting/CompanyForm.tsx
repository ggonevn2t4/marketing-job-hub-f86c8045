
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useCompanyProfile } from '@/hooks/useCompanyProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Upload } from 'lucide-react';
import { JobFormValues } from './JobPostingTypes';

interface CompanyFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const CompanyForm = ({ onPrevious, onNext }: CompanyFormProps) => {
  const { user } = useAuth();
  const { profile, isLoading } = useCompanyProfile(user?.id);
  const form = useFormContext<JobFormValues>();
  const { toast } = useToast();

  // Pre-fill company data if available
  React.useEffect(() => {
    if (profile && !form.getValues('company.name')) {
      form.setValue('company.name', profile.name);
      form.setValue('company.website', profile.website || '');
      form.setValue('company.description', profile.description || '');
    }
  }, [profile, form]);

  const handleCompanyContinue = () => {
    // Validate company form fields
    const companyValid = form.trigger([
      'company.name',
      'company.email',
    ]);
    
    if (companyValid) {
      onNext();
    } else {
      toast({
        title: 'Vui lòng kiểm tra thông tin',
        description: 'Các trường bắt buộc chưa được điền đầy đủ',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="company.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên công ty <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="VD: TopMarketingJobs" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="company.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email liên hệ <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Email nhận CV ứng viên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input placeholder="Số điện thoại liên hệ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <Label htmlFor="logo" className="block mb-2">Logo công ty</Label>
        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <Button variant="outline" size="sm" type="button">
              <Upload className="mr-2 h-4 w-4" />
              Tải lên Logo
            </Button>
            <p className="text-xs text-muted-foreground mt-2">PNG, JPG hoặc SVG (Tối đa 1MB)</p>
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="company.website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website công ty</FormLabel>
            <FormControl>
              <Input placeholder="https://www.company.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giới thiệu công ty</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Mô tả về công ty, văn hóa, sứ mệnh..." 
                className="min-h-32"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onPrevious} type="button">Quay lại</Button>
        <Button onClick={handleCompanyContinue} type="button">Tiếp tục</Button>
      </div>
    </div>
  );
};
