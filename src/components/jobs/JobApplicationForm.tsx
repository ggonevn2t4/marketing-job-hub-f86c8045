
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, Upload, AlertCircle, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { sendZapierEvent } from '@/services/zapierService';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const formSchema = z.object({
  full_name: z.string().min(2, { message: 'Tên cần ít nhất 2 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  phone: z.string().optional(),
  cover_letter: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  education: z.string().optional()
});

interface JobApplicationFormProps {
  jobId: string;
  jobTitle?: string;
  onSuccess: () => void;
}

const JobApplicationForm = ({ jobId, jobTitle, onSuccess }: JobApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: '',
      cover_letter: '',
      location: '',
      linkedin: '',
      education: ''
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Upload resume if selected
      let resumeUrl = null;
      if (resumeFile) {
        try {
          const fileExt = resumeFile.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${user?.id}/${fileName}`;
          
          // Simulate upload progress for better user experience
          const uploadInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(uploadInterval);
                return prev;
              }
              return prev + 10;
            });
          }, 300);
          
          // Here you would actually upload to Supabase Storage
          // For now we'll just simulate it
          /* 
          const { data, error } = await supabase.storage
            .from('resumes')
            .upload(filePath, resumeFile);
            
          if (error) throw error;
          resumeUrl = data.path;
          */
          
          // Simulate successful upload
          await new Promise(resolve => setTimeout(resolve, 2000));
          resumeUrl = `resumes/${filePath}`;
          
          clearInterval(uploadInterval);
          setUploadProgress(100);
          
        } catch (error) {
          console.error('Error uploading resume:', error);
          setUploadError('Không thể tải CV lên. Vui lòng thử lại.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Submit application
      const { data: application, error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          full_name: values.full_name,
          email: values.email,
          phone: values.phone || null,
          cover_letter: values.cover_letter || null,
          resume_url: resumeUrl,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Send notification to employer
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'job_application',
            data: {
              jobId,
              applicantName: values.full_name,
              jobTitle: jobTitle
            },
          }),
        });
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
      }
      
      // Send event to Zapier if configured
      try {
        await sendZapierEvent('job_application', {
          job_id: jobId,
          job_title: jobTitle,
          applicant_name: values.full_name,
          applicant_email: values.email,
          application_date: new Date().toISOString(),
        });
      } catch (zapierError) {
        console.error('Error sending event to Zapier:', zapierError);
        // Non-critical error, don't show to user
      }
      
      toast({
        title: 'Ứng tuyển thành công',
        description: `Đơn ứng tuyển của bạn cho vị trí ${jobTitle} đã được gửi thành công.`,
      });
      
      form.reset();
      setResumeFile(null);
      setUploadProgress(0);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      toast({
        title: 'Đã xảy ra lỗi',
        description: err.message || 'Không thể gửi đơn ứng tuyển. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Chỉ chấp nhận file PDF hoặc Word');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Kích thước file không được vượt quá 5MB');
      return;
    }
    
    setResumeFile(file);
    setUploadError(null);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Thông tin ứng tuyển</CardTitle>
        <CardDescription>
          Điền thông tin của bạn để ứng tuyển vị trí này
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm</FormLabel>
                    <FormControl>
                      <Input placeholder="Hà Nội, Việt Nam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn (nếu có)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trình độ học vấn</FormLabel>
                    <FormControl>
                      <Input placeholder="Đại học..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-3">
              <p className="font-semibold flex items-center gap-2">
                <FileText size={18} />
                Tải lên CV của bạn
              </p>
              
              <div className="border-2 border-dashed rounded-lg p-6 text-center border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors">
                <input 
                  type="file" 
                  id="resume" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                
                {!resumeFile ? (
                  <>
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="mb-2">Kéo thả hoặc nhấn để tải lên CV</p>
                    <p className="text-sm text-muted-foreground">Hỗ trợ PDF, DOC, DOCX (tối đa 5MB)</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => document.getElementById('resume')?.click()}
                    >
                      Chọn file
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">{resumeFile.name}</span>
                    </div>
                    
                    {uploadProgress > 0 && isSubmitting && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => {
                        setResumeFile(null);
                        setUploadProgress(0);
                      }}
                    >
                      Chọn file khác
                    </Button>
                  </div>
                )}
              </div>
              
              {uploadError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {uploadError}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="cover_letter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thư xin việc (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Giới thiệu về bản thân và lý do bạn muốn ứng tuyển vị trí này..." 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" size={isMobile ? "default" : "lg"} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đơn ứng tuyển'
              )}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Bằng cách nhấn vào nút "Gửi đơn ứng tuyển", bạn đồng ý để nhà tuyển dụng xem thông tin của bạn để xét tuyển.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JobApplicationForm;
