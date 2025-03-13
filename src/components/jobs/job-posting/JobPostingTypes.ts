
import { z } from 'zod';

// Define form validation schema
export const JobFormSchema = z.object({
  title: z.string().min(3, { message: 'Vui lòng nhập chức danh công việc' }),
  category_id: z.string().min(1, { message: 'Vui lòng chọn ngành nghề' }),
  job_type: z.string().min(1, { message: 'Vui lòng chọn loại hình công việc' }),
  experience_level: z.string().min(1, { message: 'Vui lòng chọn kinh nghiệm yêu cầu' }),
  location: z.string().min(1, { message: 'Vui lòng nhập địa điểm làm việc' }),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  description: z.string().min(10, { message: 'Vui lòng nhập mô tả công việc chi tiết hơn' }),
  requirements: z.string().min(10, { message: 'Vui lòng nhập yêu cầu ứng viên chi tiết hơn' }),
  benefits: z.string().optional(),
  company: z.object({
    name: z.string().min(1, { message: 'Vui lòng nhập tên công ty' }),
    email: z.string().email({ message: 'Email không hợp lệ' }),
    phone: z.string().optional(),
    website: z.string().optional(),
    description: z.string().optional(),
  }),
});

export type JobFormValues = z.infer<typeof JobFormSchema>;

// Package type for job posting service selection
export interface JobPackage {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: {
    text: string;
    included: boolean;
  }[];
  popular?: boolean;
}
