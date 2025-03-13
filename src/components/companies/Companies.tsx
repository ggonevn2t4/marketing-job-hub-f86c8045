
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import CompanyCard, { CompanyProps } from './CompanyCard';
import LinkButton from '../custom/LinkButton';

interface CompaniesProps {
  companies: CompanyProps[];
  title?: string;
  description?: string;
  initialItems?: number;
  showLoadMore?: boolean;
  showViewAll?: boolean;
}

const Companies = ({
  companies,
  title,
  description,
  initialItems = 6,
  showLoadMore = true,
  showViewAll = false,
}: CompaniesProps) => {
  const [visibleItems, setVisibleItems] = useState(initialItems);
  
  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + 6, companies.length));
  };
  
  const hasMore = visibleItems < companies.length;
  
  return (
    <div className="space-y-8">
      {(title || description) && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.slice(0, visibleItems).map(company => (
          <CompanyCard key={company.id} {...company} />
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        {showLoadMore && hasMore && (
          <Button 
            variant="outline" 
            onClick={loadMore}
            className="gap-2"
          >
            Xem thêm
            <ChevronDown size={16} />
          </Button>
        )}
        
        {showViewAll && (
          <LinkButton 
            href="/companies" 
            variant="outline"
            showArrow
          >
            Xem tất cả nhà tuyển dụng
          </LinkButton>
        )}
      </div>
    </div>
  );
};

export default Companies;
