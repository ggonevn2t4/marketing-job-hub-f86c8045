
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Define a simplified Job interface for the props
interface JobProps {
  id: string;
  title: string;
}

const formSchema = z.object({
  full_name: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().optional(),
  cover_letter: z.string().optional(),
  resume_url: z.string().url({
    message: 'Please enter a valid URL for your resume.',
  }),
});

interface JobApplicationFormProps {
  job: JobProps;
  onSuccess?: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!job?.id) {
      toast({
        title: 'Error',
        description: 'Job ID is missing. Cannot submit application.',
        variant: 'destructive',
      });
      return;
    }

    // Ensure required fields are present
    const formData = {
      job_id: job.id,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      cover_letter: values.cover_letter,
      resume_url: values.resume_url,
    };

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert(formData)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Your application has been submitted successfully!',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/application-tracker');
      }
      
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
              jobId: job.id,
              applicantName: values.full_name,
            },
          }),
        });
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
    } catch (error: any) {
      console.error('There was an error submitting the application', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@example.com" {...field} />
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
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover_letter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a brief cover letter here..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resume_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/resume.pdf" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit Application</Button>
      </form>
    </Form>
  );
};

export default JobApplicationForm;
