import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth';
import { 
  fetchUserRole, 
  signUpUser, 
  signInUser, 
  signOutUser, 
  signInWithGoogle,
  handleAuthCallback 
} from '@/services/authService';

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const setupUser = async (session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setupUser(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session?.user?.id);
        setSession(session);
        await setupUser(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
          setUser(null);
          setUserRole(null);
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
      setUser(null);
      setUserRole(null);
      
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

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Starting sign in for:", email);
      
      const data = await signInUser(email, password);
      console.log("Sign in result:", data);

      if (data?.user) {
        const role = await fetchUserRole(data.user.id);
        setUserRole(role);
        
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

  const signOut = async (redirectPath = '/') => {
    try {
      setIsLoading(true);
      await signOutUser();
      
      setUser(null);
      setUserRole(null);
      
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

  const logout = signOut; // Alias for backward compatibility

  return {
    user,
    session,
    userRole,
    isLoading,
    signUp,
    signIn,
    signInWithSocial,
    processAuthCallback,
    signOut,
    logout,
  };
};
