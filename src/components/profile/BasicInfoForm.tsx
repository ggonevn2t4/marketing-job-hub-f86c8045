
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CandidateProfile } from '@/types/profile';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  full_name: z.string().min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' }),
  phone: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
});

type BasicInfoFormProps = {
  profile: CandidateProfile | null;
  isLoading: boolean;
  onSubmit: (data: Partial<CandidateProfile>) => void;
};

const BasicInfoForm = ({ profile, isLoading, onSubmit }: BasicInfoFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      bio: profile?.bio || '',
      address: profile?.address || '',
      date_of_birth: profile?.date_of_birth 
        ? new Date(profile.date_of_birth).toISOString().split('T')[0] 
        : '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
            <AvatarFallback>{profile?.full_name?.slice(0, 2) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{profile?.full_name || 'Chưa cập nhật tên'}</h3>
            <p className="text-sm text-muted-foreground">Cập nhật ảnh đại diện và thông tin cá nhân</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới thiệu bản thân</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả ngắn gọn về bản thân" 
                      className="resize-none" 
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Cập nhật thông tin'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;
