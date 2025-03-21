
import { Mail, Phone } from "lucide-react";
import { CandidateWithStatus } from "@/types/candidate";

interface CandidateInfoProps {
  candidate: CandidateWithStatus;
}

const CandidateInfo = ({ candidate }: CandidateInfoProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
        {candidate.avatar_url ? (
          <img 
            src={candidate.avatar_url} 
            alt={candidate.full_name || ''} 
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-primary font-semibold">
            {candidate.full_name?.charAt(0) || 'U'}
          </span>
        )}
      </div>
      <div>
        <div className="font-medium">{candidate.full_name}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Mail className="h-3 w-3" /> {candidate.email || 'N/A'}
        </div>
        {candidate.phone && (
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" /> {candidate.phone}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateInfo;
