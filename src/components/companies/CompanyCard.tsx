
import { Link } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface CompanyProps {
  id: string;
  name: string;
  logo: string;
  location: string;
  industry: string;
  jobCount: number;
  isFeatured?: boolean;
}

const CompanyCard = ({
  id,
  name,
  logo,
  location,
  industry,
  jobCount,
  isFeatured = false,
}: CompanyProps) => {
  return (
    <Link to={`/companies/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30 h-full group">
        <CardContent className="p-0">
          <div className="h-28 bg-gradient-to-r from-primary/10 to-blue-500/10 relative">
            {isFeatured && (
              <Badge className="absolute top-3 right-3">
                Nhà tuyển dụng hàng đầu
              </Badge>
            )}
          </div>
          
          <div className="-mt-12 px-5 flex flex-col items-center">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-background shadow-sm bg-background">
              <img src={logo} alt={name} className="w-full h-full object-cover" />
            </div>
            
            <div className="text-center mt-3 mb-5">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {name}
              </h3>
              
              <div className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-1">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-4">
                <Badge variant="secondary" className="font-normal">
                  {industry}
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1 font-normal">
                  <Briefcase size={12} />
                  <span>{jobCount} việc làm</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CompanyCard;
