
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { 
  companyFormSchema, 
  CompanyFormValues, 
  CompanyProfileFormProps 
} from './types/companyProfile';
import CompanyAvatar from './CompanyAvatar';
import BasicCompanyInfo from './BasicCompanyInfo';
import CompanyDetails from './CompanyDetails';

const CompanyProfileForm = ({ profile, isLoading, onSubmit }: CompanyProfileFormProps) => {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
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

  const handleSubmit = (data: CompanyFormValues) => {
    onSubmit({
      name: data.name,
      website: data.website || null,
      industry: data.industry || null,
      location: data.location || null,
      description: data.description || null,
      company_size: data.company_size || null,
      // Zod transforms founded_year from string to number (or undefined)
      // We need to handle this correctly to fix the TypeScript error
      founded_year: typeof data.founded_year === 'number' ? data.founded_year : null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin công ty</CardTitle>
      </CardHeader>
      <CardContent>
        <CompanyAvatar profile={profile} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicCompanyInfo form={form} />
            <CompanyDetails form={form} />
            
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
