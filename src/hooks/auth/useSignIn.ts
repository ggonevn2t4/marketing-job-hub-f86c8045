
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { signInUser, signInWithGoogle, fetchUserRole } from '@/services/authService';

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Starting sign in for:", email);
      
      const data = await signInUser(email, password);
      console.log("Sign in result:", data);

      if (data?.user) {
        const role = await fetchUserRole(data.user.id);
        
        toast({
          title: "Đăng nhập thành công!",
          description: "Chào mừng bạn quay trở lại.",
        });
        
        navigate('/');
        return data;
      }
    } catch (error: any) {
      console.error("Error during sign in:", error);
      
      let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email hoặc mật khẩu không chính xác.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email chưa được xác nhận. Vui lòng kiểm tra hộp thư của bạn.";
      }
      
      toast({
        title: "Đăng nhập thất bại",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithSocial = async (provider: 'google') => {
    try {
      setIsLoading(true);
      console.log(`Starting sign in with ${provider}`);
      
      if (provider === 'google') {
        await signInWithGoogle();
      }
      
    } catch (error: any) {
      console.error(`Error during ${provider} sign in:`, error);
      
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || `Không thể đăng nhập với ${provider}. Vui lòng thử lại.`,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signInWithSocial,
    isLoading
  };
};
