
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Phone, Mail, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedCandidates } from '@/hooks/useSavedCandidates';
import type { CandidateProfile } from '@/types/profile';
import MessageButton from '@/components/messaging/MessageButton';

interface CandidateCardProps {
  candidate: CandidateProfile;
  showSaveButton?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  showSaveButton = true
}) => {
  const { user } = useAuth();
  const { saveCandidate, unsaveCandidate, isCandidateSaved } = useSavedCandidates();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user && showSaveButton) {
      checkIfSaved();
    }
  }, [user, candidate.id, showSaveButton]);

  const checkIfSaved = async () => {
    if (user && candidate.id) {
      const saved = await isCandidateSaved(candidate.id);
      setIsSaved(saved);
    }
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSaved) {
      await unsaveCandidate(candidate.id);
      setIsSaved(false);
    } else {
      await saveCandidate(candidate.id);
      setIsSaved(true);
    }
  };

  // Lấy kinh nghiệm làm việc mới nhất
  const latestExperience = candidate.experience && candidate.experience.length > 0
    ? candidate.experience[0]
    : null;

  // Lấy thành phố từ địa chỉ (đơn giản hóa)
  const city = candidate.address?.split(',').pop()?.trim() || 'Không có địa chỉ';

  // Tính tổng số năm kinh nghiệm (đơn giản hóa)
  const calculateExperience = () => {
    if (!candidate.experience || candidate.experience.length === 0) {
      return 'Chưa có kinh nghiệm';
    }
    
    // Trong thực tế, bạn sẽ muốn tính toán chính xác hơn
    return `${candidate.experience.length} năm kinh nghiệm`;
  };

  // Lấy trình độ học vấn cao nhất
  const getHighestEducation = () => {
    if (!candidate.education || candidate.education.length === 0) {
      return 'Chưa có thông tin';
    }
    
    // Đơn giản hóa, trong thực tế cần logic phức tạp hơn
    return candidate.education[0].degree || 'Đại học';
  };

  // Tạo initials từ full_name
  const getInitials = () => {
    if (!candidate.full_name) return 'U';
    
    return candidate.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="hover:border-primary transition-all cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {candidate.avatar_url ? (
              <img 
                src={candidate.avatar_url} 
                alt={candidate.full_name || 'User'} 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                {getInitials()}
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-1">{candidate.full_name || 'Không có tên'}</h3>
            <p className="text-primary font-medium mb-2">{latestExperience?.position || 'Chưa có thông tin'}</p>
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin size={16} className="mr-1" />
              <span>{city}</span>
              <span className="mx-2">•</span>
              <Briefcase size={16} className="mr-1" />
              <span>{calculateExperience()}</span>
              <span className="mx-2">•</span>
              <GraduationCap size={16} className="mr-1" />
              <span>{getHighestEducation()}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {candidate.skills && candidate.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill.name}</Badge>
              ))}
              {(!candidate.skills || candidate.skills.length === 0) && (
                <span className="text-sm text-muted-foreground">Chưa có kỹ năng</span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <Button size="sm" variant="outline">
                  <Phone size={14} className="mr-1" /> Liên hệ
                </Button>
                <Button size="sm" variant="outline">
                  <Mail size={14} className="mr-1" /> Gửi email
                </Button>
                <MessageButton 
                  recipientId={candidate.id}
                  recipientName={candidate.full_name || 'Ứng viên'}
                  recipientAvatar={candidate.avatar_url || undefined}
                />
              </div>
              <div className="flex gap-2">
                {showSaveButton && user && (
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={handleSaveClick}
                    className="rounded-full"
                  >
                    <Bookmark 
                      className={cn(
                        "h-5 w-5", 
                        isSaved ? "fill-primary text-primary" : "text-muted-foreground"
                      )} 
                    />
                  </Button>
                )}
                <Button size="sm">Xem chi tiết</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
