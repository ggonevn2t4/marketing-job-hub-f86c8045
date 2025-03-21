
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  isLoading: boolean;
  onSubmit: (values: ForgotPasswordFormValues) => Promise<void>;
}

const ForgotPasswordForm = ({
  isLoading,
  onSubmit,
}: ForgotPasswordFormProps) => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="you@example.com" 
                    className="pl-10" 
                    disabled={isLoading}
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="submit" 
            className="w-full transition-all hover:bg-primary/90 hover:shadow-md" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi yêu cầu...
              </>
            ) : (
              'Gửi hướng dẫn đặt lại'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
