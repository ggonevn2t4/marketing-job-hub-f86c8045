
import { CandidateWithStatus } from "@/types/candidate";

interface CandidateSkillsAndPositionProps {
  candidate: CandidateWithStatus;
}

const CandidateSkillsAndPosition = ({ candidate }: CandidateSkillsAndPositionProps) => {
  const getLatestPosition = (candidate: CandidateWithStatus) => {
    if (!candidate.experience || candidate.experience.length === 0) {
      return 'Chưa có kinh nghiệm';
    }
    return candidate.experience[0].position || 'N/A';
  };

  const getSkillsList = (candidate: CandidateWithStatus) => {
    if (!candidate.skills || candidate.skills.length === 0) {
      return 'Chưa có kỹ năng';
    }
    return candidate.skills.map(skill => skill.name).join(', ');
  };

  return (
    <div>
      <div className="font-medium">{getLatestPosition(candidate)}</div>
      <div className="text-sm text-muted-foreground mt-1">
        {getSkillsList(candidate)}
      </div>
    </div>
  );
};

export default CandidateSkillsAndPosition;
