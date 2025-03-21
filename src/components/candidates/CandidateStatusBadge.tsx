
import { Badge } from "@/components/ui/badge";

interface CandidateStatusBadgeProps {
  status: string;
}

// Mapping for candidate statuses and their respective badges
const statusBadges: Record<string, { bg: string; text: string }> = {
  new: { bg: "bg-blue-100", text: "text-blue-800" },
  contacted: { bg: "bg-purple-100", text: "text-purple-800" },
  interviewing: { bg: "bg-green-100", text: "text-green-800" },
  offer: { bg: "bg-amber-100", text: "text-amber-800" },
  hired: { bg: "bg-emerald-100", text: "text-emerald-800" },
  rejected: { bg: "bg-red-100", text: "text-red-800" },
};

const CandidateStatusBadge = ({ status }: CandidateStatusBadgeProps) => {
  const statusKey = status || "new";
  const { bg, text } = statusBadges[statusKey] || 
    statusBadges.new;
  
  const statusLabels: Record<string, string> = {
    new: "Mới",
    contacted: "Đã liên hệ",
    interviewing: "Đang phỏng vấn",
    offer: "Đã đề xuất",
    hired: "Đã tuyển",
    rejected: "Đã từ chối",
  };

  return (
    <Badge 
      variant="outline" 
      className={`${bg} ${text} hover:${bg}`}
    >
      {statusLabels[statusKey] || statusKey}
    </Badge>
  );
};

export default CandidateStatusBadge;
