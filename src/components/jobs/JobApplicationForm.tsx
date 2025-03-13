
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  resumeUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
  coverLetter: z.string().min(10, 'Thư xin việc quá ngắn'),
});

type FormValues = z.infer<typeof formSchema>;

interface JobApplicationFormProps {
  jobId: string;
  onSuccess?: () => void;
}

const JobApplicationForm = ({ jobId, onSuccess }: JobApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      resumeUrl: '',
      coverLetter: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const applicationData = {
        job_id: jobId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        resume_url: data.resumeUrl || null,
        cover_letter: data.coverLetter,
      };
      
      const { data: insertedData, error } = await supabase
        .from('job_applications')
        .insert([applicationData])
        .select();
      
      if (error) throw error;
      
      if (insertedData && insertedData.length > 0) {
        setApplicationId(insertedData[0].id);
      }
      
      setSubmitted(true);
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500 h-6 w-6" />
            <CardTitle>Đơn ứng tuyển đã được gửi!</CardTitle>
          </div>
          <CardDescription>
            Cảm ơn bạn đã nộp đơn ứng tuyển. Nhà tuyển dụng sẽ xem xét hồ sơ của bạn và liên hệ nếu phù hợp.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Bạn có thể theo dõi trạng thái đơn ứng tuyển của mình bằng liên kết bên dưới. 
              Hãy lưu lại đường dẫn này để kiểm tra sau.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to={`/application-tracker?id=${applicationId}`}>
              Theo dõi đơn ứng tuyển
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên của bạn" {...field} />
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
                <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại của bạn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="resumeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link CV (Google Drive, Dropbox...)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thư xin việc <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Giới thiệu về bản thân và lý do bạn muốn ứng tuyển vị trí này..." 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gửi đơn ứng tuyển
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobApplicationForm;
