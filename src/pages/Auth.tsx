
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/components/ui/use-toast';
import { resetPassword } from '@/services/authService';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm, { RegisterFormValues } from '@/components/auth/RegisterForm';
import ForgotPasswordDialog from '@/components/auth/ForgotPasswordDialog';
import { ForgotPasswordFormValues } from '@/components/auth/ForgotPasswordForm';

const Auth = () => {
  const { signIn, signUp, signInWithSocial, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  const { toast } = useToast();
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetRequestSent, setResetRequestSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onLoginSubmit = async (values: { email: string; password: string; }) => {
    setLoginError(null);
    try {
      await signIn(values.email, values.password);
    } catch (error: any) {
      console.error('Login error details:', error);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setRegistrationError(null);
    try {
      await signUp(values.email, values.password, values.fullName, values.role);
    } catch (error: any) {
      console.error('Registration error details:', error);
    }
  };

  const onForgotPasswordSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await resetPassword(values.email);
      setResetRequestSent(true);
      toast({
        title: "Yêu cầu đặt lại mật khẩu đã được gửi",
        description: "Vui lòng kiểm tra email của bạn để tiếp tục quy trình đặt lại mật khẩu.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        variant: "destructive",
        title: "Lỗi đặt lại mật khẩu",
        description: error.message || "Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu.",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithSocial('google');
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Đăng nhập</CardTitle>
                <CardDescription>
                  Đăng nhập vào tài khoản của bạn để tiếp tục.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm 
                  isLoading={isLoading}
                  onSubmit={onLoginSubmit}
                  onForgotPassword={() => setForgotPasswordOpen(true)}
                  onGoogleSignIn={handleGoogleSignIn}
                  loginError={loginError}
                />
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" onClick={() => setActiveTab('register')}>
                  Chưa có tài khoản? Đăng ký ngay
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Đăng ký tài khoản</CardTitle>
                <CardDescription>
                  Tạo tài khoản mới để bắt đầu tìm kiếm hoặc đăng việc làm.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterForm 
                  isLoading={isLoading}
                  onSubmit={onRegisterSubmit}
                  onGoogleSignIn={handleGoogleSignIn}
                  registrationError={registrationError}
                />
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" onClick={() => setActiveTab('login')}>
                  Đã có tài khoản? Đăng nhập
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <ForgotPasswordDialog
          isOpen={forgotPasswordOpen}
          onOpenChange={setForgotPasswordOpen}
          onSubmit={onForgotPasswordSubmit}
          isLoading={isLoading}
          resetRequestSent={resetRequestSent}
        />
      </div>
    </Layout>
  );
};

export default Auth;
