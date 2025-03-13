
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import MessageDialog from './MessageDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface MessageButtonProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
}

const MessageButton: React.FC<MessageButtonProps> = ({
  recipientId,
  recipientName,
  recipientAvatar,
  variant = "outline",
  size = "sm"
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để gửi tin nhắn cho ứng viên.",
        variant: "destructive"
      });
      return;
    }
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        onClick={handleClick}
      >
        <MessageCircle size={14} className="mr-1" /> Nhắn tin
      </Button>

      <MessageDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        recipientId={recipientId}
        recipientName={recipientName}
        recipientAvatar={recipientAvatar}
      />
    </>
  );
};

export default MessageButton;
