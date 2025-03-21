
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { handleAuthCallback } from '@/services/authService';

export const useAuthCallback = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const processAuthCallback = async () => {
    try {
      setIsLoading(true);
      console.log("Processing auth callback");
      
      const result = await handleAuthCallback();
      
      if (result.session) {
        toast({
          title: "Đăng nhập thành công!",
          description: "Chào mừng bạn quay trở lại.",
        });
        
        navigate('/');
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Không thể xác thực. Vui lòng thử lại.",
          variant: "destructive",
        });
        
        navigate('/auth');
      }
    } catch (error: any) {
      console.error("Error processing auth callback:", error);
      
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Có lỗi xảy ra khi xác thực. Vui lòng thử lại.",
        variant: "destructive",
      });
      
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processAuthCallback,
    isLoading
  };
};
