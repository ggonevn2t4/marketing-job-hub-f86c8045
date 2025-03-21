
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CompanyProfile } from '@/types/profile';
import { Loader2, Building, Calendar, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Tên công ty phải có ít nhất 2 ký tự' }),
  website: z.string().url({ message: 'Website không hợp lệ' }).optional().or(z.literal('')),
  industry: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  company_size: z.string().optional(),
  founded_year: z.string()
    .refine(val => !val || !isNaN(parseInt(val)), {
      message: 'Năm thành lập phải là số'
    })
    .transform(val => val ? parseInt(val) : undefined)
    .optional(),
});

type CompanyProfileFormProps = {
  profile: CompanyProfile | null;
  isLoading: boolean;
  onSubmit: (data: Partial<CompanyProfile>) => void;
};

const companySizeOptions = [
  { value: '1-10', label: '1-10 nhân viên' },
  { value: '11-50', label: '11-50 nhân viên' },
  { value: '51-200', label: '51-200 nhân viên' },
  { value: '201-500', label: '201-500 nhân viên' },
  { value: '501-1000', label: '501-1000 nhân viên' },
  { value: '1001+', label: 'Hơn 1000 nhân viên' },
];

const CompanyProfileForm = ({ profile, isLoading, onSubmit }: CompanyProfileFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profile?.name || '',
      website: profile?.website || '',
      industry: profile?.industry || '',
      location: profile?.location || '',
      description: profile?.description || '',
      company_size: profile?.company_size || '',
      founded_year: profile?.founded_year ? String(profile.founded_year) : '',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      name: data.name,
      website: data.website || null,
      industry: data.industry || null,
      location: data.location || null,
      description: data.description || null,
      company_size: data.company_size || null,
      // Here we use the transformed value which is already a number or undefined
      founded_year: data.founded_year ?? null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin công ty</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.logo || ''} alt={profile?.name || ''} />
            <AvatarFallback>{profile?.name?.slice(0, 2) || 'C'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{profile?.name || 'Chưa cập nhật tên công ty'}</h3>
            <p className="text-sm text-muted-foreground">Cập nhật logo và thông tin công ty</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên công ty</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên công ty" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngành nghề</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Công nghệ thông tin, Tài chính..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Địa chỉ công ty" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      Quy mô công ty
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quy mô công ty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companySizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="founded_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      Năm thành lập
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ví dụ: 2010" 
                        min="1900" 
                        max={new Date().getFullYear()}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới thiệu về công ty</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả về công ty, lĩnh vực hoạt động, văn hóa..." 
                      className="resize-none" 
                      rows={4}
                      {...field} 
                    />
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

export default CompanyProfileForm;
