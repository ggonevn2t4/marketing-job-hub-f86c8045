
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Zap, Plus, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  webhookUrl: z.string().url({ message: 'Vui lòng nhập Webhook URL hợp lệ từ Zapier' }),
});

const ZapierIntegration = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhookUrl: '',
    },
  });

  const testWebhook = async (webhookUrl: string) => {
    setIsTesting(true);
    setTestSuccess(false);
    
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: "test_connection",
          source: "TopMarketingJobs",
          user_email: user?.email || "not_logged_in"
        }),
      });
      
      // Since we're using no-cors, we assume success
      setTestSuccess(true);
      toast({
        title: "Yêu cầu đã được gửi",
        description: "Yêu cầu kiểm tra đã được gửi tới Zapier. Vui lòng kiểm tra lịch sử Zap để xác nhận.",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể kết nối với webhook Zapier. Vui lòng kiểm tra URL và thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để sử dụng tính năng này",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Save webhook URL to user preferences
      // In a real implementation, you would save this to your database
      localStorage.setItem('zapier_webhook_url', values.webhookUrl);
      
      toast({
        title: "Lưu thành công",
        description: "Webhook URL đã được lưu thành công",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu cài đặt",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <Zap className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-3xl font-bold">Tích hợp Zapier</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Cài đặt Webhook</CardTitle>
                <CardDescription>
                  Kết nối TopMarketingJobs với Zapier để tự động hóa quy trình marketing email của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="webhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook URL từ Zapier</FormLabel>
                          <FormControl>
                            <Input placeholder="https://hooks.zapier.com/hooks/catch/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={!form.getValues().webhookUrl || isTesting}
                        onClick={() => testWebhook(form.getValues().webhookUrl)}
                        className="flex-1"
                      >
                        {isTesting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang kiểm tra...
                          </>
                        ) : testSuccess ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Đã kiểm tra
                          </>
                        ) : (
                          'Kiểm tra kết nối'
                        )}
                      </Button>
                      
                      <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          'Lưu cài đặt'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sự kiện được hỗ trợ</CardTitle>
                <CardDescription>
                  Các sự kiện sau đây có thể được kích hoạt thông qua tích hợp Zapier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Đăng ký người dùng mới</p>
                      <p className="text-sm text-muted-foreground">Khi có người dùng mới đăng ký tài khoản</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Đơn ứng tuyển mới</p>
                      <p className="text-sm text-muted-foreground">Khi có ứng viên nộp đơn ứng tuyển vào công việc</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Đăng việc làm mới</p>
                      <p className="text-sm text-muted-foreground">Khi nhà tuyển dụng đăng một công việc mới</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Hướng dẫn thiết lập</CardTitle>
                <CardDescription>
                  Thiết lập tích hợp Zapier với TopMarketingJobs trong vài phút
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="bg-primary/80 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      1
                    </div>
                    <h3 className="font-semibold">Tạo tài khoản Zapier</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    Nếu bạn chưa có tài khoản, đăng ký tại <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Zapier.com</a>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="bg-primary/80 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      2
                    </div>
                    <h3 className="font-semibold">Tạo một Zap mới</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    Trong Zapier, tạo một Zap mới và chọn "Webhook by Zapier" làm Trigger
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="bg-primary/80 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      3
                    </div>
                    <h3 className="font-semibold">Chọn "Catch Hook"</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    Chọn tùy chọn "Catch Hook" để nhận dữ liệu từ TopMarketingJobs
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="bg-primary/80 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      4
                    </div>
                    <h3 className="font-semibold">Sao chép Webhook URL</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    Zapier sẽ cung cấp cho bạn một Webhook URL. Sao chép URL này
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="bg-primary/80 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      5
                    </div>
                    <h3 className="font-semibold">Dán Webhook URL vào biểu mẫu này</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    Dán URL vào trường bên trái và nhấp "Lưu cài đặt"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="bg-primary/80 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                      6
                    </div>
                    <h3 className="font-semibold">Hoàn thành Zap của bạn</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    Quay lại Zapier để thiết lập các hành động mong muốn (gửi email, thông báo, v.v.)
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-center">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://zapier.com/apps/webhooks/integrations" target="_blank" rel="noopener noreferrer">
                      Truy cập Zapier
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ZapierIntegration;
