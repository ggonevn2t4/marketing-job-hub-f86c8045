
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Award,
  Eye
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

export interface JobProps {
  id: string;
  title: string;
  company_name?: string;
  company?: string;  // Alternative to company_name for backward compatibility
  company_logo?: string;
  logo?: string;     // Alternative to company_logo for backward compatibility
  location: string;
  job_type?: string;
  jobType?: string;  // Alternative to job_type for backward compatibility
  experience_level?: string;
  experienceLevel?: string; // Alternative to experience_level for backward compatibility
  salary?: string;
  created_at?: string;
  postedAt?: string; // Alternative to created_at for backward compatibility
  is_featured?: boolean;
  isFeatured?: boolean; // Alternative to is_featured for backward compatibility
  is_hot?: boolean;
  isHot?: boolean;   // Alternative to is_hot for backward compatibility
  is_urgent?: boolean;
  isUrgent?: boolean; // Alternative to is_urgent for backward compatibility
  description?: string;
  company_id?: string;
  views?: number;
  category_name?: string;
}

const JobCard = ({ 
  id, 
  title, 
  company_name, 
  company,
  company_logo, 
  logo,
  location, 
  job_type, 
  jobType,
  experience_level,
  experienceLevel,
  salary,
  created_at,
  postedAt,
  is_featured,
  isFeatured,
  is_hot,
  isHot,
  is_urgent,
  isUrgent,
  views
}: JobProps) => {
  const isMobile = useIsMobile();
  
  // Use the alternative props if the original ones are not provided
  const displayCompanyName = company_name || company || '';
  const displayLogo = company_logo || logo;
  const displayJobType = job_type || jobType || '';
  const displayExperienceLevel = experience_level || experienceLevel;
  const displayCreatedAt = created_at || postedAt || '';
  const displayFeatured = is_featured || isFeatured || false;
  const displayHot = is_hot || isHot || false;
  const displayUrgent = is_urgent || isUrgent || false;

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
    return `${Math.floor(diffInDays / 365)} năm trước`;
  };

  return (
    <Card className={`border overflow-hidden transition-all hover:border-primary/50 hover:shadow-sm ${displayFeatured ? 'ring-1 ring-primary/30 bg-primary/5' : ''}`}>
      <CardContent className={isMobile ? "p-4" : "p-6"}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden border bg-gray-100 flex-shrink-0">
            {displayLogo ? (
              <img src={displayLogo} alt={displayCompanyName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-sm">
                {displayCompanyName.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start sm:items-center flex-col sm:flex-row sm:gap-2 mb-1">
              <h3 className="font-semibold text-base sm:text-lg truncate w-full">
                <Link to={`/jobs/${id}`} className="hover:text-primary transition-colors">
                  {title}
                </Link>
              </h3>
              
              <div className="flex gap-1 flex-wrap mt-1 sm:mt-0">
                {displayHot && (
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">
                    Hot
                  </Badge>
                )}
                {displayUrgent && (
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                    Gấp
                  </Badge>
                )}
                {displayFeatured && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                    Nổi bật
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-muted-foreground flex items-center gap-2 mb-2 sm:mb-3">
              <Building size={14} />
              <span className="text-sm">{displayCompanyName}</span>
            </div>
            
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-y-1.5' : 'grid-cols-2 gap-x-4 gap-y-2'} text-sm mb-3 sm:mb-4`}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase size={14} />
                <span>{displayJobType}</span>
              </div>
              
              {displayExperienceLevel && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award size={14} />
                  <span>{displayExperienceLevel}</span>
                </div>
              )}
              
              {salary && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign size={14} />
                  <span>{salary}</span>
                </div>
              )}
            </div>
            
            <div className={`flex items-center ${isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                <Calendar size={14} />
                <span>{displayCreatedAt ? timeAgo(displayCreatedAt) : ''}</span>
                
                {views !== undefined && (
                  <div className="flex items-center gap-1 ml-3">
                    <Eye size={14} />
                    <span>{views} lượt xem</span>
                  </div>
                )}
              </div>
              
              <Button asChild size="sm" variant="outline" className={isMobile ? "w-full touch-target" : ""}>
                <Link to={`/jobs/${id}`}>Xem chi tiết</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
