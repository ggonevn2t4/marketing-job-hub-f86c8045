
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface CategoryCardProps {
  title: string;
  icon: React.ReactNode;
  jobCount: number;
  slug: string;
  className?: string;
  id?: string;
}

const CategoryCard = ({
  title,
  icon,
  jobCount,
  slug,
  id,
  className,
}: CategoryCardProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // Chuẩn bị params cho URL tìm kiếm
  const searchParams = new URLSearchParams();
  if (id) {
    searchParams.set('category', id);
  } else if (slug) {
    searchParams.set('category', slug);
  }
  
  return (
    <Link 
      to={`/jobs?${searchParams.toString()}`}
      className={cn(
        'block bg-card rounded-xl border p-6 transition-all duration-300 hover:shadow-md hover:border-primary/30 group',
        isMobile && 'p-4',
        className
      )}
    >
      <div className={cn(
        "space-y-4",
        isMobile && "flex items-center space-y-0 space-x-3"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors",
          isMobile && "w-10 h-10"
        )}>
          {icon}
        </div>
        
        <div>
          <h3 className={cn(
            "font-semibold text-lg group-hover:text-primary transition-colors",
            isMobile && "text-base"
          )}>
            {title}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {jobCount} việc làm
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
