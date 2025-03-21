
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues, companySizeOptions } from './types/companyProfile';

type CompanyDetailsProps = {
  form: UseFormReturn<CompanyFormValues>;
};

const CompanyDetails = ({ form }: CompanyDetailsProps) => {
  return (
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
  );
};

export default CompanyDetails;
