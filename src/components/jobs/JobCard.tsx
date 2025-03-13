
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { MapPin, Building, Clock, Briefcase, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import useBookmarkJob from '@/hooks/useBookmarkJob';
import { useEffect } from 'react';

export interface JobProps {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  jobType: string;
  experienceLevel: string;
  postedAt: string;
  isFeatured?: boolean;
  isHot?: boolean;
  isUrgent?: boolean;
  showBookmark?: boolean;
}

const JobCard = ({
  id,
  title,
  company,
  logo,
  location,
  salary,
  jobType,
  experienceLevel,
  postedAt,
  isFeatured = false,
  isHot = false,
  isUrgent = false,
  showBookmark = true,
}: JobProps) => {
  const { user } = useAuth();
  const { savedJobs, fetchSavedJobs, saveJob, unsaveJob, isJobSaved } = useBookmarkJob();
  
  useEffect(() => {
    if (user && showBookmark) {
      fetchSavedJobs();
    }
  }, [user, showBookmark]);
  
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isJobSaved(id)) {
      await unsaveJob(id);
    } else {
      await saveJob(id);
    }
  };
  
  return (
    <Link to={`/jobs/${id}`}>
      <Card className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30 group',
        isFeatured && 'border-primary/30 bg-primary/5'
      )}>
        <CardContent className="p-5">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border">
              <img src={logo} alt={company} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {title}
                  </h3>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Building size={14} className="flex-shrink-0" />
                    <span className="truncate">{company}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {isFeatured && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Nổi bật
                    </Badge>
                  )}
                  {isHot && (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                      Hot
                    </Badge>
                  )}
                  {isUrgent && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      Gấp
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center text-sm text-muted-foreground gap-1">
                  <MapPin size={14} className="flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-1">
                  <Briefcase size={14} className="flex-shrink-0" />
                  <span className="truncate">{experienceLevel}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t flex flex-wrap items-center justify-between gap-y-2">
                <div className="font-medium text-foreground">
                  {salary}
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {jobType}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{postedAt}</span>
                  </div>
                  
                  {showBookmark && user && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={handleBookmarkClick}
                    >
                      <Bookmark 
                        size={16} 
                        className={cn(
                          isJobSaved(id) ? "fill-primary text-primary" : "text-muted-foreground"
                        )} 
                      />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default JobCard;
