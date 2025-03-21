
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { signUpUser, fetchUserRole } from '@/services/authService';

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      setIsLoading(true);
      console.log("Starting sign up for:", email, fullName, role);
      
      const result = await signUpUser(email, password, fullName, role);
      console.log("Sign up result:", result);
      
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      
      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        
        if (!userRole) {
          await supabase.auth.signOut();
          toast({
            title: "Đăng ký thất bại",
            description: "Không thể tạo thông tin người dùng, vui lòng thử lại sau.",
            variant: "destructive",
          });
          throw new Error("Failed to create user role");
        }
        
        toast({
          title: "Đăng ký thành công!",
          description: "Bạn đã đăng ký thành công.",
        });
        
        navigate('/');
      } else {
        toast({
          title: "Xác nhận email",
          description: "Vui lòng kiểm tra email để xác nhận tài khoản.",
        });
        navigate('/auth');
      }
      
      return result;
    } catch (error: any) {
      console.error("Error during sign up:", error);
      
      await supabase.auth.signOut();
      
      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
      
      if (error.message.includes("unique constraint")) {
        errorMessage = "Email này đã được sử dụng, vui lòng sử dụng email khác.";
      } else if (error.message.includes("password")) {
        errorMessage = "Mật khẩu không đáp ứng yêu cầu bảo mật.";
      } else if (error.message.includes("row-level security policy")) {
        errorMessage = "Lỗi cấu hình bảo mật, vui lòng liên hệ quản trị viên.";
      }
      
      toast({
        title: "Đăng ký thất bại",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading
  };
};
