
import { z } from 'zod';
import { CompanyProfile } from '@/types/profile';

export const companyFormSchema = z.object({
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

export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export type CompanyProfileFormProps = {
  profile: CompanyProfile | null;
  isLoading: boolean;
  onSubmit: (data: Partial<CompanyProfile>) => void;
};

export const companySizeOptions = [
  { value: '1-10', label: '1-10 nhân viên' },
  { value: '11-50', label: '11-50 nhân viên' },
  { value: '51-200', label: '51-200 nhân viên' },
  { value: '201-500', label: '201-500 nhân viên' },
  { value: '501-1000', label: '501-1000 nhân viên' },
  { value: '1001+', label: 'Hơn 1000 nhân viên' },
];
