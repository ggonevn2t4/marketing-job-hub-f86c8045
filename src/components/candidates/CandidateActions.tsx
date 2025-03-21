
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Mail, Download, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CandidateActionsProps {
  candidateId: string;
  resumeUrl?: string | null;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

const CandidateActions = ({ 
  candidateId, 
  resumeUrl, 
  onUpdateStatus 
}: CandidateActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendEmail = () => {
    toast({
      title: "Đang chuẩn bị email",
      description: "Chức năng gửi email đến ứng viên sẽ sớm được cập nhật."
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate(`/candidate/${candidateId}`)}
      >
        <Eye className="h-4 w-4 mr-1" />
        Chi tiết
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Gửi email
          </DropdownMenuItem>
          {resumeUrl && (
            <DropdownMenuItem onClick={() => window.open(resumeUrl, '_blank')}>
              <Download className="h-4 w-4 mr-2" />
              Tải CV
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onUpdateStatus(candidateId, 'hired')}>
            <UserCheck className="h-4 w-4 mr-2" />
            Đánh dấu đã tuyển
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(candidateId, 'rejected')}>
            <UserX className="h-4 w-4 mr-2" />
            Đánh dấu từ chối
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CandidateActions;
