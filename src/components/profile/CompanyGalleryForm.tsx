
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Loader2, UploadCloud, Trash2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Tiêu đề quá ngắn' }),
  description: z.string().optional(),
});

type Photo = {
  id: string;
  url: string;
  title: string;
  description?: string;
};

type CompanyGalleryFormProps = {
  companyId: string;
  isLoading: boolean;
};

const CompanyGalleryForm = ({ companyId, isLoading }: CompanyGalleryFormProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [addMode, setAddMode] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    // Giả lập việc tải ảnh từ database
    // Trong triển khai thực tế, bạn sẽ tải từ Supabase
    const mockPhotos: Photo[] = [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
        title: 'Không gian làm việc',
        description: 'Khu vực làm việc chung của công ty'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
        title: 'Buổi thảo luận nhóm',
        description: 'Team building hàng tuần'
      }
    ];
    
    setTimeout(() => {
      setPhotos(mockPhotos);
      setLoading(false);
    }, 1000);
  }, [companyId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async (data: z.infer<typeof formSchema>) => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    try {
      // Giả lập việc tải lên
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Cập nhật state
      const newPhoto: Photo = {
        id: Math.random().toString(36).substring(7),
        url: URL.createObjectURL(selectedFile),
        title: data.title,
        description: data.description,
      };
      
      setPhotos(prev => [...prev, newPhoto]);
      setAddMode(false);
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;
    
    setLoading(true);
    
    try {
      // Giả lập việc xóa
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Cập nhật state
      setPhotos(prev => prev.filter(photo => photo.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Thư viện ảnh công ty</CardTitle>
        {!addMode && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAddMode(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm ảnh
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {addMode ? (
              <div className="border rounded-md p-4 mb-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Chọn ảnh</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Kéo thả hoặc click để chọn ảnh</p>
                        <Input 
                          type="file" 
                          accept="image/*" 
                          className="w-full" 
                          onChange={handleFileChange}
                        />
                        {selectedFile && (
                          <p className="mt-2 text-sm text-green-600">
                            Đã chọn: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề ảnh <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tiêu đề cho ảnh" {...field} />
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
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Mô tả ngắn về ảnh" 
                              className="resize-none"
                              rows={3}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setAddMode(false);
                          form.reset();
                          setSelectedFile(null);
                        }}
                      >
                        Hủy
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={!selectedFile || uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tải lên...
                          </>
                        ) : (
                          'Tải lên'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ) : null}
            
            {photos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="border rounded-md overflow-hidden">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={photo.url} 
                        alt={photo.title} 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-3">
                      <h3 className="font-medium">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-sm text-muted-foreground mt-1">{photo.description}</p>
                      )}
                      <div className="mt-2 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(photo.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  Chưa có ảnh nào trong thư viện. Hãy thêm ảnh để giới thiệu về không gian làm việc và văn hóa công ty.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
        
        <Alert className="mt-6">
          <AlertDescription>
            Thư viện ảnh giúp ứng viên có cái nhìn trực quan về môi trường làm việc, văn hóa công ty và các hoạt động nội bộ. Điều này giúp thu hút những ứng viên phù hợp với văn hóa công ty của bạn.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CompanyGalleryForm;
