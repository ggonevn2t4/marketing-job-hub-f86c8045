
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchCategories } from '@/utils/supabaseQueries';
import { useEffect } from 'react';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Tiêu đề phải có ít nhất 5 ký tự' }),
  category_id: z.string().min(1, { message: 'Vui lòng chọn chuyên ngành' }),
  location: z.string().min(2, { message: 'Vui lòng nhập địa điểm làm việc' }),
  job_type: z.string().min(1, { message: 'Vui lòng chọn loại công việc' }),
  experience_level: z.string().min(1, { message: 'Vui lòng chọn yêu cầu kinh nghiệm' }),
  salary: z.string().min(1, { message: 'Vui lòng nhập mức lương' }),
  description: z.string().min(50, { message: 'Mô tả phải có ít nhất 50 ký tự' }),
  requirements: z.string().min(50, { message: 'Yêu cầu phải có ít nhất 50 ký tự' }),
  benefits: z.string().min(50, { message: 'Quyền lợi phải có ít nhất 50 ký tự' }),
  is_featured: z.boolean().default(false),
  is_hot: z.boolean().default(false),
  is_urgent: z.boolean().default(false),
});

type PostJobFormValues = z.infer<typeof formSchema>;

const PostJob = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category_id: '',
      location: '',
      job_type: '',
      experience_level: '',
      salary: '',
      description: '',
      requirements: '',
      benefits: '',
      is_featured: false,
      is_hot: false,
      is_urgent: false,
    },
  });
  
  useEffect(() => {
    // Kiểm tra xem user có phải là nhà tuyển dụng không
    if (user && userRole !== 'employer') {
      toast({
        title: 'Không có quyền truy cập',
        description: 'Bạn cần đăng nhập với tài khoản nhà tuyển dụng để đăng tin tuyển dụng',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }
    
    const loadData = async () => {
      try {
        // Lấy danh sách chuyên ngành
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Lấy thông tin công ty của nhà tuyển dụng
        if (user) {
          const { data, error } = await supabase
            .from('companies')
            .select('id')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching company info:', error);
            
            // Nếu không tìm thấy công ty, chuyển hướng đến trang tạo hồ sơ công ty
            if (error.code === 'PGRST116') {
              toast({
                title: 'Cần tạo hồ sơ công ty',
                description: 'Bạn cần tạo hồ sơ công ty trước khi đăng tin tuyển dụng',
                variant: 'destructive',
              });
              navigate('/company-profile');
              return;
            }
            
            throw error;
          }
          
          if (data) {
            setCompanyId(data.id);
          }
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    
    loadData();
  }, [user, userRole, navigate]);
  
  const onSubmit = async (values: PostJobFormValues) => {
    if (!user || !companyId) {
      toast({
        title: 'Lỗi',
        description: 'Bạn cần đăng nhập và tạo hồ sơ công ty trước',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Đảm bảo tất cả các trường bắt buộc đều có mặt
      const jobData = {
        company_id: companyId,
        title: values.title,
        category_id: values.category_id,
        location: values.location,
        job_type: values.job_type,
        experience_level: values.experience_level,
        salary: values.salary,
        description: values.description,
        requirements: values.requirements,
        benefits: values.benefits,
        is_featured: values.is_featured,
        is_hot: values.is_hot,
        is_urgent: values.is_urgent
      };
      
      const { data, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select('id')
        .single();
        
      if (error) throw error;
      
      if (data) {
        toast({
          title: 'Thành công',
          description: 'Đăng tin tuyển dụng thành công',
        });
        navigate(`/jobs/${data.id}`);
      }
    } catch (err: any) {
      console.error('Error posting job:', err);
      toast({
        title: 'Lỗi',
        description: err.message || 'Có lỗi xảy ra khi đăng tin tuyển dụng',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Đăng tin tuyển dụng mới</h1>
          <p className="text-muted-foreground">
            Điền đầy đủ thông tin để đăng tin tuyển dụng của bạn
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề tin tuyển dụng *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: Frontend Developer, Marketing Manager..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chuyên ngành *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn chuyên ngành" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa điểm làm việc *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: TP. Hồ Chí Minh, Hà Nội..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="job_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại công việc *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại công việc" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Toàn thời gian">Toàn thời gian</SelectItem>
                            <SelectItem value="Bán thời gian">Bán thời gian</SelectItem>
                            <SelectItem value="Thực tập">Thực tập</SelectItem>
                            <SelectItem value="Làm việc từ xa">Làm việc từ xa</SelectItem>
                            <SelectItem value="Hợp đồng">Hợp đồng</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yêu cầu kinh nghiệm *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn yêu cầu kinh nghiệm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Mới tốt nghiệp">Mới tốt nghiệp</SelectItem>
                            <SelectItem value="Dưới 1 năm">Dưới 1 năm</SelectItem>
                            <SelectItem value="1-3 năm">1-3 năm</SelectItem>
                            <SelectItem value="3-5 năm">3-5 năm</SelectItem>
                            <SelectItem value="5+ năm">5+ năm</SelectItem>
                            <SelectItem value="Cấp quản lý">Cấp quản lý</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mức lương *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ví dụ: 15-20 triệu, Trên 30 triệu, Thương lượng..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="description">Mô tả công việc</TabsTrigger>
                    <TabsTrigger value="requirements">Yêu cầu</TabsTrigger>
                    <TabsTrigger value="benefits">Quyền lợi</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-0">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả công việc chi tiết *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Mô tả chi tiết về công việc, trách nhiệm, nhiệm vụ..." 
                              className="min-h-[200px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="requirements" className="mt-0">
                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yêu cầu ứng viên *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Các yêu cầu về kỹ năng, kinh nghiệm, trình độ học vấn..." 
                              className="min-h-[200px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="benefits" className="mt-0">
                    <FormField
                      control={form.control}
                      name="benefits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quyền lợi *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Các quyền lợi, chế độ, môi trường làm việc..." 
                              className="min-h-[200px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tùy chọn nâng cao</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Tin nổi bật</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Tin tuyển dụng sẽ được hiển thị nổi bật trên trang chủ
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_hot"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Tin Hot</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị nhãn "Hot" trên tin tuyển dụng của bạn
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_urgent"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Tin gấp</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Hiển thị nhãn "Gấp" trên tin tuyển dụng của bạn
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/jobs')}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng tin...' : 'Đăng tin tuyển dụng'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default PostJob;
