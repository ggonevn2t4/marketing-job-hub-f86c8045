
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skill } from '@/types/profile';
import { Code, Pencil, Plus, Trash2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Tên kỹ năng không được để trống' }),
  level: z.string().optional(),
});

type SkillsFormProps = {
  skills: Skill[];
  isLoading: boolean;
  onAdd: (data: Skill) => void;
  onUpdate: (id: string, data: Partial<Skill>) => void;
  onDelete: (id: string) => void;
};

const skillLevelOptions = [
  { value: 'beginner', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' },
  { value: 'expert', label: 'Chuyên gia' },
];

const SkillsForm = ({ skills, isLoading, onAdd, onUpdate, onDelete }: SkillsFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      level: '',
    },
  });

  const openAddDialog = () => {
    form.reset({
      name: '',
      level: '',
    });
    setEditId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (skill: Skill) => {
    form.reset({
      name: skill.name,
      level: skill.level || '',
    });
    setEditId(skill.id || null);
    setDialogOpen(true);
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (editId) {
      onUpdate(editId, data);
    } else {
      onAdd(data as Skill);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa kỹ năng này?')) {
      onDelete(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Kỹ năng</CardTitle>
        <Button variant="outline" size="sm" onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm kỹ năng
        </Button>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <Alert>
            <AlertDescription>
              Bạn chưa thêm kỹ năng nào. Hãy thêm kỹ năng để hoàn thiện hồ sơ.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="border rounded-md p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <Code className="h-4 w-4 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    {skill.level && (
                      <p className="text-xs text-muted-foreground">
                        {skillLevelOptions.find(option => option.value === skill.level)?.label || skill.level}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openEditDialog(skill)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(skill.id || '')}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editId ? 'Sửa kỹ năng' : 'Thêm kỹ năng mới'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên kỹ năng <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: JavaScript, Photoshop..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trình độ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trình độ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {skillLevelOptions.map((option) => (
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

export default SkillsForm;
