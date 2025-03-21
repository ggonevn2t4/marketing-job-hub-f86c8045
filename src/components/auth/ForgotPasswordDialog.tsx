
import { ForgotPasswordFormValues } from './ForgotPasswordForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ForgotPasswordFormValues) => Promise<void>;
  isLoading: boolean;
  resetRequestSent: boolean;
}

const ForgotPasswordDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  resetRequestSent
}: ForgotPasswordDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quên mật khẩu</DialogTitle>
          <DialogDescription>
            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </DialogDescription>
        </DialogHeader>
        
        {resetRequestSent ? (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 animate-fade-in" />
            </div>
            <p className="mb-4 font-medium">Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.</p>
            <p className="text-sm text-muted-foreground">Vui lòng kiểm tra hộp thư đến và thư rác.</p>
          </div>
        ) : (
          <ForgotPasswordForm 
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
