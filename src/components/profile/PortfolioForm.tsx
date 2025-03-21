
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  portfolio_url: z.string().url({ message: 'URL không hợp lệ' }).or(z.literal('')),
});

type PortfolioFormProps = {
  portfolioUrl: string | null;
  isLoading: boolean;
  onUpdate: (data: { portfolio_url: string | null }) => void;
};

const PortfolioForm = ({ portfolioUrl, isLoading, onUpdate }: PortfolioFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      portfolio_url: portfolioUrl || '',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onUpdate({
      portfolio_url: data.portfolio_url || null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio cá nhân</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {portfolioUrl && (
            <div className="p-4 bg-secondary/20 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="secondary" className="mr-2">Portfolio</Badge>
                <span className="text-sm truncate max-w-[300px]">{portfolioUrl}</span>
              </div>
              <a 
                href={portfolioUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary flex items-center hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="text-sm">Xem</span>
              </a>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="portfolio_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đường dẫn portfolio</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://your-portfolio.com" 
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
                  'Cập nhật portfolio'
                )}
              </Button>
            </form>
          </Form>

          <Alert className="mt-6">
            <AlertDescription>
              Portfolio là nơi trưng bày các dự án và sản phẩm bạn đã thực hiện. Hãy thêm đường dẫn đến trang web portfolio của bạn để nhà tuyển dụng có thể xem chi tiết hơn về các kỹ năng và kinh nghiệm của bạn.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioForm;
