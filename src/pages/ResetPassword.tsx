
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  confirmPassword: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      setResetCompleted(true);
      toast({
        title: "Mật khẩu đã được cập nhật",
        description: "Mật khẩu của bạn đã được đặt lại thành công.",
      });

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        variant: "destructive",
        title: "Lỗi đặt lại mật khẩu",
        description: error.message || "Có lỗi xảy ra khi đặt lại mật khẩu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if we have access to recovery session
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.error('No valid session for password reset:', error);
        toast({
          variant: "destructive",
          title: "Liên kết không hợp lệ hoặc hết hạn",
          description: "Vui lòng yêu cầu đặt lại mật khẩu mới.",
        });
        navigate('/auth');
      }
    };

    checkSession();
  }, [navigate, toast]);

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <Card>
          <CardHeader>
            <CardTitle>Đặt lại mật khẩu</CardTitle>
            <CardDescription>
              Nhập mật khẩu mới cho tài khoản của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetCompleted ? (
              <div className="text-center py-4">
                <p className="mb-2">Mật khẩu của bạn đã được đặt lại thành công!</p>
                <p className="text-sm text-muted-foreground">Đang chuyển hướng đến trang đăng nhập...</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      'Đặt lại mật khẩu'
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate('/auth')}>
              Quay lại trang đăng nhập
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPassword;
