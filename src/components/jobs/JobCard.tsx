
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

export interface JobProps {
  id: string;
  title: string;
  company_name: string;
  company_logo?: string;
  location: string;
  job_type: string;
  experience_level?: string;
  salary?: string;
  created_at: string;
  is_featured?: boolean;
  is_hot?: boolean;
  is_urgent?: boolean;
  description?: string;
  company_id?: string;
  views?: number;
  category_name?: string;
}

const JobCard = ({ 
  id, 
  title, 
  company_name, 
  company_logo, 
  location, 
  job_type, 
  experience_level,
  salary,
  created_at,
  is_featured,
  is_hot,
  is_urgent,
  views
}: JobProps) => {
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
    <Card className={`border overflow-hidden transition-all hover:border-primary/50 hover:shadow-sm ${is_featured ? 'ring-1 ring-primary/30 bg-primary/5' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-md overflow-hidden border bg-gray-100 flex-shrink-0">
            {company_logo ? (
              <img src={company_logo} alt={company_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-sm">
                {company_name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">
                <Link to={`/jobs/${id}`} className="hover:text-primary transition-colors">
                  {title}
                </Link>
              </h3>
              
              <div className="flex gap-1 flex-wrap">
                {is_hot && (
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">
                    Hot
                  </Badge>
                )}
                {is_urgent && (
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                    Gấp
                  </Badge>
                )}
                {is_featured && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                    Nổi bật
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-muted-foreground flex items-center gap-2 mb-3">
              <Building size={14} />
              <span className="text-sm">{company_name}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase size={14} />
                <span>{job_type}</span>
              </div>
              
              {experience_level && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award size={14} />
                  <span>{experience_level}</span>
                </div>
              )}
              
              {salary && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign size={14} />
                  <span>{salary}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar size={14} />
                <span>{timeAgo(created_at)}</span>
                
                {views !== undefined && (
                  <div className="flex items-center gap-1 ml-3">
                    <Eye size={14} />
                    <span>{views} lượt xem</span>
                  </div>
                )}
              </div>
              
              <Button asChild size="sm" variant="outline">
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
