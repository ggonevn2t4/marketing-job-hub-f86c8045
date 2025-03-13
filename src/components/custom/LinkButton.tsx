
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { VariantProps } from 'class-variance-authority';

interface LinkButtonProps extends VariantProps<typeof buttonVariants> {
  href: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  external?: boolean;
}

const LinkButton = ({
  href,
  children,
  variant = "default",
  size = "default",
  className,
  showArrow = false,
  external = false,
  ...props
}: LinkButtonProps) => {
  const linkClass = cn(
    buttonVariants({ variant, size }),
    showArrow && "group",
    className
  );

  if (external) {
    return (
      <a 
        href={href} 
        className={linkClass} 
        target="_blank" 
        rel="noopener noreferrer"
        {...props}
      >
        <span>{children}</span>
        {showArrow && (
          <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </a>
    );
  }

  return (
    <Link to={href} className={linkClass} {...props}>
      <span>{children}</span>
      {showArrow && (
        <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
};

export default LinkButton;
