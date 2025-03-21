
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { CandidateWithStatus } from "@/types/candidate";
import CandidateInfo from "./CandidateInfo";
import CandidateSkillsAndPosition from "./CandidateSkillsAndPosition";
import CandidateStatusSelect from "./CandidateStatusSelect";
import CandidateActions from "./CandidateActions";

interface CandidateTableRowProps {
  candidate: CandidateWithStatus;
  isSelected: boolean;
  onSelectChange: (isSelected: boolean) => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

const CandidateTableRow = ({
  candidate,
  isSelected,
  onSelectChange,
  onUpdateStatus,
}: CandidateTableRowProps) => {
  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: vi 
    });
  };

  return (
    <TableRow>
      <TableCell>
        <input 
          type="checkbox" 
          className="h-4 w-4 rounded border-gray-300"
          checked={isSelected}
          onChange={(e) => onSelectChange(e.target.checked)}
        />
      </TableCell>
      
      <TableCell>
        <CandidateInfo candidate={candidate} />
      </TableCell>
      
      <TableCell>
        <CandidateSkillsAndPosition candidate={candidate} />
      </TableCell>
      
      <TableCell>
        {getFormattedDate(candidate.created_at)}
      </TableCell>
      
      <TableCell>
        <CandidateStatusSelect 
          status={candidate.status || 'new'} 
          onStatusChange={(value) => onUpdateStatus(candidate.id, value)}
        />
      </TableCell>
      
      <TableCell>
        <CandidateActions 
          candidateId={candidate.id} 
          resumeUrl={candidate.resume_url} 
          onUpdateStatus={onUpdateStatus}
        />
      </TableCell>
    </TableRow>
  );
};

export default CandidateTableRow;
