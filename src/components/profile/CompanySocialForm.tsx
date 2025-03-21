
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CompanyProfile } from '@/types/profile';
import { Loader2, Linkedin, Facebook, Twitter } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  linkedin: z.string().url({ message: 'URL không hợp lệ' }).optional().or(z.literal('')),
  twitter: z.string().url({ message: 'URL không hợp lệ' }).optional().or(z.literal('')),
  facebook: z.string().url({ message: 'URL không hợp lệ' }).optional().or(z.literal('')),
});

type CompanySocialFormProps = {
  profile: CompanyProfile | null;
  isLoading: boolean;
  onSubmit: (data: Partial<CompanyProfile>) => void;
};

const CompanySocialForm = ({ profile, isLoading, onSubmit }: CompanySocialFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedin: profile?.social_media?.linkedin || '',
      twitter: profile?.social_media?.twitter || '',
      facebook: profile?.social_media?.facebook || '',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      social_media: {
        linkedin: data.linkedin || undefined,
        twitter: data.twitter || undefined,
        facebook: data.facebook || undefined,
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mạng xã hội</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                    LinkedIn
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/company/your-company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                    Twitter
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://twitter.com/your-company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Facebook className="h-4 w-4 mr-2 text-blue-800" />
                    Facebook
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/your-company" {...field} />
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
                'Cập nhật mạng xã hội'
              )}
            </Button>
          </form>
        </Form>
        
        <Alert className="mt-6">
          <AlertDescription>
            Cập nhật các kênh mạng xã hội của công ty giúp ứng viên có thể tìm hiểu thêm về văn hóa và hoạt động của công ty bạn.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CompanySocialForm;
