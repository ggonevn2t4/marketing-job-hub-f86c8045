
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from './types/companyProfile';

type BasicCompanyInfoProps = {
  form: UseFormReturn<CompanyFormValues>;
};

const BasicCompanyInfo = ({ form }: BasicCompanyInfoProps) => {
  return (
    <>
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
    </>
  );
};

export default BasicCompanyInfo;
