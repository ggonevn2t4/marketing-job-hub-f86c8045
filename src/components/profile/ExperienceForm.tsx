
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Experience } from '@/types/profile';
import { Briefcase, Pencil, Plus, Trash2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  company: z.string().min(2, { message: 'Tên công ty phải có ít nhất 2 ký tự' }),
  position: z.string().min(2, { message: 'Vị trí phải có ít nhất 2 ký tự' }),
  location: z.string().optional(),
  is_current: z.boolean().default(false),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional(),
});

type ExperienceFormProps = {
  experience: Experience[];
  isLoading: boolean;
  onAdd: (data: Experience) => void;
  onUpdate: (id: string, data: Partial<Experience>) => void;
  onDelete: (id: string) => void;
};

const ExperienceForm = ({ experience, isLoading, onAdd, onUpdate, onDelete }: ExperienceFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: '',
      position: '',
      location: '',
      is_current: false,
      start_date: '',
      end_date: '',
      description: '',
    },
  });

  const isCurrentValue = form.watch('is_current');

  const openAddDialog = () => {
    form.reset({
      company: '',
      position: '',
      location: '',
      is_current: false,
      start_date: '',
      end_date: '',
      description: '',
    });
    setEditId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (exp: Experience) => {
    form.reset({
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      is_current: exp.is_current || false,
      start_date: exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : '',
      end_date: exp.end_date ? new Date(exp.end_date).toISOString().split('T')[0] : '',
      description: exp.description || '',
    });
    setEditId(exp.id || null);
    setDialogOpen(true);
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Nếu đang làm việc, clear end_date
    const formattedData = {
      ...data,
      end_date: data.is_current ? null : data.end_date,
    };

    if (editId) {
      onUpdate(editId, formattedData);
    } else {
      onAdd(formattedData as Experience);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thông tin kinh nghiệm này?')) {
      onDelete(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Kinh nghiệm làm việc</CardTitle>
        <Button variant="outline" size="sm" onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm kinh nghiệm
        </Button>
      </CardHeader>
      <CardContent>
        {experience.length === 0 ? (
          <Alert>
            <AlertDescription>
              Bạn chưa thêm thông tin kinh nghiệm làm việc. Hãy thêm để hoàn thiện hồ sơ.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">{exp.position}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(exp)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(exp.id || '')}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm mb-1">{exp.company}</p>
                
                {exp.location && (
                  <p className="text-sm text-muted-foreground mb-1">{exp.location}</p>
                )}
                
                <p className="text-sm text-muted-foreground mb-2">
                  {exp.start_date ? new Date(exp.start_date).toLocaleDateString('vi-VN') : ''} 
                  {exp.start_date && ' - '} 
                  {exp.is_current ? 'Hiện tại' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString('vi-VN') : '')}
                </p>
                
                {exp.description && <p className="text-sm">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editId ? 'Sửa thông tin kinh nghiệm' : 'Thêm kinh nghiệm mới'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên công ty <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Tên công ty" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vị trí <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Vị trí làm việc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa điểm</FormLabel>
                      <FormControl>
                        <Input placeholder="Địa điểm làm việc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày bắt đầu</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày kết thúc</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            disabled={isCurrentValue}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="is_current"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Tôi hiện đang làm việc tại đây</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Mô tả công việc và thành tựu" 
                          className="resize-none" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      editId ? 'Cập nhật' : 'Thêm mới'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ExperienceForm;
