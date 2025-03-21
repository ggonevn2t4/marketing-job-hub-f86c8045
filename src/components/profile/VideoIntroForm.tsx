
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Loader2, PlayCircle, Video, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  video_url: z.string().url({ message: 'URL không hợp lệ' }).or(z.literal('')),
});

type VideoIntroFormProps = {
  videoUrl: string | null;
  isLoading: boolean;
  onUpdate: (data: { video_intro_url: string | null }) => void;
};

const VideoIntroForm = ({ videoUrl, isLoading, onUpdate }: VideoIntroFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      video_url: videoUrl || '',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onUpdate({
      video_intro_url: data.video_url || null,
    });
  };

  // Helper to extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video giới thiệu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {videoUrl && embedUrl && (
            <div className="border rounded-md p-2">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <iframe
                  src={embedUrl}
                  title="Video giới thiệu"
                  className="h-full w-full rounded-md"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </AspectRatio>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm truncate max-w-[300px]">{videoUrl}</span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onUpdate({ video_intro_url: null })}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Xóa video
                </Button>
              </div>
            </div>
          )}

          {!videoUrl && (
            <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center bg-muted/50">
              <Video className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="mb-1 font-medium">Thêm video giới thiệu</p>
              <p className="text-sm text-muted-foreground mb-4">Hãy chia sẻ đường dẫn đến video giới thiệu về bản thân</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đường dẫn video</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Cập nhật video'
                )}
              </Button>
            </form>
          </Form>

          <Alert>
            <AlertDescription>
              Video giới thiệu là cách hiệu quả để thể hiện tính cách, kỹ năng giao tiếp và sự chuyên nghiệp của bạn. Một video ngắn 1-2 phút giới thiệu về bản thân, kỹ năng và kinh nghiệm sẽ tạo ấn tượng tốt với nhà tuyển dụng.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoIntroForm;
