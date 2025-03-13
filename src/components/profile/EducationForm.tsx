
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Education } from '@/types/profile';
import { GraduationCap, Pencil, Plus, Trash2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  school: z.string().min(2, { message: 'Tên trường phải có ít nhất 2 ký tự' }),
  degree: z.string().optional(),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional(),
});

type EducationFormProps = {
  education: Education[];
  isLoading: boolean;
  onAdd: (data: Education) => void;
  onUpdate: (id: string, data: Partial<Education>) => void;
  onDelete: (id: string) => void;
};

const EducationForm = ({ education, isLoading, onAdd, onUpdate, onDelete }: EducationFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      description: '',
    },
  });

  const openAddDialog = () => {
    form.reset({
      school: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      description: '',
    });
    setEditId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (edu: Education) => {
    form.reset({
      school: edu.school,
      degree: edu.degree || '',
      field_of_study: edu.field_of_study || '',
      start_date: edu.start_date ? new Date(edu.start_date).toISOString().split('T')[0] : '',
      end_date: edu.end_date ? new Date(edu.end_date).toISOString().split('T')[0] : '',
      description: edu.description || '',
    });
    setEditId(edu.id || null);
    setDialogOpen(true);
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (editId) {
      onUpdate(editId, data);
    } else {
      onAdd(data as Education);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa thông tin học vấn này?')) {
      onDelete(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Học vấn</CardTitle>
        <Button variant="outline" size="sm" onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm học vấn
        </Button>
      </CardHeader>
      <CardContent>
        {education.length === 0 ? (
          <Alert>
            <AlertDescription>
              Bạn chưa thêm thông tin học vấn. Hãy thêm để hoàn thiện hồ sơ.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">{edu.school}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(edu)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(edu.id || '')}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                
                {(edu.degree || edu.field_of_study) && (
                  <p className="text-sm mb-1">
                    {edu.degree} {edu.field_of_study && `- ${edu.field_of_study}`}
                  </p>
                )}
                
                {(edu.start_date || edu.end_date) && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {edu.start_date ? new Date(edu.start_date).toLocaleDateString('vi-VN') : ''} 
                    {edu.start_date && edu.end_date && ' - '} 
                    {edu.end_date ? new Date(edu.end_date).toLocaleDateString('vi-VN') : 'Hiện tại'}
                  </p>
                )}
                
                {edu.description && <p className="text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editId ? 'Sửa thông tin học vấn' : 'Thêm học vấn mới'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên trường <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Tên trường học" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bằng cấp</FormLabel>
                      <FormControl>
                        <Input placeholder="Cử nhân, Thạc sĩ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="field_of_study"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chuyên ngành</FormLabel>
                      <FormControl>
                        <Input placeholder="Ngành học" {...field} />
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
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Mô tả thêm về quá trình học tập" 
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

export default EducationForm;
