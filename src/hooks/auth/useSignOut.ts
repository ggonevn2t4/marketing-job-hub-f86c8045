
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { signOutUser } from '@/services/authService';

export const useSignOut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signOut = async (redirectPath = '/') => {
    try {
      setIsLoading(true);
      await signOutUser();
      
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi tài khoản.",
      });
      
      navigate(redirectPath);
    } catch (error: any) {
      console.error("Error during sign out:", error);
      
      toast({
        title: "Đăng xuất thất bại",
        description: error.message,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signOut,
    isLoading
  };
};
