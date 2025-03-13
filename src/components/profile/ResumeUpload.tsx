
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Upload, Trash2, Loader2, Download, FileIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ResumeUploadProps {
  resumeUrl: string | null;
  isLoading: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

const ResumeUpload = ({ resumeUrl, isLoading, onUpload, onDelete }: ResumeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [processingUpload, setProcessingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFileUpload(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Kiểm tra loại file
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Loại file không hợp lệ',
        description: 'Chỉ chấp nhận file PDF hoặc Word (.doc, .docx)',
        variant: 'destructive',
      });
      return;
    }
    
    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File quá lớn',
        description: 'Kích thước file không được vượt quá 5MB',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setProcessingUpload(true);
      await onUpload(file);
      toast({
        title: 'Tải lên thành công',
        description: 'CV của bạn đã được tải lên',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi khi tải lên',
        description: error.message || 'Đã xảy ra lỗi khi tải CV lên',
        variant: 'destructive',
      });
    } finally {
      setProcessingUpload(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa CV này?')) {
      try {
        setProcessingUpload(true);
        await onDelete();
        toast({
          title: 'Xóa thành công',
          description: 'CV của bạn đã được xóa',
        });
      } catch (error: any) {
        toast({
          title: 'Lỗi khi xóa',
          description: error.message || 'Đã xảy ra lỗi khi xóa CV',
          variant: 'destructive',
        });
      } finally {
        setProcessingUpload(false);
      }
    }
  };

  const getFileNameFromUrl = (url: string) => {
    if (!url) return 'CV';
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Hồ sơ CV
        </CardTitle>
        <CardDescription>
          Tải lên CV của bạn để nhà tuyển dụng có thể xem. Chấp nhận file PDF hoặc Word (.doc, .docx) dưới 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!resumeUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Kéo & thả CV của bạn vào đây</h3>
            <p className="text-sm text-muted-foreground mb-4">hoặc</p>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isLoading || processingUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || processingUpload}
            >
              {processingUpload ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Chọn file
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileIcon className="h-10 w-10 mr-3 text-primary" />
                <div>
                  <h3 className="font-medium">{getFileNameFromUrl(resumeUrl)}</h3>
                  <p className="text-sm text-muted-foreground">
                    Đã tải lên thành công
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(resumeUrl, '_blank')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Xem
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isLoading || processingUpload}
                >
                  {processingUpload ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                Bạn có thể xóa CV hiện tại và tải lên một CV mới bằng cách nhấn vào nút xóa bên trên.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;
