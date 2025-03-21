
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { signOutUser } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

export const useSignOut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signOut = async (redirectPath = '/auth') => {
    try {
      setIsLoading(true);
      
      // Gọi hàm signOutUser từ authService
      await signOutUser();
      
      // Hiển thị thông báo thành công
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi tài khoản.",
      });
      
      // Chuyển hướng đến trang xác định
      navigate(redirectPath);
    } catch (error: any) {
      console.error("Error during sign out:", error);
      
      // Hiển thị thông báo lỗi
      toast({
        title: "Đăng xuất thất bại",
        description: error.message || "Có lỗi xảy ra khi đăng xuất.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signOut,
    isLoading
  };
};
